# 內建元件（builtin-components）

適用：要放目錄、跳頁連結、箭頭標註、條件渲染（presenter/print 不同內容）、嵌入推文/影片、
顯示頁碼等——**先查這裡有沒有現成內建元件，別自己手刻 widget**（呼應鐵則 #5/#6 的精神：
用框架給的、別重造）。

對照 Slidev v52；元件與 props 以 https://sli.dev/builtin/components 為準（查證見 `../.fact-check.md`）。
這些元件**全域自動註冊、無需 import**（唯一例外：`<TitleRenderer>`，見 §3）。

## 1. 速查表（依用途分組）

| 元件 | 用途 | 關鍵 props / slots |
|------|------|--------------------|
| `<Toc>` | 插入目錄（自動抓各頁標題） | `columns` `maxDepth` `minDepth` `listClass` `mode`（`all` / `onlyCurrentTree` / `onlySiblings`） |
| `<Link>` | 連到指定頁 | `to`（頁碼或 slide id）`title` |
| `<SlideCurrentNo>` | 顯示目前頁碼 | — |
| `<SlidesTotal>` | 顯示總頁數 | — |
| `<TitleRenderer>` | 把某頁標題以 HTML 算繪出來（virtual，**需 import**） | `no`（頁碼） |
| `<Arrow>` | 兩點間畫箭頭 | `x1` `y1` `x2` `y2`（必填）`color` `width` `two-way` |
| `<VDragArrow>` | 可拖曳版的 Arrow | 同 `<Arrow>`（位置改用拖曳，見 [animation.md](animation.md) draggable 一節） |
| `<Transform>` | 對元素縮放/變形 | `scale` `origin` |
| `<AutoFitText>` | 字級自動縮放塞滿框（experimental） | `max` `min` `modelValue` |
| `<RenderWhen>` | 依情境條件渲染（presenter/print/overview…） | `context`（見 §2）；slots `#default` `#fallback` |
| `<LightOrDark>` | 依亮/暗主題顯示不同內容 | slots `#light` `#dark` |
| `<VSwitch>` | 依點擊切換多個 slot | `unmount` `tag` `childTag` `transition` |
| `<VClick>` `<VClicks>` `<VAfter>` | 逐步揭示（動畫層） | 見 [animation.md](animation.md)，本檔不重複 |
| `<VDrag>` | 可拖曳容器 | 見 [animation.md](animation.md) draggable 一節 |
| `<Tweet>` | 嵌入推文 | `id`（必填）`scale` `conversation` `cards` |
| `<BlueSky>` | 嵌入 Bluesky 貼文 | `uri`（必填）`scale` |
| `<Youtube>` | 嵌入 YouTube | `id`（必填）`width` `height`；起始秒數用 `?start=` |
| `<SlidevVideo>` | 嵌入本地/網路影片 | `controls` `autoplay` `autoreset` `poster` `printPoster` `timestamp` `printTimestamp` |
| `<PoweredBySlidev>` | 「Powered by Slidev」連結 | — |

## 2. 常用範例

**目錄頁**（章節導覽，常配 `layout: center`）：

```md
---
layout: center
---

<Toc columns="2" minDepth="1" maxDepth="2" />
```

某頁不想進目錄，在該頁 frontmatter 設 `hideInToc: true`（見 [slide-structure.md](slide-structure.md) §1）。

**頁碼**（通常放 global layer，見 [slide-structure.md](slide-structure.md) global layers 一節）：

```md
<SlideCurrentNo /> / <SlidesTotal />
```

**箭頭標註**（座標相對於 slide 視窗；要可拖曳調位置改用 `<VDragArrow>`）：

```md
<Arrow x1="100" y1="100" x2="300" y2="200" color="#4471cb" two-way />
```

**條件渲染**——同一份 deck，在投影 / 列印 / presenter 顯示不同內容。`context` 可用值：
`main`、`visible`、`print`、`slide`、`overview`、`presenter`、`previewNext`：

```md
<RenderWhen context="presenter">
  只有 presenter 視窗看得到的提詞。

  <template #fallback>
  觀眾投影幕看到的內容。
  </template>
</RenderWhen>
```

**亮/暗主題各一張圖**（與 `colorSchema` 連動，見 [theming-style.md](theming-style.md)）：

```md
<LightOrDark>
  <template #light><img src="/diagram-light.png"></template>
  <template #dark><img src="/diagram-dark.png"></template>
</LightOrDark>
```

## 3. 踩雷點

- **`<TitleRenderer>` 是唯一需要 import 的**（virtual component）：`<script setup>` 內
  `import TitleRenderer from '#slidev/title-renderer'` 後才能用。其餘元件都自動全域註冊。
- **媒體類（`<Tweet>` `<BlueSky>` `<Youtube>` `<SlidevVideo>`）需要網路**；匯出 PDF 時動態內容會缺，
  用 `<SlidevVideo>` 的 `printPoster` / `printTimestamp` 給靜態替身（匯出細節見 [export-delivery.md](export-delivery.md)）。
- **`<RenderWhen>` 的 `context` 值別拼錯**——這是「presenter 看提詞、觀眾看乾淨版」的關鍵；
  值寫錯不會報錯，只會整段不顯示。
- **動畫/拖曳元件（`<VClick>` 家族、`<VDrag>` / `<VDragArrow>` / `<VSwitch>`）的細節在
  [animation.md](animation.md)**，本檔只列名避免重複；要做逐步揭示請走那邊的選型表。
- `<AutoFitText>` 標 experimental，行為可能隨版本變動；長標題能用就用，但別當穩定 API 依賴。
