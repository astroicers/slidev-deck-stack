# Changelog

本專案的所有重大變更記錄於此。格式依循 [Keep a Changelog](https://keepachangelog.com/zh-TW/1.1.0/)，版本遵循 [Semantic Versioning](https://semver.org/lang/zh-TW/)。

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
