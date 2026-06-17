# 主題與樣式（theming-style）

適用：選主題、用 UnoCSS 排版、覆寫主題 token、處理 dark/light、自訂全域樣式、確保中文
字型在畫面與匯出一致。

對應鐵則：#5（版面走內建 layout）、#6（不截圖、樣式可隨主題變色）。

樣式紀律（與 visual-web-stack 一致）：**優先用 UnoCSS utility class、不亂塞 inline
style**；版面交給內建 layout（鐵則 #5），這裡只談「外觀皮膚」。

## 1. 主題選型

headmatter `theme:` 指定，官方主題可省 `slidev-theme-` / `@slidev/theme-` 前綴：

| 主題 | 套件 | 風格 / 適用 |
|------|------|-------------|
| default | `@slidev/theme-default` | 簡潔通用，技術分享首選 |
| seriph | `@slidev/theme-seriph` | 襯線字、正式/學術感 |
| academic | `slidev-theme-academic` | 論文/研究報告（含引用、單位頁等） |
| neversink | `slidev-theme-neversink` | 多彩色票、教學/課程 |
| geist | `slidev-theme-geist` | Vercel Geist 極簡、產品 demo |

```yaml
---
theme: seriph
---
```

換主題時版面/顏色都會變，這正是「別手刻排版與顏色」（鐵則 #5/#6）的理由——內容與皮膚
解耦，換主題不破版。

## 2. UnoCSS（內建）

Slidev 內建 UnoCSS（Tailwind 風 utilities + attributify + icons）。投影片裡直接用
class，免設定：

```md
<div class="mt-8 grid grid-cols-3 gap-4 text-center">
  <div class="rounded-lg bg-blue-500/10 p-4">A</div>
  <div class="rounded-lg bg-green-500/10 p-4">B</div>
  <div class="rounded-lg bg-amber-500/10 p-4">C</div>
</div>
```

圖示用 icon class（`@iconify-json/*` 安裝後）：`<carbon-logo-github class="text-2xl" />`。

要擴充 UnoCSS（自訂 shortcut、主題色）放 `uno.config.ts`：

```ts
// uno.config.ts
import { defineConfig } from 'unocss'

export default defineConfig({
  shortcuts: {
    'card': 'rounded-xl border border-gray-400/30 p-6',
  },
})
```

## 3. 主題 token 與全域樣式

`styles/` 下的檔會自動載入。覆寫主題 CSS 變數、調全域字級：

```css
/* styles/index.css */
:root {
  --slidev-theme-primary: #2563eb;     /* 主色（多數主題吃這顆） */
}

.slidev-layout {
  font-size: 1.05rem;                  /* 全域內文字級 */
}

.slidev-layout h1 {
  letter-spacing: -0.01em;
}
```

單頁微調用該頁 frontmatter `class:` 或頁內 `<style>`（Slidev 自動 scope 到該頁）：

```md
---
class: text-center
---

<style>
h1 { color: var(--slidev-theme-primary); }
</style>
```

## 4. Dark / Light

headmatter `colorSchema` 決定可用模式：`dark` | `light` | `all`（預設 `all`，UI 可切）：

```yaml
---
colorSchema: all
---
```

針對模式給不同樣式用 `dark:` variant：

```md
<div class="bg-white text-black dark:bg-gray-900 dark:text-white">隨主題反色</div>
```

切換鍵在 Slidev 內建 UI（或 presenter 模式）即可；自訂顏色記得兩個模式都測，否則某模式
對比不足看不清。

## 5. 中文字型在畫面與匯出的一致性

字型設定（`fonts:` / `provider: none` / 本地 woff2 / 子集化）完整作法見
**setup.md §5**。這裡只強調與樣式/匯出的交界：

- **可重現優先**：正式 deck 與要進 CI 匯出的場合，用本地子集化 woff2 + `provider: none`，
  別依賴 Google Fonts CDN（網路一抖字型就掉、匯出環境抓不到字會變方框）。
- **mono 也要含中文 fallback**：程式碼字型若無中文字符，註解裡的中文會缺字；
  在 `fonts.mono` 後補中文 fallback，或在 CSS 設 `font-family` fallback 鏈。
- **匯出字型自查**：匯出後翻幾頁 PDF，確認中文沒變方框、粗體有對到字重（見
  export-delivery.md、pitfalls.md）。

```yaml
fonts:
  sans: 'Source Han Sans TC'
  mono: 'Fira Code, Source Han Sans TC'   # mono 補中文 fallback，註解才不缺字
  provider: none
  local: 'Source Han Sans TC'
```
