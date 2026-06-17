# Changelog

本專案的所有重大變更記錄於此。格式依循 [Keep a Changelog](https://keepachangelog.com/zh-TW/1.1.0/)，版本遵循 [Semantic Versioning](https://semver.org/lang/zh-TW/)。

## [Unreleased]

### Added

- README 方法 D：`npx skills` / `gh skill` 安裝法（跨 agent 開放安裝器，對齊 agent-skills 規範）。

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
