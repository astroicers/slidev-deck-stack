# 主題與樣式（theming-style）

適用：選主題、用 UnoCSS 排版、覆寫主題 token、處理 dark/light、自訂全域樣式、確保中文
字型在畫面與匯出一致。

對應鐵則：#5（版面走內建 layout）、#6（不截圖、樣式可隨主題變色）。

樣式紀律（與 visual-web-stack 一致）：**優先用 UnoCSS utility class、不亂塞 inline
style**；版面交給內建 layout（鐵則 #5），這裡只談「外觀皮膚」。

## 1. 主題選型

headmatter `theme:` 指定，官方主題可省 `slidev-theme-` / `@slidev/theme-` 前綴。完整清單見官方
[theme gallery](https://sli.dev/resources/theme-gallery)（或 npm keyword `slidev-theme`）。**官方
三主題（default / seriph / apple-basic）維護最穩、下載量最高，不確定就從這三個起手。**

| 主題 | 來源 | 風格 / 適用 |
|------|------|-------------|
| default | 官方 | 簡潔通用、技術分享首選 |
| seriph | 官方 | 襯線字、正式/學術/keynote 感 |
| apple-basic | 官方 | Keynote 風大字 + 留白，`statement`/`fact` 頁強 |
| academic | 社群 | 論文/研究（cover 作者單位、引用、figure） |
| frankfurt | 社群 | Beamer 風、**頂部章節 + 進度條**，長課程/lecture |
| neversink | 社群 | 多彩、admonition/便利貼，教學/workshop |
| penguin | 社群 | 明暗雙版、dev 品牌感，教學/個人 |
| geist | 社群 | Vercel Geist 單色極簡，產品/dev demo |
| dracula | 社群 | Dracula 暗色，配 live-coding |
| the-unnamed | 社群 | 暗色高對比洋紅，dev conference |
| nord | 社群 | Nord 冷色低彩，沉穩 dev |

```yaml
---
theme: seriph
---
```

**design-direction → theme（對接 talk-craft 交棒；完整對映見 handoff.md §3）**：

| talk-craft `design-direction` | theme |
|-------------------------------|-------|
| 暗色終端（dev/資安 demo） | geist(dark) / dracula / the-unnamed / nord ＋ `colorSchema: dark` |
| 學術襯線（研究/lecture） | academic / seriph / frankfurt |
| keynote 大字（願景/pitch） | apple-basic / seriph |
| 教學（workshop） | neversink / penguin |
| 企業（匯報/sponsor） | seriph / geist ＋ 品牌 token |
| 通用 | default / seriph |

換主題時版面/顏色都會變，這正是「別手刻排版與顏色」（鐵則 #5/#6）的理由——內容與皮膚解耦，
換主題不破版。社群主題下載量多在千以下、維護不一，**正式場合優先官方三主題或自行覆寫 token
（§3）**。

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

## 5. 字型在畫面與匯出的一致性（台灣繁中 + 美國英文）

字型設定（`fonts:` / `provider: none` / 本地 woff2 / 子集化）完整作法見
**setup.md §5**。這裡只強調與樣式/匯出的交界：

- **拉丁字型在前、CJK 在後**：繁中 + 英文混排時 `font-family` 的順序決定品相——
  `'Inter, Noto Sans TC'` 讓英文/數字走 Inter、中文 fallback 到 CJK；別用單一 CJK 字型
  當 sans（英文會套到 CJK 內較粗糙的拉丁字形）。
- **可重現優先**：正式 deck 與要進 CI 匯出的場合，用本地子集化 woff2 + `provider: none`，
  別依賴 Google Fonts CDN（網路一抖字型就掉、匯出環境抓不到字會變方框）。
- **mono 也要含中文 fallback**：程式碼字型若無中文字符，註解裡的中文會缺字；
  在 `fonts.mono` 後補中文 fallback，或在 CSS 設 `font-family` fallback 鏈。
- **匯出字型自查**：匯出後翻幾頁 PDF，確認中文沒變方框、粗體有對到字重（見
  export-delivery.md、pitfalls.md）。

```yaml
fonts:
  sans: 'Inter, Source Han Sans TC'       # 英文 Inter、中文 fallback CJK
  mono: 'Fira Code, Source Han Sans TC'   # mono 補中文 fallback，註解才不缺字
  provider: none
  local: 'Inter, Source Han Sans TC'
```
