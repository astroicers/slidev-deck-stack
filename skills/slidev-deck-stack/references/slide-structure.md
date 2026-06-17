# 投影片結構（slide-structure）

適用：分頁、決定每頁版面、用 slots 排雙欄/圖文、在投影片內嵌 Vue 元件。

對應鐵則：#1（headmatter 位置）、#2（`---` 空行）、#5（內建 layout 不手刻）。

## 1. 分頁與 headmatter / frontmatter

一份 `slides.md` 用 `---` 分頁。**分隔線前後各空一行**（鐵則 #2），否則被當水平線或併進
內文：

```md
---
theme: seriph
title: 我的分享
transition: slide-left
---

# 第 1 頁（封面）

這是封面內文。

---

# 第 2 頁

第二頁內文。

---
layout: center
class: text-center
---

# 第 3 頁（這個 --- 區塊是「本頁」frontmatter）
```

第一個 `---…---` 是 **headmatter（全域，整份 deck 設定）**；之後每個 slide 開頭的
`---…---` 是該頁 **per-slide frontmatter**。兩者鍵不同：

| 設定層級 | 寫在哪 | 常見鍵 |
|----------|--------|--------|
| 全域（headmatter） | 檔案最上方**唯一一個** | `theme` `title` `transition` `fonts` `mdc` `colorSchema` `lineNumbers` `addons` |
| 本頁（frontmatter） | 每頁開頭的 `---` 區塊 | `layout` `class` `clicks` `transition`（覆寫）`background` `src` `level` `hideInToc` |

把 `theme`/`fonts` 寫到某一頁的 frontmatter 會**靜默失效**（鐵則 #1）。

多檔 deck：用 `src` 把外部 md 併進來，方便拆檔協作：

```md
---
src: ./pages/chapter-2.md
---
```

## 2. 內建 layout 全表（鐵則 #5：用內建、別手刻）

用 frontmatter `layout:` 指定。完整內建清單：

| layout | 用途 |
|--------|------|
| `default` | 最通用，放任意內容 |
| `cover` | 封面（標題、副標、講者） |
| `intro` | 簡介頁（標題、描述、作者） |
| `center` | 內容置中 |
| `section` | 章節分隔頁 |
| `statement` | 單句主張置中放大 |
| `fact` | 凸顯一個數據/事實 |
| `quote` | 引言 |
| `two-cols` | 左右兩欄 |
| `two-cols-header` | 上方跨欄 header + 下方左右兩欄 |
| `image` | 整頁一張圖 |
| `image-left` | 圖在左、內容在右 |
| `image-right` | 圖在右、內容在左 |
| `iframe` | 整頁嵌網頁 |
| `iframe-left` | 網頁在左、內容在右 |
| `iframe-right` | 網頁在右、內容在左 |
| `full` | 用滿整個畫面 |
| `end` | 結尾頁 |
| `none` | 無任何內建樣式 |

`image*` / `iframe*` 用 frontmatter 傳來源：

```md
---
layout: image-right
image: /diagram.png      # public/diagram.png（鐵則 #7）
class: my-2
---

# 標題

右邊那張圖由 layout 負責排版，你只管寫內容。
```

## 3. slots（具名插槽）

`two-cols` 用一個分隔 `::right::`，分隔線**前**的內容自動成為左欄：

```md
---
layout: two-cols
---

# 左欄標題

左欄內容（在 `::right::` 之前）。

::right::

# 右欄標題

右欄內容。
```

`two-cols-header`：分隔線**之前**的內容是跨兩欄的 header，再用 `::left::` 與 `::right::`
分下半的左右欄（**沒有 `::title::` 這個 slot**）：

```md
---
layout: two-cols-header
---

# 跨欄 Header（在所有 :: 分隔之前）

::left::

左下欄。

::right::

右下欄。
```

## 4. 在投影片內嵌 Vue 元件

`components/` 下的 `.vue` 檔名即標籤，**自動全域註冊、無需 import**：

```vue
<!-- components/Stat.vue -->
<script setup lang="ts">
defineProps<{ label: string; value: string }>()
</script>

<template>
  <div class="rounded-xl border border-gray-400/30 px-6 py-4 text-center">
    <div class="text-4xl font-bold">{{ value }}</div>
    <div class="text-sm opacity-70">{{ label }}</div>
  </div>
</template>
```

投影片裡直接用，並用 UnoCSS class 排版（**不要**塞 inline style，與 visual-web-stack
紀律一致）：

```md
# 成果

<div class="mt-8 flex gap-6">
  <Stat label="延遲下降" value="42%" />
  <Stat label="覆蓋率" value="93%" />
</div>
```

Markdown 與 HTML/元件可混排；要在某頁加局部樣式用 `<style>`（Slidev 會 scope 到該頁）：

```md
<style>
h1 { color: var(--slidev-theme-primary); }
</style>
```

> MDC（Comark）：headmatter 設 `mdc: true` 後，可用 `行內文字{.text-red}` 直接掛 class、
> `![](/img.png){width=200px}` 設屬性，免寫 HTML。語法見 https://sli.dev/features/mdc。
