# 講者備註與 presenter（presenter-notes）

適用：正式上台的 deck——每頁備註怎麼寫、時間怎麼規劃、Slidev presenter 模式能做什麼 / 不能做什麼、
怎麼排練。

對應鐵則：#3（click 與備註對齊）、#8（PPTX 匯出含備註）。

> 備註契約借鑒 [guizang-ppt-skill](https://github.com/op7418/guizang-ppt-skill) `presenter-mode.md`
> 的欄位（purpose / talk / transition / minutes / cue / fallback），落到 Slidev 原生的 notes 機制；
> 不另造 runtime。

## 1. Slidev 的備註機制（事實）

- **備註 = 每頁內文結尾的最後一個 `<!-- -->` 區塊**；夾在內文中間的註解不算備註（會被當一般
  HTML 註解）。備註支援 Markdown 與 HTML。
- **`[click]` 標記**：備註某行行首放 `[click]`，presenter 會隨該頁點擊進度**高亮並自動捲動**到對應段落；
  `[click:3]` 跳到第 3 擊（v0.48+）。這是讓「提詞」對齊「揭示節奏」的關鍵。
- **`routeAlias:`**（per-slide frontmatter）給頁面一個穩定名字，可用於 URL 與 `<Link to="alias">`；
  頁面重排時備註跟著頁走，不用重編號。
- **presenter 模式**：`http://localhost:<port>/presenter`，或導覽列講者圖示。建議開兩個視窗——
  play 模式給觀眾、presenter 給自己；presenter 翻頁時所有其他視窗自動跟隨。
  - 三種 presenter 版面（v0.50+）：當前頁在上 + 備註與下一頁在下 / 備註在左 / 下一頁放大。
  - **Screen Mirror**：把投影機畫面拉進 presenter 視窗看（live demo 時確認觀眾看到什麼）。
  - **Timer**：headmatter `duration: 30min`（預設 `30min`）、`timer: countdown | stopwatch`（預設
    stopwatch）；可開始 / 暫停 / 重置，附進度條。
  - **Drawing**：presenter 內可畫、跨視窗同步；`drawings.presenterOnly: true` 只准講者畫。
- **`/overview`**：線性列出所有頁與備註，雙擊備註可直接改，拖 click 滑桿預覽每一擊（v0.48+）。
- **`/notes-edit`**：所有頁備註集中在一個文字框批次編輯，以 `--- #[頁碼]` 分隔，自動存檔（v0.52+）。
- **`notesAutoRuby`**（v52.4+）：headmatter 設字→注音對照，備註自動加 `<ruby>`，用於人名 / 縮寫讀音。
- **遠端**：`slidev --remote` 讓同網段手機 / 另一台機器開 presenter（`--remote=密碼` 鎖住）；
  `--remote --tunnel` 走 Cloudflare 快速通道對外。
- **匯出**：`slidev export --format pptx` 每頁為圖並**帶 speaker notes**；PDF 不含備註
  （export-delivery.md §2）。

## 2. 每頁備註契約

```md
# 分頁線前後要空行

<v-clicks>

- `---` 前後各留一個空行
- 沒空行會被當成 frontmatter 吞掉
- 第一個區塊才是 headmatter

</v-clicks>

<!--
**目的**：讓觀眾記住鐵則 #2，知道「分頁亂」九成是空行問題。
- [click] 先講空行：拿真實 diff 示範一次
- [click] frontmatter 被吞的現象：整頁消失、不報錯
- [click] headmatter 只在第一個區塊——theme 寫錯位置也靜默失效
**轉場**：版面也一樣，別手刻——下一頁看內建 layout。
**提醒**：demo 掛了就直接念第三條，不重跑。
-->
```

| 欄位 | 必填 | 寫什麼 |
|------|:---:|--------|
| **目的** | ✅ | 這頁在整場敘事裡的任務，一句話。talk-craft 的 `assertion` 放這裡（handoff.md §1） |
| 提詞（清單） | ✅ | **3–5 條提詞卡**，一條一個意思；用 `[click]` 對齊揭示節奏。cover / section / end 可只 1–2 條 |
| **轉場** | ✅ | 為什麼下一頁緊接著出現；不是「下一頁」三個字 |
| **提醒** | — | 停頓、demo、影片、敏感資訊、翻頁時機；沒有就整行省略 |
| **備援** | — | demo / 網路 / 影片掛了改講什麼；只有該頁有風險時寫 |
| **互動** | — | 舉手、提問、投票的點；沒有就省 |
| 讀音 | — | 人名、縮寫、外語；優先用 `notesAutoRuby` 全域處理 |

規則：

- **slide 放觀眾此刻必須看到的結論 / 結構 / 證據；備註放背景、例子、判斷依據、語氣**——
  不要把版面文字複述一遍。
- 預設寫**提詞卡**，不寫逐字稿；使用者明確要逐字稿才展開。
- **沒有來源的事實不寫進備註**；影響正確性的缺口標「待補」並回問，不影響的可選欄位直接省略、
  不要寫「待補充」佔位。
- 備註是講者自己看的，可以口語；但術語與投影片一致（一詞一寫法）。

## 3. 時間規劃（`minutes:` + `duration:`）

```yaml
---
# headmatter
duration: 30min
timer: countdown
---
```

```yaml
---
# 每頁 frontmatter：自訂鍵，Slidev 不報錯；$nav.currentFrontmatter.minutes 可讀
layout: two-cols
routeAlias: separator-rule
minutes: 3
---
```

- 各頁 `minutes` 加總 **≤ `duration` 的 90%**（留停頓 / 互動 / 意外）；低於 55% 多半是講稿太薄。
- **全填或全不填**：部分頁有 `minutes` 時預算檢查沒有意義，`validate-deck.mjs` 會跳過並警告。
- 要在 presenter 看到本頁計畫時長，放一個 global layer 只在 presenter 顯示（`$frontmatter` 在
  global layer 是空的，要用 `$nav.currentFrontmatter`）：

```vue
<!-- global-top.vue：presenter 右上角顯示本頁計畫分鐘 -->
<template>
  <div v-if="$renderContext === 'presenter' && $nav.currentFrontmatter?.minutes"
       class="absolute top-2 right-2 text-sm opacity-70">
    本頁計畫 {{ $nav.currentFrontmatter.minutes }} 分
  </div>
</template>
```

> 匯出時 global layer 依賴導覽狀態要加 `--per-slide`（slide-structure.md §5）；上例只在 presenter
> 渲染，匯出不受影響。

## 4. 排練流程

1. `slidev` 起 dev，開 `/presenter`，第二個視窗開 play 當觀眾螢幕（或用 Screen Mirror 看投影機）。
2. `timer: countdown` 從頭走一遍；每頁對照 `minutes`，超時的頁**先刪字 / 拆頁**，不是講快一點。
3. 改備註：單頁在 `/overview` 雙擊改；通篇潤稿用 `/notes-edit`。
4. 匯出備援：`slidev export --format pptx`（含備註）給主辦 / 自己；PDF（`--with-clicks`）給觀眾。
5. 現場：`slidev --remote` 手機當遙控或第二 presenter；`drawings.presenterOnly: true` 避免觀眾視窗誤畫；
   拔網路再開一次確認字型與圖不掉（pitfalls.md P0）。

## 5. Slidev presenter 做得到 / 做不到（別亂承諾、別重造）

| 需求 | Slidev 內建 | 做不到時怎麼辦 |
|------|:-----------:|----------------|
| 下一頁預覽、備註、`[click]` 高亮 | ✅ | — |
| 總時長 timer（倒數 / 碼表）、進度條 | ✅ | — |
| 單頁計時、排練紀錄（每頁實際秒數） | ❌ | `minutes` + 人工對錶；別手刻 runtime |
| 自動翻頁 | ❌ | 不需要；要 kiosk 用 `routerMode: memory` + 自訂元件 |
| 觀眾螢幕黑屏 / 白屏 / 凍結 | ❌ | 用 OS / 投影機遙控（多數簡報遙控器有 B 鍵） |
| 雷射筆 / 圈選 | 部分 | Drawing（跨視窗同步）；雷射筆用 OS 游標或遙控器 |
| 觀眾視窗連線狀態燈 | ❌ | 同一瀏覽器 session 自動同步；跨機器用 `--remote`，上台前實測 |
| 畫面鏡像（看投影機內容） | ✅ Screen Mirror | — |
| 攝影機畫面、錄影 | ✅ Recording | — |

真的要補功能，寫自訂元件並遵守 code-and-diagrams.md §10 的三必守（讀主題 token、尊重
reduced-motion、非當前頁停 RAF），不要 fork presenter。

## 6. 驗證

```bash
node ~/.claude/skills/slidev-deck-stack/scripts/validate-deck.mjs slides.md --target-minutes 30 --require-notes
```

會抓：缺備註的頁、備註超過 7 條、`minutes` 部分填 / 加總超過 90%、`routeAlias` 重複或不是 slug；
其餘檢查見腳本開頭說明與 pitfalls.md。靜態檢查之後仍要走一次 presenter 實測。
