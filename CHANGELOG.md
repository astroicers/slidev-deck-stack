# Changelog

本專案的所有重大變更記錄於此。格式依循 [Keep a Changelog](https://keepachangelog.com/zh-TW/1.1.0/)，版本遵循 [Semantic Versioning](https://semver.org/lang/zh-TW/)。

## [1.3.0] - 2026-10-22

借鑒 [guizang-ppt-skill](https://github.com/op7418/guizang-ppt-skill)（歸藏，AGPL-3.0）的**方法**——
需求澄清七問、節奏規劃、講者備註契約、P0–P3 分級檢查、靜態驗證器——落到 Slidev。只借思路與工作流，
未使用其模板、class、版式或文字；本 repo 仍為 MIT。

### Added

- `references/deck-planning.md`：動手前的工作流——兩種入口（ghost-deck / 只有題目）、**需求澄清七問**
  （一次最多問 3 個）、時長 → 頁數與 click 預算表、**頁面計畫表**（`routeAlias` / layout / exhibit /
  click / `minutes` / 轉場，存 `plan.md`）、**版面節奏**硬規則（每 3–4 頁換氣頁、同 layout 連續 ≤ 3、
  10 頁以上 ≥ 4 種 layout）、**截圖約定**（`public/img/{NN}-{semantic}`、標準比例、≥ 1600px、
  `backgroundSize: contain` 保真、遮敏感、不自帶 chrome）。
- `references/presenter-notes.md`：Slidev 備註機制（內文結尾註解、`[click]` / `[click:n]` 標記、
  `routeAlias`、`/overview`、`/notes-edit`、timer `duration` / `timer`、`notesAutoRuby`、`--remote`）、
  **每頁備註契約**（目的 / 3–5 條提詞 / 轉場 + 可選提醒 / 備援 / 互動）、`minutes:` 時間規劃
  （≤ `duration` 90%、全填或全不填、presenter 顯示本頁計畫的 global layer 範例）、排練流程、
  **presenter 做得到 / 做不到對照表**（別手刻排練紀錄、自動翻頁、黑屏）。
- `scripts/validate-deck.mjs`：零依賴（Node 18+）靜態檢查器，切頁 / frontmatter / 備註判定對齊
  `@slidev/parser`。抓鐵則 #1（全域鍵跑到單頁）、#2（分頁線後接內文被當 frontmatter 吞掉）、
  #3（手刻索引、`<v-clicks>` 無空行、click 預算）、#4（magic-move 三反引號）、#7（相對路徑）、
  #8（`package.json` 沒鎖 playwright-chromium）、節奏（連續同 layout / 密集頁）、密度（清單 > 8、
  標題 > 24 字、`zoom` < 0.75）、備註缺漏、`minutes` 預算、`routeAlias` 重複、`mdc` deprecated。
- `tests/fixtures/{good,bad,budget}/`：驗證器 fixture；CI 跑 good（0 錯誤）、bad / budget（必須失敗並
  命中預期訊息）。
- `SKILL.md`：新增「**工作流（六步）**」表與「**設計原則**」（克制優於炫技 / 結構優於裝飾 /
  圖是證據 / 節奏靠換氣頁 / 一頁一訊息 / 先量後改再目視）；路由表加 `deck-planning.md`、
  `presenter-notes.md`；description 補 triggers。
- `references/pitfalls.md` 重寫：地雷表新增 7 列（code groups 需 `comark`、截圖被裁、global layer
  匯出、CJK 字型順序、備註不出現、`[click]` 不動、沒有換氣頁、溢出）、**自檢指令**（validator +
  grep）、**先量後改的溢出階梯**（刪字 → 拆頁 → two-cols → `zoom` 下限 0.8 → `<Transform>`）、
  `slidev export --format png` 視覺核對、**P0–P3 分級檢查清單**。
- `references/theming-style.md` §6 投影可讀性：字級下限、密度上限、中文標題 ≤ 24 字、大字頁
  「越大越細、越小越粗」、投影對比 `opacity-70` 起跳、中英混排、縮放階梯。
- `references/animation.md` §8 動畫節制：transition 一種、v-motion 只給 hero 頁、一頁一種節奏、
  每擊對應一條 `[click]` 提詞。
- CI：references 9 → 11；新增「SKILL.md 路由表涵蓋所有 references」檢查；`setup-node` + fixtures。

### Changed

- `references/handoff.md` §4 落地流程 3 → 4 步：插入「先填頁面計畫表 + 補節奏」，`assertion` →
  備註「目的」、`note` → 提詞、`[click]` 對齊 `reveal`。
- `references/export-delivery.md`：§4 presenter 段改指向 presenter-notes.md；§6 匯出前自查加
  validator 與 PNG 視覺核對。
- `references/slide-structure.md`：`image-*` 範例加 `backgroundSize: contain`；MDC 段改 Comark。
- `references/setup.md`：headmatter 範例 `mdc: true` → `comark: true`，加 `duration` / `timer`；
  目錄結構加 `plan.md`。
- `references/code-and-diagrams.md` §9：code groups 旗標說明改為「`mdc` 已 deprecated、一律 `comark`」。
- `README.md`：快速上手加第 0 步（七問）與驗證指令、術語加 `routeAlias` / `minutes`、結構樹同步。

### Fixed

- `mdc: true` 在 Slidev v52.16 已標 `@deprecated`（MDC 併入 Comark），全部改為 `comark: true`
  （`.fact-check.md` #25）。
- `.fact-check.md` 將「備註為該頁最後一個 HTML 註解」從未查證清單升級為已查證（#19），並補登
  #19–#28（click markers、`routeAlias`、`backgroundSize`、presenter / timer / remote、
  `$nav.currentFrontmatter` 自訂欄位、`notesAutoRuby`、MCP v52.17+、parser 切頁規則）；
  同時對 v52.16.0 tag 與 main（v53.0.0）核對，並記錄版本漂移提醒。

## [1.2.0] - 2026-06-24

### Added

- `references/builtin-components.md`：Slidev v52 全部內建元件速查表（`<Toc>` / `<Link>` /
  `<Arrow>` / `<VDragArrow>` / `<Transform>` / `<RenderWhen>` / `<LightOrDark>` / `<VSwitch>` /
  `<Tweet>` / `<BlueSky>` / `<Youtube>` / `<SlidevVideo>` / `<SlideCurrentNo>` / `<SlidesTotal>` /
  `<TitleRenderer>` / `<AutoFitText>` / `<PoweredBySlidev>`）——依用途分組、關鍵 props/slots、踩雷點。
- `.fact-check.md`：重新建立查證紀錄檔（先前 `SKILL.md` / `setup.md` 有引用但檔案不存在），記錄
  本次新增內容對 Slidev **v52.16.0** 的查證來源。
- `references/code-and-diagrams.md` §10「內嵌自足動態圖（canvas/SVG）」：把 animated explainer 落成
  自足 Vue 元件的三個必守點——讀主題 token、尊重 `prefers-reduced-motion` 定格代表幀、非當前頁停 RAF；
  `references/pitfalls.md` 對應新增一列。（借鑒自純 Canvas 2D explainer，與 talk-craft §1 第 10 招對接。）

### Changed

- 補齊 features 索引缺口至各 references：`slide-structure.md`（global layers / frontmatter
  合併 / block frontmatter / `zoom`）、`code-and-diagrams.md`（code groups / 行號 `startLine`）、
  `animation.md`（draggable elements `v-drag` / `<v-drag-arrow>` / `dragPos`）、`theming-style.md`
  （icons / slide-scoped style）。
- `SKILL.md`：references 路由表新增 `builtin-components.md` 一列、既有各列補新功能、新增「要放
  元件/特效前先查現成內建元件再手刻」原則；動畫選型表加 draggable / code groups 兩列。
- `README.md` 結構樹 / CI 註解、`validate.yml`（references 8 → 9）同步。

### Fixed

- 查證推翻三項先前假設並記入 `.fact-check.md`：Slidev **無**單頁 `rotate:` frontmatter（rotate
  僅為 draggable 位置第五值）；code groups 需 `comark: true`（與 `mdc: true` 為**兩個獨立旗標**）；
  draggable 官方頁網址為 `/features/draggable`。

## [1.1.1] - 2026-06-23

### Added

- README 快速上手（5 分鐘）+ 術語速查（headmatter / frontmatter / magic-move / v-clicks / layout）。
- `SKILL.md` 邊界段（Slidev v52 快照會漂移、「貼 SKILL.md 即用」誠實底線、cross-runtime 未實測標註）。

## [1.1.0] - 2026-06-18

### Added

- `references/handoff.md`：消費 talk-craft 的 **ghost-deck artifact**——deck header / 每頁
  `slide` 區塊的欄位對照（與 talk-craft `templates.md` §3 字字對齊）、**exhibit → layout/component
  對映**、**design-direction → theme 對映**。
- README 方法 D：`npx skills` / `gh skill` 安裝法（跨 agent 開放安裝器，對齊 agent-skills 規範）。

### Changed

- `theming-style.md` §1 主題選型：擴充 theme 清單（借鏡官方 theme gallery——apple-basic /
  frankfurt / penguin / dracula / the-unnamed / nord 等）+ 新增 **design-direction → theme
  對照表** + 官方 gallery 連結。
- `SKILL.md`：references 路由表加 `handoff.md`（置頂）；companion 段補 talk-craft 上游互補。
- `README.md` 結構樹 / CI 註解、`validate.yml`（references 7 → 8）同步。
- `.fact-check.md` #18：補登新增 6 主題（apple-basic / frankfurt / penguin / dracula /
  the-unnamed / nord）的 npm 套件名與版本查證（2026-06-18）。

## [1.0.0] - 2026-06-17

首個正式版。Slidev 技術簡報的 Claude Code skill / plugin。

### Added

- 五層架構（內容 / 版面 / 展示 / 動畫 / 樣式＋交付）+ 8 條鐵則的 `SKILL.md` 核心規範，
  含「逐步揭示與動畫選型表」與「references 路由表」。
- 7 份 references 實作配方：`setup`、`slide-structure`、`code-and-diagrams`、
  `animation`、`theming-style`、`export-delivery`、`pitfalls`。
- Claude Code marketplace 支援：`.claude-plugin/marketplace.json` + `plugin.json`，可直接
  從 Manage Plugins → Marketplaces 加入安裝。
- `install.sh` 安裝腳本與手動 symlink 安裝法。
- `.fact-check.md` Slidev API / 套件版本查證紀錄（對照 https://sli.dev 與 npm registry）。

### Changed

- 鐵則由草案 8 條對照官方文件定稿，其中第 5 條（內建 layout + slots）依官方文件修正：
  `two-cols-header` 沒有 `::title::` 具名 slot，header 是「分隔線之前的內容」+
  `::left::` / `::right::`。

### Fixed

- PlantUML 不支援 `{scale}` 行內選項（Mermaid 才有），改以 headmatter `plantUmlServer`
  設定伺服器；對應 `code-and-diagrams.md` 已更正。

[1.0.0]: https://github.com/astroicers/slidev-deck-stack/releases/tag/v1.0.0
