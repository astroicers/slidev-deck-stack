# 動畫與互動（animation）

適用：逐步揭示內容、控制元素出現節奏、加進場動態、設定換頁過場。

對應鐵則：#3（用 `<v-clicks>`、不手刻索引）。

選型速記（細節見 SKILL.md 選型表）：列表逐項→`<v-clicks>`；精準插隊→`v-click="n"`；
帶位移/縮放動態→`v-motion`；換整頁→`transition`。

## 1. v-click 基礎

元素預設顯示，加 `v-click` 後要按一下才出現。元件與指令兩種寫法：

```md
<v-click>按一下才出現（元件寫法）</v-click>

<div v-click>按一下才出現（指令寫法）</div>
```

## 2. 列表逐項揭示用 `<v-clicks>`（鐵則 #3）

列表/多元素**不要**逐行手刻索引——用 `<v-clicks>` 自動排序：

```md
<!-- ❌ 反例：手刻絕對索引，插一行就要全部重編號 -->
<div v-click="1">第一點</div>
<div v-click="2">第二點</div>
<div v-click="3">第三點</div>

<!-- ✅ 正例：包起來自動排序 -->
<v-clicks>

- 第一點
- 第二點
- 第三點

</v-clicks>
```

進階 props：

```md
<v-clicks depth="2">     <!-- 連巢狀子項一起逐項 -->

- 主項
  - 子項 a
  - 子項 b

</v-clicks>

<v-clicks every="2">     <!-- 每按一下揭示 2 項 -->

- a
- b
- c
- d

</v-clicks>
```

## 3. 精準控制：v-after、.hide、絕對/相對索引

```md
<div v-click>先出現</div>
<div v-after>跟著一起出現（等同 v-click="'+0'"）</div>

<div v-click.hide>點一下後「消失」而非出現</div>
<v-click hide>元件版的 hide（prop）</v-click>

<div v-click="3">第 3 擊後才出現（絕對）</div>
<div v-click="'+1'">在前一個 click 後再加一擊（相對，需引號）</div>
```

- 絕對：`v-click="3"` / `1` / `'1'`；相對：`'+1'` / `'-1'`（**相對值要加引號**）。
- 進出區間用陣列 `v-click="[2, 4]"`：第 2 擊出現、第 4 擊消失（**結束索引不含**）。

## 4. `$clicks` 與 click 數控制

`$clicks` 是當前頁已點擊數，可拿來做條件渲染或驅動樣式：

```md
<div :class="$clicks >= 2 ? 'text-red-500' : ''">到第 2 擊變紅</div>
```

每頁 click 總數由內容自動推導；要手動鎖定可在該頁 frontmatter 設 `clicks:`：

```md
---
clicks: 5        # 本頁固定 5 擊（如 v-motion 需要的擊數多於元素數時）
---
```

**click 預算（鐵則 #3）**：一頁 click 數要可控、可預期。一頁塞十幾擊，講者自己會數錯、
觀眾也累。複雜編排優先拆頁，而不是硬塞同一頁。

## 5. v-motion（進場帶位移/縮放動態）

`v-motion` 給元素加「初始→進場」的位移/縮放/旋轉動態；可綁 click 階段（`:click-x`）：

```md
<div
  v-motion
  :initial="{ x: -80, opacity: 0 }"
  :enter="{ x: 0, opacity: 1 }"
  :click-1="{ scale: 1.1 }"
  :leave="{ x: 80, opacity: 0 }"
>
  從左滑入，第 1 擊放大
</div>
```

- `:initial` 進場前、`:enter` 進場後、`:leave` 離場；`:click-x` 對應 `$clicks >= x`，
  `:click-x-y` 對應 `x <= $clicks < y`。

## 6. 換頁過場（transition）

全域放 headmatter、單頁覆寫放該頁 frontmatter：

```md
---
transition: slide-left      # 全域：所有頁向左滑
---
```

```md
---
transition: fade            # 本頁覆寫成淡入淡出
---
```

內建名稱：`fade`、`fade-out`、`slide-left`、`slide-right`、`slide-up`、`slide-down`、
`view-transition`。

- 前進/後退不同方向用 `|`：`transition: slide-left | slide-right`（前進左滑、後退右滑）。
- `view-transition` 用瀏覽器原生 View Transitions API，可讓跨頁同名元素「變形接續」，
  做高張力轉場。
- 自訂過場用物件：`transition: { forward: 'my-fwd', backward: 'my-bwd' }`，底層即 Vue
  `<TransitionGroup>`，名稱對應你自訂的 CSS。（物件語法見型別定義 `frontmatter.ts`；官方
  animations 頁僅逐字列 `|` 寫法，故 `.fact-check.md` #16 以原始碼為第二佐證來源。）

## 7. draggable elements（拖曳定位元素）

要把箭頭/標籤/圖示拖到精準位置（而非用 CSS 慢慢試）時用。位置格式一律是五個值
`Left,Top,Width,Height,Rotate`（最後一個 `Rotate` 是**旋轉角度**——Slidev 沒有單頁
`rotate:` frontmatter，旋轉只在這裡）。三種寫法：

```md
<!-- 指令：任意元素加 v-drag，傳位置陣列 -->
<img v-drag="[120, 200, 180, 120, 0]" src="/logo.png">

<!-- 元件：當可拖曳容器；Height 給 NaN(指令)/_(元件) 表示隨內容自動 -->
<v-drag pos="120,200,180,_" text-3xl>
  <div class="i-carbon:arrow-up" /> 可拖曳容器
</v-drag>

<!-- 可拖曳箭頭：非位置的樣式 props 同 <Arrow> -->
<v-drag-arrow color="#4471cb" two-way />
```

**互動定位**：不必手算座標——不給位置值時 Slidev 自動產生初始位置；在預覽中**雙擊**元素即可拖拉/縮放/旋轉。

**位置存哪（重要踩雷）**：Slidev 預設用 regex 把新位置寫回 slide 內文的 `v-drag="[...]"`；
若改不動或出問題，改用具名位置存到該頁 frontmatter `dragPos:`，更穩定：

```md
---
dragPos:
  logo: 120,200,180,120,0
---

<img v-drag="'logo'" src="/logo.png">
```

> `<VDrag>` / `<VDragArrow>` 也列在 [builtin-components.md](builtin-components.md)，定位細節以本節為準。
