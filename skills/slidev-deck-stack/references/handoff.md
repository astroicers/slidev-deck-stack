# 交棒 handoff — 消費 talk-craft 的 ghost-deck

> 適用：拿到 talk-craft 產出的 ghost-deck artifact，把它落成 Slidev deck。ghost-deck 的**產出
> 規格**在 talk-craft 的 `references/templates.md` §3——**欄位字字對齊**，本檔只談「怎麼消費」。

## 1. ghost-deck 形狀（與 talk-craft 共用契約）

**deck header**（決定全域 headmatter）：

| 欄位 | 用途 | slidev 對映 |
|------|------|-------------|
| `governing-thought` | 全場單一訊息 | 寫進 `info:` / 封面副標 |
| `talk-type` | talk 類型 | 輔助選 theme（見 §3） |
| `audience` | 受眾 persona | 不落版面，影響用詞/密度 |
| `arc` | 敘事弧 | 決定 section 切點與封面/結尾 |
| `design-direction` | 設計方向 | → 對映 theme（見 §3） |

**per-slide `slide` 區塊** → 每塊一頁：

| 欄位 | 用途 | slidev 對映 |
|------|------|-------------|
| `title` | action title | 該頁 `#` 標題（**原句照搬，別改成主題標籤**） |
| `assertion` | 口頭單一訊息 | 放講者備註（slide 末 HTML 註解），不堆進版面 |
| `exhibit` | 證據型別 | → 對映 layout/component（見 §2） |
| `reveal` | 逐步揭示節點 | → `<v-clicks>` / `v-click`（animation.md） |
| `note` | 講者提示 | 併入講者備註 |

## 2. exhibit → layout / component 對映

| `exhibit` | Slidev 做法 | 參考檔 |
|-----------|-------------|--------|
| `code` | code block + 行高亮 `{1\|2-3}` / magic-move（鐵則 4） | code-and-diagrams.md |
| `diagram` | Mermaid / PlantUML / inline SVG（鐵則 6） | code-and-diagrams.md |
| `chart` | `two-cols`（圖 + 論點）或 `image-right`（靜態圖） | slide-structure.md |
| `photo` | `image` / `image-left` / `image-right` | slide-structure.md |
| `number` | `layout: fact`（大數字） | slide-structure.md |
| `quote` | `layout: quote` | slide-structure.md |
| `section` | `layout: section`（章節分隔） | slide-structure.md |
| `none` | `default`；純標題宣告用 `layout: statement` | slide-structure.md |

`reveal` 有值 → 內文用 `<v-clicks>` 逐項揭示；節點順序即點擊順序（animation.md）。

## 3. design-direction → theme 對映

talk-craft 只給設計**方向**，這裡對映到實際 Slidev theme（選型細節見 theming-style.md §1）：

| `design-direction` | theme 建議 |
|--------------------|-----------|
| 暗色終端 | geist（dark）/ dracula / the-unnamed / nord ＋ `colorSchema: dark` |
| 學術襯線 | academic / seriph / frankfurt |
| keynote 大字 | apple-basic / seriph（放大字級 + 留白） |
| 教學 | neversink / penguin |
| 企業 | seriph / geist ＋ 品牌色 token |
| 通用 | default / seriph |

## 4. 落地流程

1. **deck header → headmatter**：`design-direction` 對映 theme（§3）、`title`/`info` 取自
   `governing-thought`、`colorSchema` 依方向。
2. **每個 `slide` 區塊 → 一頁**：`title` 照搬為 `#` 標題、`exhibit` 選 layout（§2）、`reveal`
   接 `<v-clicks>`、`assertion` + `note` 進講者備註。
3. 之後一切照本 skill 鐵則（分頁前後空行、內建 layout、圖走程式碼、匯出鎖 chromium、中文字型…）。

> **邊界**：talk-craft 不碰 theme / font / layout；本 skill 不改 `title` / 敘事 / 論證（那是
> talk-craft 領域）。雙語**內容**策略歸 talk-craft；中文**字型**落地歸本 skill
> （setup.md §5、theming-style.md §5）。
