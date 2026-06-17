# 專案初始化（setup）

適用：開新 deck、安裝依賴與 theme/addon、設定 headmatter、決定目錄結構、設定中文字型。

對應鐵則：#1（headmatter 位置）、#7（`public/` 慣例）、#8（鎖 `playwright-chromium`）。

## 1. 建立 deck

```bash
npm init slidev@latest
# 互動式輸入專案名 → 選 theme → 進目錄
cd my-deck
npm run dev          # http://localhost:3030
```

`npm init slidev` 等同 `npm create slidev`。基準版本為 Slidev **v52**（`@slidev/cli`
52.16.x）。常用 scripts：

```bash
npm run dev          # 本機預覽（HMR）
npm run build        # 產出 SPA 到 dist/（部署用）
npm run export       # 匯出 PDF（需 playwright-chromium，見 export-delivery.md）
```

## 2. 產出目錄結構（並補上慣例目錄）

scaffold 預設給 `slides.md` + `package.json` + 一個 `components/` 範例。建議補齊以下
慣例目錄，讓資源各歸其位：

```
my-deck/
├── slides.md          # 主投影片（headmatter + 各頁）
├── package.json
├── components/        # 自訂 Vue 元件，檔名即標籤，自動全域註冊（無需 import）
├── snippets/          # 外部程式碼，給 `<<<` 匯入（建議放這裡以相容 Monaco）
├── public/            # 靜態資源，以絕對路徑 /xxx.png 引用（鐵則 #7）
├── styles/            # 自訂全域樣式（index.ts/css），主題 token 覆寫
├── pages/             # 多檔 deck 時拆頁，用 `src: ./pages/x.md` 匯入
└── vercel.json / netlify.toml   # 部署設定（scaffold 視選擇產生）
```

`public/` vs `snippets/` vs 元件內 `./assets/`：

- **`public/`**：圖片、字型、影片等「原樣輸出」的檔。引用一律絕對路徑 `/logo.png`
  （對應 `public/logo.png`）。**不要**用相對路徑或 `import`，`slidev build` 後會 404。
- **`snippets/`**：要被 `<<< @/snippets/x.ts` 匯入的程式碼原始檔（見 code-and-diagrams.md）。
- **元件內 `./assets/`**：只有在自訂 Vue 元件裡 `import img from './assets/x.png'` 才用，
  會經 Vite 處理上 hash。一般投影片圖片走 `public/`。

## 3. headmatter 常用鍵

全域設定只能放 `slides.md` 第一個 `---` 區塊（鐵則 #1）：

```yaml
---
theme: seriph              # 主題（見 theming-style.md）
title: 我的技術分享          # deck 標題（presenter / 匯出檔名用）
info: |
  ## 2026 鐵人賽分享
  Slidev 製作
author: astroicers
keywords: slidev,talk
transition: slide-left     # 全域換頁過場（見 animation.md）
mdc: true                  # 啟用 MDC（Comark）行內語法
lineNumbers: true          # 程式碼顯示行號
drawings:
  persist: false           # 手繪註記是否寫回原始碼
fonts:                     # 字型（見 §5 中文字型）
  sans: Noto Sans TC
  mono: Fira Code
  weights: '400,700'
colorSchema: dark          # dark | light | all
aspectRatio: 16/9
exportFilename: my-talk     # 匯出檔名（見 export-delivery.md）
addons:                    # 載入 addon（見 §6）
  - slidev-addon-python-runner
---
```

> 完整鍵表見 https://sli.dev/custom/#headmatter。易變，新鍵查證後補 `.fact-check.md`。

## 4. 安裝 theme / addon

`theme:` 與 `addons:` 寫進 headmatter 後，啟動時 Slidev 會偵測缺套件並**詢問是否自動
安裝**；也可手動裝：

```bash
# 官方主題可省略 slidev-theme- 前綴：theme: seriph → @slidev/theme-seriph
npm install @slidev/theme-seriph

# 社群主題用完整名，scoped 主題（@org/...）也用完整名
npm install slidev-theme-academic

# addon 命名慣例 slidev-addon-*
npm install slidev-addon-python-runner
```

## 5. 中文字型設定（繁體）

Slidev 的 `fonts:` 預設從 Google Fonts CDN 自動抓字。繁中可用 `Noto Sans TC` /
`Noto Serif TC`，但**全字集 webfont 很大**，會拖慢載入與匯出，務必收斂：

```yaml
# 方案 A（最省事）：限制字重，減少下載量
fonts:
  sans: Noto Sans TC
  serif: Noto Serif TC
  mono: Fira Code
  weights: '400,700'        # 只抓需要的字重，別抓 100~900 全部
```

字型量仍嫌大、或要離線/可重現匯出時，改自備本地字型、關掉 CDN：

```yaml
# 方案 B（可重現）：自備子集化 woff2，關閉自動匯入
fonts:
  sans: 'Source Han Sans TC'
  mono: 'Fira Code'
  provider: none            # 不向 CDN 抓，全部當本地字型處理
  local: 'Source Han Sans TC'
```

```css
/* styles/index.css：自備 @font-face（建議先用 fonttools/subset 子集化） */
@font-face {
  font-family: 'Source Han Sans TC';
  src: url('/fonts/SourceHanSansTC-Regular.subset.woff2') format('woff2');
  font-weight: 400;
  font-display: swap;
}
```

把 `SourceHanSansTC-Regular.subset.woff2` 放 `public/fonts/`，以 `/fonts/...` 引用
（鐵則 #7）。**匯出注意**：匯出走 chromium，字型必須在匯出環境可取得，否則 PDF 變
方框（見 export-delivery.md、pitfalls.md）。

## 6. 套件版本對照表

撰寫基準：2026-06（查證紀錄見 repo 根目錄 `.fact-check.md`）。表中 `x` 為 patch 範圍，
查證點為各套件當下最新版（如 `@slidev/cli` 52.16.0）。
**套件 API 變更時，更新對應 references 檔並同步此表。**

| 套件 | 版本 | 對應 references 檔 |
|------|------|--------------------|
| `@slidev/cli` | 52.16.x | setup.md（全域） |
| `@slidev/theme-default` | 0.25.x | theming-style.md |
| `@slidev/theme-seriph` | 0.25.x | theming-style.md |
| `slidev-theme-academic` | 2.1.x | theming-style.md |
| `slidev-theme-neversink` | 0.4.x | theming-style.md |
| `slidev-theme-geist` | 0.8.x | theming-style.md |
| `playwright-chromium` | 1.61.x | export-delivery.md |
| `katex` | 0.17.x（隨 Slidev 內建） | code-and-diagrams.md |
| `slidev-addon-python-runner` | 0.1.x | code-and-diagrams.md |
| `slidev-addon-typst` | 1.0.x | code-and-diagrams.md |

> Slidev 為 monorepo，`@slidev/client` 等子套件版本隨 `@slidev/cli` 同進；升 major 前
> 確認 theme/addon 是否宣告相容該 Slidev 版本。
