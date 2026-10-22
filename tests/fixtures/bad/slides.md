---
title: 壞範例
mdc: true
fonts:
  sans: 'Noto Sans TC, Inter'
minutes: 1
---

# 封面（沒有備註）

---
theme: seriph
layout: default
minutes: 1
---

# 第二頁：theme 寫錯位置

---
layout: default
routeAlias: dup
minutes: 1
---

# 第三頁：v-clicks 沒空行、手刻索引

<v-clicks>
- 清單緊貼標籤
- 不會被解析
</v-clicks>

<div v-click="1">a</div>
<div v-click="2">b</div>
<div v-click="3">c</div>

---
layout: default
routeAlias: dup
minutes: 1
---

# 第四頁：routeAlias 重複、分頁線被吞
這行緊貼分頁線
---
# 這整段會被 Slidev 當成 frontmatter 吞掉

直到下一個分隔線為止

---
layout: default
minutes: 1
---

# 第五頁：magic-move 用錯反引號、相對路徑

```md magic-move
```ts
const a = 1
```
```

![架構](./img/arch.png)

<img src="../assets/x.png" />

---
layout: default
zoom: 0.6
routeAlias: Closing Page
minutes: 11
---

# 第六頁：zoom 太小、routeAlias 不是 slug、標題太長太長太長

- 1
- 2
- 3
- 4
- 5
- 6
- 7
- 8
- 9

---
layout: default
minutes: 1
---

# 第七頁：click 爆預算

```ts {1|2|3|4|5|6|7|8}
const a = 1
```

---
layout: default
minutes: 1
---

# 第八頁

- a
- b
- c
- d
- e

---
layout: default
minutes: 1
---

# 第九頁

- a
- b
- c
- d
- e
