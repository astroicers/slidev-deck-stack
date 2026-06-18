# slidev-deck-stack

Slidev 技術簡報的 Claude Code skill——把「怎麼用 Slidev 把技術簡報做對」的跨功能整合
知識固化，讓第一版 deck 就符合規範。

涵蓋技術棧：Slidev v52（Vue + Markdown）+ headmatter/frontmatter 分層設定 + 內建
layouts + slots + UnoCSS + Shiki 高亮 / magic-move + `<<<` 匯入 + Mermaid / PlantUML /
inline SVG / KaTeX + v-click / v-clicks / v-after / v-motion + 主題與中文字型 +
匯出 PDF/PPTX/PNG/SPA + presenter 與部署。

## 結構

```
slidev-deck-stack/
├── README.md                   # 本文件
├── LICENSE                     # MIT
├── CHANGELOG.md                # 版本變更紀錄（Keep a Changelog + SemVer）
├── install.sh                  # 安裝腳本
├── .gitignore
├── .fact-check.md              # Slidev API / 版本查證紀錄
├── .github/
│   └── workflows/
│       └── validate.yml        # CI：驗 JSON / SKILL frontmatter / 8 references 齊全
├── .claude-plugin/
│   ├── marketplace.json        # Claude Code Marketplace 定義
│   └── plugin.json             # Plugin 描述
└── skills/
    └── slidev-deck-stack/
        ├── SKILL.md            # 核心：五層架構 + 8 條鐵則 + 選型表 + 路由表
        └── references/         # 按需載入的完整實作配方
            ├── handoff.md          # 消費 talk-craft ghost-deck：exhibit→layout、design-direction→theme
            ├── setup.md            # 開新 deck、依賴、headmatter、目錄、中文字型、版本表
            ├── slide-structure.md  # 分頁、headmatter vs frontmatter、layout 全表、slots、嵌 Vue
            ├── code-and-diagrams.md# Shiki / magic-move / <<< / Mermaid / PlantUML / SVG / KaTeX
            ├── animation.md        # v-click 家族、$clicks、transition、v-motion
            ├── theming-style.md    # 主題選型、UnoCSS、主題 token、dark mode、中文字型
            ├── export-delivery.md  # 匯出 PDF/PPTX/PNG/SPA、--with-clicks、presenter、部署
            └── pitfalls.md         # 地雷對照表 + 上台前檢查清單
```

## 安裝

> 以下方法**擇一**即可。全域安裝法（marketplace / install.sh / symlink / `npx skills -g`
> / `gh skill`）都會寫入 `~/.claude/skills/slidev-deck-stack`，**勿混用**以免版本不一致。

### 方法 A：Claude Code Marketplace（推薦）

1. Claude Code → **Manage Plugins** → **Marketplaces**
2. 貼上 `https://github.com/astroicers/slidev-deck-stack` → **Add**
3. 切到 **Plugins** tab，找到 `slidev-deck-stack` → **Install**

更新由 Claude Code 自行管理。

### 方法 B：安裝腳本

```bash
git clone https://github.com/astroicers/slidev-deck-stack.git
cd slidev-deck-stack
./install.sh          # 已存在會詢問；--force 直接覆蓋
```

### 方法 C：手動 symlink（開發本 skill 時，改 repo 即時生效）

```bash
# 先移除既有安裝（目錄或舊連結）——若目標已是目錄，ln 會把連結建到目錄「裡面」而非取代它
rm -rf ~/.claude/skills/slidev-deck-stack
ln -s "$(pwd)/skills/slidev-deck-stack" ~/.claude/skills/slidev-deck-stack
```

### 方法 D：npx skills / gh skill（跨 agent 開放安裝器）

open agent-skills 安裝器，Claude Code / Cursor / opencode 等通用（會自動偵測 agent）：

```bash
# 全域（user base，所有專案共用；知識層 skill 建議用這個）
npx skills add astroicers/slidev-deck-stack -g -a claude-code
# 僅本專案（裝到 ./.claude/skills/）
npx skills add astroicers/slidev-deck-stack -a claude-code
# 先預覽會裝哪些 skill（不安裝）
npx skills add astroicers/slidev-deck-stack --list
```

或用 GitHub CLI（gh v2.90+，GitHub 原生；預設目標是 Copilot，故需指定 agent）：

```bash
gh skill install astroicers/slidev-deck-stack --agent claude-code --scope user
```

驗證：

```bash
head -5 ~/.claude/skills/slidev-deck-stack/SKILL.md
```

## 更新

```bash
cd slidev-deck-stack
git pull
./install.sh --force
```

（symlink 安裝只需 `git pull`。）

## 解除安裝

```bash
rm -rf ~/.claude/skills/slidev-deck-stack
```

## 與 AI-SOP-Protocol（ASP）搭配

本 skill 是**知識層**（怎麼做簡報），ASP 是**治理層**（怎麼工作），兩者疊加、互不取代。

在做簡報的專案 CLAUDE.md 加入一行：

```
本專案簡報遵循 slidev-deck-stack skill，Slidev 整合規範以該 skill 鐵則為準。
```

分工界線：

- 品質門檻（G1–G6）、commit 流程、ADR 紀律 → 聽 ASP。
- 與 `visual-web-stack` 並列：兩者都是知識層 skill；Slidev 走 Vue，不與 React 棧衝突，
  但投影片內嵌自訂 Vue 元件時，UnoCSS / 不亂塞 inline style 的樣式紀律精神一致。
- Slidev 整合細節（headmatter 位置、layout 不手刻、圖走程式碼、匯出可重現…）→ 聽本 skill。

## 套件版本對照表

撰寫基準：2026-06（查證紀錄見 `.fact-check.md`）。表中 `x` 為 patch 範圍；查證點為各套件
當下最新版（如 `@slidev/cli` 52.16.0、`playwright-chromium` 1.61.0），明細見 `.fact-check.md`。
**套件 API 變更時，更新對應的 references 檔並同步此表。**

| 套件 | 版本 | 對應 references 檔 |
|------|------|--------------------|
| `@slidev/cli` | 52.16.x | setup.md（全域基準） |
| `@slidev/theme-default` | 0.25.x | theming-style.md |
| `@slidev/theme-seriph` | 0.25.x | theming-style.md |
| `slidev-theme-academic` | 2.1.x | theming-style.md |
| `slidev-theme-neversink` | 0.4.x | theming-style.md |
| `slidev-theme-geist` | 0.8.x | theming-style.md |
| `playwright-chromium` | 1.61.x | export-delivery.md |
| `katex`（隨 Slidev 內建） | 0.17.x | code-and-diagrams.md |
| `slidev-addon-python-runner` | 0.1.x | code-and-diagrams.md |
| `slidev-addon-typst` | 1.0.x | code-and-diagrams.md |

## License

MIT
