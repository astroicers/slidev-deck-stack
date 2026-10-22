#!/usr/bin/env node
// slidev-deck-stack · 靜態檢查器（零依賴，Node 18+）
//
// 用法：
//   node validate-deck.mjs <slides.md> [--target-minutes 30] [--click-budget 6]
//                                      [--require-notes] [--strict]
//
// 檢查什麼（對應 SKILL.md 鐵則與 references/pitfalls.md P0–P2）：
//   鐵則 #1  全域設定只能在 headmatter（出現在單頁 frontmatter → ERROR，Slidev 會靜默忽略）
//   鐵則 #2  `---` 分頁前後空行（後接內文會被當 frontmatter 吞掉 → ERROR；前無空行 → WARN）
//   鐵則 #3  手刻 `v-click="n"` 絕對索引過多 → WARN；`<v-clicks>` 與清單間沒空行 → ERROR；
//            每頁 click 估算超出預算 → WARN
//   鐵則 #4  magic-move 只用三個反引號 → ERROR
//   鐵則 #7  圖片相對路徑（./ ../）→ ERROR；非 `/` 開頭 → WARN
//   鐵則 #8  旁邊的 package.json 沒鎖 playwright-chromium → WARN（--strict → ERROR）
//   節奏     連續同 layout ≥ 4、長 deck 版面太單一、連續密集頁太多、單頁過擠 → WARN
//   備註     缺講者備註 → WARN（--require-notes → ERROR）；`minutes:` 加總超過
//            時長的 90% → ERROR；routeAlias 重複 → ERROR
//   其他     `mdc:` 已 deprecated（改 `comark:`）→ WARN；code fence 未閉合 → ERROR；
//            `zoom:` < 0.75 → WARN
//
// 分頁 / frontmatter / 備註的判定規則對齊 @slidev/parser（packages/parser/src/core.ts）：
//   - 以 `---` 開頭的行是分頁；**恰好** `---` 且下一行非空 → 下一段到下一個 `---` 為 frontmatter
//   - code fence 與 HTML 註解內的 `---` 不分頁
//   - 內文**結尾**的最後一個 `<!-- -->` 是講者備註
//
// 結束碼：有 ERROR → 1；否則 0。只做靜態檢查，取代不了 dev 模式逐頁看與匯出 PNG 目視。

import { readFileSync, existsSync } from 'node:fs'
import { dirname, join, basename } from 'node:path'

// ---------- 參數 ----------
const argv = process.argv.slice(2)
function flag(name) { return argv.includes(name) }
function opt(name, def) {
  const eq = argv.find(a => a.startsWith(`${name}=`))
  if (eq) return eq.slice(name.length + 1)
  const i = argv.indexOf(name)
  return i >= 0 && argv[i + 1] !== undefined ? argv[i + 1] : def
}
const file = argv.find(a => !a.startsWith('--') && !/^\d+(\.\d+)?$/.test(a) && a !== opt('--target-minutes') && a !== opt('--click-budget'))
if (!file || flag('--help')) {
  console.error('Usage: node validate-deck.mjs <slides.md> [--target-minutes 30] [--click-budget 6] [--require-notes] [--strict]')
  process.exit(2)
}
const STRICT = flag('--strict')
const REQUIRE_NOTES = flag('--require-notes') || STRICT
const CLICK_BUDGET = Number(opt('--click-budget', 6))
const targetMinutesArg = Number(opt('--target-minutes', NaN))

const src = readFileSync(file, 'utf8')
const lines = src.split(/\r?\n/)
const errors = []
const warnings = []
const name = basename(file)
const E = (line, msg) => errors.push(`ERROR ${name}:${line}  ${msg}`)
const W = (line, msg) => warnings.push(`WARN  ${name}:${line}  ${msg}`)

// ---------- 迷你 YAML（只取 key / 純量值 / 一層巢狀）----------
function parseYamlLite(yamlLines) {
  const out = {}
  let parent = null
  for (const raw of yamlLines) {
    if (!raw.trim() || raw.trim().startsWith('#')) continue
    const m = raw.match(/^(\s*)([A-Za-z0-9_-]+)\s*:\s*(.*)$/)
    if (!m) {
      if (parent && /^\s+-\s+/.test(raw)) { // 清單值
        const v = raw.replace(/^\s+-\s+/, '').trim()
        if (!Array.isArray(out[parent])) out[parent] = []
        out[parent].push(stripQuotes(v))
      }
      continue
    }
    const [, indent, key, rest] = m
    const value = stripQuotes(rest.replace(/\s+#.*$/, '').trim())
    if (indent.length === 0) {
      parent = key
      out[key] = value === '' ? {} : value
    }
    else if (parent) {
      if (typeof out[parent] !== 'object' || Array.isArray(out[parent])) out[parent] = {}
      out[parent][key] = value
    }
  }
  return out
}
function stripQuotes(v) {
  if (/^(['"]).*\1$/.test(v)) return v.slice(1, -1)
  if (v === 'true') return true
  if (v === 'false') return false
  if (/^-?\d+(\.\d+)?$/.test(v)) return Number(v)
  return v
}
function looksLikeYaml(block) {
  const nonEmpty = block.filter(l => l.trim())
  if (!nonEmpty.length) return false
  return nonEmpty.every(l => /^\s*[A-Za-z0-9_-]+\s*:/.test(l) || /^\s+-\s/.test(l) || /^\s*#/.test(l) || /^\s{2,}\S/.test(l))
}

// ---------- 切頁（對齊 @slidev/parser）----------
const slides = []      // { start, fmLines, fmStart, contentStart, end }
let start = 0, contentStart = 0, fmLines = [], fmStart = -1
let inComment = false
let fenceOpenLine = -1
function slice(end) {
  if (start === end) return
  slides.push({ start, fmLines, fmStart, contentStart, end })
  start = end + 1
  contentStart = end + 1
  fmLines = []
  fmStart = -1
}
for (let i = 0; i < lines.length; i++) {
  const raw = lines[i]
  const line = raw.trimEnd()
  if (inComment) { if (raw.includes('-->')) inComment = false; continue }
  if (line.startsWith('---')) {
    // 鐵則 #2：分隔線前一行要空（第一行的 headmatter 例外）
    if (i > 0 && lines[i - 1].trim() !== '') W(i + 1, '分頁線 `---` 前面沒有空行（鐵則 #2）')
    slice(i)
    const next = lines[i + 1]
    if (line[3] !== '-' && next?.trim()) {
      // Slidev 會把下一段當 frontmatter
      let j = i + 1
      for (; j < lines.length; j++) if (lines[j].trimEnd() === '---') break
      const block = lines.slice(i + 1, j)
      if (j === lines.length) {
        E(i + 1, '分頁線 `---` 後直接接內文且找不到閉合 `---`，整段會被當 frontmatter 吞掉（鐵則 #2：分隔線後留一個空行）')
      }
      else if (!looksLikeYaml(block)) {
        E(i + 1, '分頁線 `---` 後直接接內文，Slidev 會把它當成 frontmatter YAML 吞掉（鐵則 #2：分隔線後留一個空行）')
      }
      fmStart = i + 1
      fmLines = block
      start = i
      i = j
      contentStart = i + 1
    }
  }
  else if (line.trimStart().startsWith('```')) {
    const level = line.match(/^\s*(`+)/)[1]
    let j = i + 1
    for (; j < lines.length; j++) if (lines[j].startsWith(level)) break
    if (j === lines.length) { fenceOpenLine = i + 1; break }
    i = j
  }
  else if (/<!--/.test(raw) && !/-->/.test(raw.slice(raw.indexOf('<!--')))) {
    inComment = true
  }
}
if (fenceOpenLine > 0) E(fenceOpenLine, 'code fence 沒有閉合，之後的分頁線都會失效')
if (start <= lines.length - 1) slice(lines.length)

// ---------- 每頁解析 ----------
const HEADMATTER_ONLY = new Set([
  'titleTemplate', 'theme', 'addons', 'remoteAssets', 'download', 'codeCopy', 'magicMoveCopy', 'author',
  'info', 'keywords', 'highlighter', 'twoslash', 'lineNumbers', 'colorSchema', 'routerMode', 'aspectRatio',
  'canvasWidth', 'selectable', 'themeConfig', 'fonts', 'favicon', 'drawings', 'plantUmlServer', 'record',
  'remote', 'css', 'presenter', 'browserExporter', 'htmlAttrs', 'comark', 'mdc', 'editor', 'mcp',
  'contextMenu', 'wakeLock', 'pwa', 'exportFilename', 'monaco', 'monacoTypesSource',
  'monacoTypesAdditionalPackages', 'monacoTypesIgnorePackages', 'monacoRunAdditionalDeps',
  'monacoRunUseStrict', 'seoMeta', 'notesAutoRuby', 'duration', 'timer', 'magicMoveDuration', 'shiki',
  'preloadImages', 'defaults',
])
const HERO_LAYOUTS = new Set(['cover', 'intro', 'section', 'statement', 'fact', 'quote', 'end', 'center', 'image', 'iframe'])

const hasHeadmatter = slides.length && slides[0].fmStart === 1 && lines[0].trimEnd() === '---'
if (!hasHeadmatter) W(1, '沒有 headmatter（第一行不是 `---`）；theme / fonts / title 等全域設定無處可放（鐵則 #1）')
const headmatter = hasHeadmatter ? parseYamlLite(slides[0].fmLines) : {}

function parseDurationMinutes(v) {
  if (v === undefined || v === null || v === '') return NaN
  if (typeof v === 'number') return v
  const s = String(v).trim().toLowerCase()
  const h = s.match(/(\d+(?:\.\d+)?)\s*h/)
  const m = s.match(/(\d+(?:\.\d+)?)\s*m/)
  if (h || m) return (h ? Number(h[1]) * 60 : 0) + (m ? Number(m[1]) : 0)
  return /^\d+(\.\d+)?$/.test(s) ? Number(s) : NaN
}
const targetMinutes = Number.isFinite(targetMinutesArg) ? targetMinutesArg : parseDurationMinutes(headmatter.duration)

if (hasHeadmatter) {
  if ('mdc' in headmatter) W(slides[0].fmStart, '`mdc:` 已標 deprecated（MDC 併入 Comark），改用 `comark: true`')
  const sans = headmatter.fonts && typeof headmatter.fonts === 'object' ? headmatter.fonts.sans : undefined
  const first = Array.isArray(sans) ? sans[0] : typeof sans === 'string' ? sans.split(',')[0].trim() : ''
  if (first && /Noto (Sans|Serif) (TC|SC|HK|JP|KR)|Source Han|PingFang|Microsoft (JhengHei|YaHei)|思源|蘋方|微軟正黑/i.test(first))
    W(slides[0].fmStart, `fonts.sans 第一個是 CJK 字型「${first}」：拉丁字型放前、CJK 當 fallback，英文與數字才漂亮（setup.md §5）`)
}

const layouts = []
const routeAliases = new Map()
const minutesList = []
let noteCount = 0

slides.forEach((s, idx) => {
  const fm = parseYamlLite(s.fmLines)
  const fmLine = s.fmStart > 0 ? s.fmStart : s.start + 1
  const isFirst = idx === 0
  const contentLines = lines.slice(s.contentStart, s.end)
  const content = contentLines.join('\n').trim()
  const firstContentLine = s.contentStart + 1

  // 鐵則 #1：全域鍵跑到單頁 frontmatter
  if (!isFirst || !hasHeadmatter) {
    for (const k of Object.keys(fm)) {
      if (HEADMATTER_ONLY.has(k)) E(fmLine, `\`${k}:\` 是全域設定，只能寫在檔案最上方第一個 \`---\` 區塊（headmatter）；寫在第 ${idx + 1} 頁的 frontmatter 會靜默失效（鐵則 #1）`)
    }
  }

  // layout 序列
  const layout = fm.layout || (isFirst ? 'cover' : 'default')
  layouts.push(layout)

  // routeAlias
  if (fm.routeAlias) {
    const alias = String(fm.routeAlias)
    if (routeAliases.has(alias)) E(fmLine, `routeAlias「${alias}」與第 ${routeAliases.get(alias)} 頁重複`)
    else routeAliases.set(alias, idx + 1)
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(alias)) W(fmLine, `routeAlias「${alias}」建議用小寫英文 slug（如 cover / demo-workflow），方便 <Link to> 與備註對照`)
  }

  // zoom
  if (fm.zoom !== undefined && Number(fm.zoom) < 0.75) W(fmLine, `zoom: ${fm.zoom} 太小，投影時字會看不清；先刪字 / 拆頁 / 換 layout，再考慮 zoom（theming-style.md §6）`)

  // 圖片路徑（鐵則 #7）
  for (const key of ['image', 'background']) {
    const v = fm[key]
    if (typeof v === 'string') {
      if (/^\.{1,2}\//.test(v)) E(fmLine, `${key}: ${v} 用了相對路徑，build 後會 404；放 public/ 並用 /x.png 絕對路徑（鐵則 #7）`)
      else if (!/^(\/|https?:|data:)/.test(v)) W(fmLine, `${key}: ${v} 不是 / 開頭的絕對路徑，確認放在 public/ 且用 /x.png 引用（鐵則 #7）`)
    }
  }
  contentLines.forEach((l, i) => {
    const ln = firstContentLine + i
    const md = l.match(/!\[[^\]]*\]\((\.{1,2}\/[^)\s]+)/)
    if (md) E(ln, `圖片 ${md[1]} 用了相對路徑，build 後會 404；放 public/ 用 /x.png（鐵則 #7）`)
    const html = l.match(/\ssrc=["'](\.{1,2}\/[^"']+)["']/)
    if (html) E(ln, `src=${html[1]} 用了相對路徑，build 後會 404；放 public/ 用 /x.png（鐵則 #7）`)

    // 鐵則 #4：magic-move 要四個反引號
    const mm = l.match(/^(`+)\s*(md|markdown)?\s*magic-move/)
    if (mm && mm[1].length < 4) E(ln, 'magic-move 外層要用**四個**反引號 ````md magic-move（鐵則 #4）')

    // 鐵則 #3：<v-clicks> 與清單之間要空行
    if (/^\s*<v-clicks[^>]*>\s*$/.test(l) && /^\s*([-*+]|\d+\.)\s/.test(contentLines[i + 1] || '')) E(ln + 1, '`<v-clicks>` 與 Markdown 清單之間沒空行，清單不會被解析（animation.md §2）')
    if (/^\s*<\/v-clicks>\s*$/.test(l) && /^\s*([-*+]|\d+\.)\s/.test(contentLines[i - 1] || '')) E(ln, '`</v-clicks>` 前面沒空行，會被併進清單項目（animation.md §2）')
  })

  // 鐵則 #3：手刻絕對索引
  const absIdx = (content.match(/v-click="\d+"/g) || []).length
  if (absIdx >= 3) W(firstContentLine, `第 ${idx + 1} 頁手刻了 ${absIdx} 個 v-click="n" 絕對索引，插一行就要全部重編；改用 <v-clicks>（鐵則 #3）`)

  // click 預算估算
  const clicks = fm.clicks !== undefined ? Number(fm.clicks) : estimateClicks(content)
  if (clicks > CLICK_BUDGET) W(firstContentLine, `第 ${idx + 1} 頁估算約 ${clicks} 擊（預算 ${CLICK_BUDGET}）：講者會數錯、觀眾會累，優先拆頁（animation.md §4）`)

  // 密度
  const bodyNoCode = content.replace(/```[\s\S]*?```/g, '')
  const bullets = (bodyNoCode.match(/^\s{0,1}([-*+]|\d+\.)\s/gm) || []).length
  if (bullets > 8) W(firstContentLine, `第 ${idx + 1} 頁有 ${bullets} 條清單項目，投影讀不完；拆頁或改 two-cols（theming-style.md §6）`)
  const h1 = bodyNoCode.match(/^#\s+(.+)$/m)
  if (h1 && [...h1[1].replace(/<[^>]+>/g, '')].length > 24) W(firstContentLine, `第 ${idx + 1} 頁標題超過 24 字，會折行或溢出；改成 action title 一句話（theming-style.md §6）`)

  // 備註
  const comments = [...content.matchAll(/<!--([\s\S]*?)-->/g)]
  const last = comments[comments.length - 1]
  const note = last && last.index + last[0].length >= content.length ? last[1].trim() : ''
  if (note) {
    noteCount++
    const noteBullets = (note.match(/^\s*([-*+]|\d+\.)\s/gm) || []).length
    if (noteBullets > 7) W(firstContentLine, `第 ${idx + 1} 頁講者備註有 ${noteBullets} 條，提詞卡建議 3–5 條（presenter-notes.md §2）`)
  }
  else if (content && !fm.src) {
    (REQUIRE_NOTES ? E : W)(firstContentLine, `第 ${idx + 1} 頁沒有講者備註（內文結尾的 <!-- --> 區塊）；正式 talk 每頁都要有（presenter-notes.md）`)
  }
  minutesList.push(fm.minutes !== undefined ? Number(fm.minutes) : NaN)
  if (fm.minutes !== undefined && !(Number(fm.minutes) > 0)) E(fmLine, `minutes: ${fm.minutes} 要是大於 0 的數字`)

  // 密集頁判定（給節奏檢查用）
  s._dense = !HERO_LAYOUTS.has(layout) && (bullets >= 5 || /```/.test(content))
})

function estimateClicks(content) {
  let n = 0
  // v-click 元件 / 指令（排除 v-clicks）
  n += (content.match(/<v-click(?![s])[\s>]/g) || []).length
  n += (content.match(/\sv-click(?![s])(?:[.=\s>\/])/g) || []).length
  // <v-clicks> 內清單項目
  for (const m of content.matchAll(/<v-clicks([^>]*)>([\s\S]*?)<\/v-clicks>/g)) {
    const attrs = m[1]
    const every = Number((attrs.match(/every="?(\d+)"?/) || [])[1] || 1)
    const depth = Number((attrs.match(/depth="?(\d+)"?/) || [])[1] || 1)
    const items = (m[2].match(/^\s*([-*+]|\d+\.)\s/gm) || []).filter(x => depth > 1 || !/^\s{2,}/.test(x)).length
    n += Math.ceil(items / every)
  }
  // 行高亮分段 {1|2-3|all}
  for (const m of content.matchAll(/^`{3,}\s*\w+[^\n{]*\{([^}\n]*\|[^}\n]*)\}/gm)) n += m[1].split('|').length - 1
  // magic-move 區塊數 - 1
  for (const m of content.matchAll(/^`{4,}\s*(?:md|markdown)?\s*magic-move[^\n]*\n([\s\S]*?)^`{4,}\s*$/gm)) {
    const blocks = (m[1].match(/^`{3}\s*\w+/gm) || []).length
    n += Math.max(0, blocks - 1)
  }
  return n
}

// ---------- 節奏 ----------
let run = 1
for (let i = 1; i < layouts.length; i++) {
  if (layouts[i] === layouts[i - 1]) { run++; if (run === 4) W(slides[i].start + 1, `連續 ${run} 頁都是 layout: ${layouts[i]}，版面單調；穿插 section / fact / statement / quote / two-cols（deck-planning.md §4）`) }
  else run = 1
}
if (slides.length >= 10 && new Set(layouts).size < 4) W(1, `全 deck ${slides.length} 頁只用了 ${new Set(layouts).size} 種 layout；10 頁以上至少 4 種（deck-planning.md §4）`)
let dense = 0
slides.forEach((s, i) => {
  if (s._dense) { dense++; if (dense === 5) W(s.start + 1, '連續 5 頁密集頁（程式碼 / 長清單），觀眾沒地方換氣；每 3–4 頁插一頁 section / fact / statement（deck-planning.md §4）') }
  else dense = 0
})

// ---------- 時間預算 ----------
const timed = minutesList.filter(m => Number.isFinite(m) && m > 0)
const planned = timed.reduce((a, b) => a + b, 0)
const complete = slides.length > 0 && timed.length === slides.length
if (timed.length && !complete) W(1, `只有 ${timed.length}/${slides.length} 頁有 minutes:，時間預算檢查跳過；要嘛全填、要嘛全不填`)
if (complete && Number.isFinite(targetMinutes) && targetMinutes > 0) {
  if (planned > targetMinutes * 0.9) E(1, `各頁 minutes 加總 ${planned.toFixed(1)} 分，超過 ${targetMinutes} 分的 90%（${(targetMinutes * 0.9).toFixed(1)} 分）；要留停頓 / 互動 / 意外的緩衝（presenter-notes.md §3）`)
  else if (planned < targetMinutes * 0.55) W(1, `各頁 minutes 加總 ${planned.toFixed(1)} 分，不到 ${targetMinutes} 分的 55%；確認不是講稿太薄`)
}
if (complete && !(Number.isFinite(targetMinutes) && targetMinutes > 0)) W(1, '每頁都填了 minutes，但沒有總時長可比對：headmatter 加 `duration: 30min` 或傳 --target-minutes')

// ---------- 鐵則 #8：package.json ----------
const pkgPath = join(dirname(file), 'package.json')
if (existsSync(pkgPath)) {
  try {
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))
    const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) }
    if (!deps['playwright-chromium']) (STRICT ? E : W)(1, `${basename(dirname(file)) || '.'}/package.json 沒鎖 playwright-chromium，換機器 / CI 匯不出 PDF：npm i -D playwright-chromium（鐵則 #8）`)
    if (!deps['@slidev/cli']) W(1, 'package.json 沒有 @slidev/cli，確認這是 Slidev 專案')
  }
  catch { W(1, 'package.json 不是合法 JSON') }
}

// ---------- 輸出 ----------
for (const w of warnings) console.warn(w)
for (const e of errors) console.error(e)
console.log(`validate-deck: ${slides.length} 頁，${noteCount} 頁有備註，${complete ? `${planned.toFixed(1)} 分（計畫）` : '時間未完整規劃'}，${errors.length} 錯誤，${warnings.length} 警告`)
process.exit(errors.length ? 1 : 0)
