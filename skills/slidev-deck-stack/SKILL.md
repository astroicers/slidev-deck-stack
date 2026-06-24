---
name: slidev-deck-stack
description: |
  Slidev 技術簡報整合規範，涵蓋 Slidev v52（Vue + Markdown）+ headmatter/frontmatter
  分層設定 + 內建 layouts + slots + UnoCSS + Shiki 高亮 / magic-move + `<<<` 匯入 +
  Mermaid / PlantUML / inline SVG / KaTeX + v-click / v-clicks / v-after / v-motion +
  主題與中文字型 + 匯出 PDF/PPTX/PNG/SPA + presenter 與部署。
  當你要用 Slidev 做技術簡報、研討會 talk、教學投影片、產品 demo deck 時必須載入。
  Handles: 開新 deck 與目錄結構、分頁與版面 layout、程式碼與圖表呈現、逐步揭示動畫、
  主題與中文字型、匯出與部署排錯。
  Triggers: Slidev, 投影片, 簡報, slides, deck, talk, 技術分享, 教學投影片,
  headmatter, frontmatter, two-cols, layout, magic-move, v-click, v-clicks,
  mermaid, plantuml, katex, 匯出 PDF, PPTX, slidev export, 中文字型, presenter, 部署.
---

# Slidev Deck Stack — Slidev 技術簡報整合規範

本 skill 固化「用 Slidev 把技術簡報做對」（研討會 talk、技術分享、教學投影片、產品
demo deck）的跨功能整合知識。目標：**第一版 deck 就符合規範**，不靠事後重構補課。

對照基準：Slidev **v52**（`@slidev/cli` 52.16.x）。所有 API/語法/旗標以 https://sli.dev
官方文件為準，查證紀錄見 repo 根目錄 `.fact-check.md`。

## 五層架構

```
┌──────────────────────────────────────────────────────────────┐
│  內容層（Markdown）                                            │
│  headmatter 全域設定 ＋ per-slide frontmatter ＋ Markdown 內文 │
│  ＋ MDC（Comark）行內樣式                                      │
├──────────────────────────────────────────────────────────────┤
│  版面層（Layout）                                              │
│  內建 layouts（cover / two-cols / image-right / center…）      │
│  ＋ slots（::left:: / ::right::）＋ 主題 ＋ 嵌入的 Vue 元件     │
├──────────────────────────────────────────────────────────────┤
│  展示層（Code & Diagram）                                      │
│  Shiki 行高亮 / magic-move / `<<<` 匯入、Mermaid / PlantUML、   │
│  inline SVG 架構圖、KaTeX                                       │
├──────────────────────────────────────────────────────────────┤
│  動畫層（Interaction）                                         │
│  v-click / v-clicks / v-after / v-motion、$clicks、transition  │
├──────────────────────────────────────────────────────────────┤
│  樣式 ＋ 交付層                                                │
│  UnoCSS utilities / 主題 token / 中文字型 ‖ 匯出 PDF/PPTX/      │
│  PNG/SPA、presenter 備註、部署                                  │
└──────────────────────────────────────────────────────────────┘
```

**核心原則**：全域設定走 headmatter、每頁設定走 per-slide frontmatter；版面走內建
layout、不手刻；圖走程式碼、不截圖。

## 鐵則（MUST，違反即重寫）

1. **Headmatter 只在第一個 `---` 區塊** 全域設定（theme / title / transition / fonts /
   mdc…）只能寫在 `slides.md` 最上方第一個 `---` 區塊；其後每個 slide 的 `---` 是該頁
   per-slide frontmatter（layout / class / clicks…）。寫錯位置全域設定會**靜默失效**，
   不報錯也不生效，最難 debug。
2. **`---` 分頁前後各空一行** 分隔線上下必須各留一個空行，否則會被當成 Markdown
   水平線、或被併進前一頁內文，整份分頁全亂。
3. **逐項揭示用 `<v-clicks>` 包裹，不手刻 `v-click` 索引** 列表/多元素用 `<v-clicks>`
   自動排序（巢狀用 `depth`、一次多項用 `every`）；只有要精準插隊時才用 `v-click="n"`。
   手刻一堆絕對索引，插一行就要全部重編號。一頁的 click 數要可控。
4. **程式碼用行高亮 + magic-move，不貼整坨** 用 `{1|2-3}` 逐步聚焦重點行、用四個反引號
   的 ` ```md magic-move ` 演化多步；長片段用 `<<< @/snippets/x.ts` 從檔案匯入，
   別把整坨原始碼貼進 slide（無法聚焦、超出畫面、改一次要兩地同步）。
5. **版面走內建 layout + slots，不手刻排版 CSS** 雙欄用 `two-cols` + `::right::`、
   圖文用 `image-left` / `image-right`、置中宣告用 `center` / `statement`。自己刻
   flex/grid 會與主題、匯出比例、presenter 縮放打架，且換主題就破版。
6. **圖表走程式碼生成，不貼截圖** 流程/時序用 Mermaid、UML 用 PlantUML、數學用 KaTeX、
   自訂架構圖用 inline SVG（能被 UnoCSS 上色、被 v-click 逐步點亮）。截圖在投影與匯出
   會糊、不能改、深色模式對不上、字也選不起來。
7. **靜態資源放 `public/`，用絕對路徑 `/foo.png` 引用** 沿用 Vite 慣例；放錯位置或用相對
   路徑，`slidev build` 後會 404。大圖先壓再放，否則拖慢載入與匯出。
8. **匯出要可重現：鎖 `playwright-chromium` + 點擊步驟用旗標** 匯出 PDF/PPTX/PNG 依賴
   `playwright-chromium`，鎖進 `devDependencies` 才能在 CI 重現；要保留逐步動畫用
   `slidev export --with-clicks`；中文字型必須在匯出環境可得，否則 PDF 變方框（見
   theming-style.md、export-delivery.md）。

## 逐步揭示與動畫選型表（選型路由）

| 需求 | 用什麼 | 參考檔 |
|------|--------|--------|
| 列表/區塊逐項出現 | `<v-clicks>`（巢狀 `depth`、一次多項 `every`） | [references/animation.md](references/animation.md) |
| 精準控制某元素在第幾擊出現/消失 | `v-click="n"` / `v-after` / `.hide` | [references/animation.md](references/animation.md) |
| 元素進場帶位移/縮放動態 | `v-motion` | [references/animation.md](references/animation.md) |
| 換整頁的過場效果 | headmatter/frontmatter `transition:` | [references/animation.md](references/animation.md) |
| 程式碼逐行聚焦 | 行高亮 `{1\|2-3}` | [references/code-and-diagrams.md](references/code-and-diagrams.md) |
| 程式碼多步演化（A→B→C） | magic-move | [references/code-and-diagrams.md](references/code-and-diagrams.md) |
| 把元素拖到精準位置（箭頭/標籤/圖示） | `v-drag` / `<v-drag-arrow>` | [references/animation.md](references/animation.md) |
| 同一件事多種寫法收頁籤（npm/yarn、JS/TS） | code groups（需 `comark: true`） | [references/code-and-diagrams.md](references/code-and-diagrams.md) |

判斷順序：先問「是換整頁嗎？」→ `transition`；
再問「是元素要按節奏出現嗎？」→ `<v-clicks>`（精準插隊才 `v-click="n"`）；
再問「進場要帶位移/縮放動態嗎？」→ `v-motion`；
再問「是程式碼內部變化嗎？」→ 行高亮（聚焦）或 magic-move（演化）。

## references/ 路由表

按需載入，維持本檔精簡。**動手寫碼前先讀對應檔案。**
**要放元件或特效前，先查有沒有現成內建元件/功能（`builtin-components.md`、features 索引
https://sli.dev/features/），別手刻已經存在的東西。**

| 情境 | 讀這個檔 |
|------|---------|
| 拿到 talk-craft 的 ghost-deck、把 exhibit→layout / design-direction→theme 落地 | [references/handoff.md](references/handoff.md) |
| 開新 deck、裝依賴、headmatter 常用鍵、目錄結構、中文字型、版本對照 | [references/setup.md](references/setup.md) |
| 分頁規則、headmatter vs frontmatter、layout 全表、slots、嵌 Vue 元件、global layers（頁碼/頁尾/浮水印）、frontmatter 合併 / block frontmatter、zoom | [references/slide-structure.md](references/slide-structure.md) |
| 內建元件（`<Toc>` / `<Link>` / `<Arrow>` / `<RenderWhen>` / `<LightOrDark>` / 推文・影片嵌入 / 頁碼…）速查與踩雷 | [references/builtin-components.md](references/builtin-components.md) |
| 程式碼高亮 / 行號 / code groups / magic-move / TwoSlash / Monaco / `<<<` 匯入、Mermaid / PlantUML / inline SVG / KaTeX | [references/code-and-diagrams.md](references/code-and-diagrams.md) |
| v-click 家族 / `$clicks` / transition / v-motion 排序 / draggable（`v-drag`） | [references/animation.md](references/animation.md) |
| 主題選型、UnoCSS、icons、主題 token、中文字型、dark mode、slide-scoped style、自訂樣式 | [references/theming-style.md](references/theming-style.md) |
| 匯出 PDF/PPTX/PNG/SPA、點擊展開、presenter + 備註、部署 | [references/export-delivery.md](references/export-delivery.md) |
| 出怪 bug（分頁亂、字型缺、匯出破版、點擊不展開…）、上台前檢查 | [references/pitfalls.md](references/pitfalls.md) |

## 與 talk-craft、AI-SOP-Protocol（ASP）及 visual-web-stack 的關係

本 skill 是**知識層**（怎麼做簡報），ASP 是**治理層**（怎麼工作），透過專案 CLAUDE.md
疊加、互不取代。

- **與 `talk-craft` 互補（上游）**：talk-craft 決定「寫什麼／怎麼組織論證」並產出 **ghost-deck
  artifact**（deck header + 每頁 `slide` 區塊）；本 skill 是下游消費者——把它落成 Slidev deck。
  交棒欄位與對映規格見 [references/handoff.md](references/handoff.md)（欄位與 talk-craft
  `references/templates.md` §3 字字對齊）。本 skill 不改 talk-craft 的標題/敘事/論證。
- 與 `visual-web-stack` 並列：兩者都是知識層 skill。Slidev 走 Vue，不與 React 棧衝突；
  但若在投影片內嵌自訂 Vue 元件，樣式紀律（UnoCSS、不亂塞 inline style）精神一致，
  跨套件細節以各自的 skill 為準。
- 品質門檻（G1–G6）、commit 流程、ADR 紀律 → 聽 ASP。
- 衝突時：工作流程聽 ASP；Slidev 整合細節聽本 skill。

## 邊界（這個 skill 不做什麼 / 何時別用）

- 是 **Slidev v52 當下的整合快照**，會隨 Slidev / 套件升級**漂移**——版本見 `references/setup.md`，過期請重新查證。
- 管「怎麼用 Slidev 做對」，**不替你決定簡報的內容與論證**（那是 talk-craft；交棒見 `references/handoff.md`）。
- 不是 Slidev 全功能手冊，只收**跨功能整合**會踩的坑。
- **可攜底線**：本 skill 本質是 markdown + YAML——不支援的 runtime 直接把 `SKILL.md` 貼進去即可用。
  「Cursor / opencode 通用」目前**未實測**。

在做簡報的專案 CLAUDE.md 加入一行即繼承本規範：

```
本專案簡報遵循 slidev-deck-stack skill，Slidev 整合規範以該 skill 鐵則為準。
```
