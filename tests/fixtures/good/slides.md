---
theme: seriph
title: 把 Slidev 做對
info: |
  slidev-deck-stack 驗證用 fixture（good）
transition: slide-left
comark: true
duration: 20min
timer: countdown
minutes: 1
fonts:
  sans: 'Inter, Noto Sans TC'
  mono: 'Fira Code, Noto Sans TC'
  weights: '400,700'
colorSchema: dark
---

# 把 Slidev 做對

一份 20 分鐘的技術分享

<!--
**目的**：讓觀眾知道這 20 分鐘會拿到什麼。
- 自我介紹 15 秒
- 今天只講三件事：分頁、程式碼、匯出
**轉場**：先從大家最常踩的分頁問題開始。
-->

---
layout: section
routeAlias: part-structure
minutes: 1
---

# 一、分頁與版面

<!--
**目的**：章節分隔，給觀眾換氣。
- 一句話帶過：分頁亂 = 空行問題
**轉場**：看一個真實案例。
-->

---
layout: two-cols
routeAlias: separator-rule
minutes: 3
---

# 分頁線前後要空行

<v-clicks>

- `---` 前後各留一個空行
- 沒空行會被當成 frontmatter 吞掉
- 第一個區塊才是 headmatter

</v-clicks>

::right::

```md {1|3|all}
---
layout: center
---
```

<!--
**目的**：讓觀眾記住鐵則 #2。
- [click] 先講空行
- [click] 再講 frontmatter 被吞的現象
- [click:3] 最後帶出 headmatter 只在第一個區塊
**轉場**：版面也一樣，別手刻。
-->

---
layout: fact
routeAlias: fact-layouts
minutes: 1
---

# 19 種

內建 layout，夠你不用手刻 flex

<!--
**目的**：用數字讓人停下來。
- 強調「內建、不手刻」
**轉場**：接著看程式碼怎麼呈現。
-->

---
layout: section
routeAlias: part-code
minutes: 1
---

# 二、程式碼

<!--
**目的**：章節分隔。
- 一句話：聚焦 → 演化
**轉場**：先看聚焦。
-->

---
routeAlias: magic-move-demo
minutes: 4
---

# 程式碼演化用 magic-move

````md magic-move
```ts
const x = data.filter(Boolean)
```

```ts
const x = data.filter(Boolean).map(f)
```
````

<img src="/diagram.png" class="h-40" />

<!--
**目的**：示範 magic-move 比貼整坨好在哪。
- 兩步演化，token 會自己對位
- 四個反引號包多個區塊
- 架構圖放 public/ 用絕對路徑
**轉場**：最後講匯出。
-->

---
layout: image-right
image: /arch.png
backgroundSize: contain
routeAlias: export-rules
minutes: 4
---

# 匯出要可重現

- 鎖 `playwright-chromium`
- `--with-clicks` 保留逐步動畫
- 中文字型要在匯出環境可得

<!--
**目的**：讓觀眾回去就能跑 CI 匯出。
- 三條規則各一句
- 字型變方框的現場故事
**轉場**：收尾。
-->

---
layout: end
routeAlias: closing
minutes: 1
---

# 謝謝

<!--
**目的**：收束。
- 三個 takeaway 各一句
- 留 Q&A
-->
