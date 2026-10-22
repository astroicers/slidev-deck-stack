# 地雷對照表與分級檢查（pitfalls）

適用：出現怪 bug、匯出破版、內容塞不下、上台前最後檢查。先查表，再回對應 reference 看完整解法；
交付前照 §4 的 P0 → P3 分級自檢，**P0 任一不過就不上台**。

> 分級與「先量後改」借鑒 [guizang-ppt-skill](https://github.com/op7418/guizang-ppt-skill)
> `checklist.md`，項目全部換成 Slidev 的實際踩雷。

## 1. 地雷對照表

| 症狀 | 原因 | 解法 |
|------|------|------|
| 分頁全亂、某頁併進前一頁、整頁消失 | `---` 分隔線前後沒空行：後面直接接內文會被**當成 frontmatter 吞掉** | 分隔線上下各留一空行（鐵則 #2，slide-structure.md §1；`validate-deck.mjs` 會抓） |
| 換了 `theme:` / `fonts:` 沒反應 | 寫到了某頁的 per-slide frontmatter，不是第一個區塊 | 全域設定只放 `slides.md` 最上方第一個 `---`（鐵則 #1，setup.md） |
| 內容一次全出現、點擊不展開 | 沒用 v-click / v-clicks，或手刻索引錯位 | 列表用 `<v-clicks>` 自動排序（鐵則 #3，animation.md） |
| `<v-clicks>` 包了 markdown 列表卻無效 | 標籤與列表之間沒空行，markdown 沒被解析 | `<v-clicks>` 與列表之間各留空行（animation.md §2） |
| magic-move 不動、整段不變形 | 外層不是四個反引號，或各步驟語言 / 結構差太多 | 用 ` ````md magic-move ` 四反引號包多個同語言區塊（鐵則 #4，code-and-diagrams.md） |
| 程式碼行高亮沒作用 | `{}` 沒接在語言同一行，或段落分隔符寫錯 | `\`\`\`ts {2,3\|5}` 緊接語言；用 `\|` 分段（code-and-diagrams.md §1） |
| code groups（`::code-group`）不渲染 | 沒開 `comark: true`（`mdc:` 是舊鍵、已 deprecated） | headmatter `comark: true`（code-and-diagrams.md §9） |
| Mermaid / PlantUML 不渲染或空白 | fence 標籤拼錯、圖語法錯；PlantUML 離線連不到伺服器 | 確認 ` ```mermaid ` / ` ```plantuml ` 與語法；離線設 `plantUmlServer`（code-and-diagrams.md） |
| 圖片 dev 看得到、`build` 後 404 | 圖放錯位置或用相對路徑 / import | 放 `public/`、用絕對路徑 `/x.png` 引用（鐵則 #7，setup.md） |
| 截圖文字被裁掉 | `image-*` layout 預設 `cover` 會裁 | frontmatter 加 `backgroundSize: contain`（slide-structure.md §2） |
| 自訂 Vue 元件「未註冊」 | 沒放 `components/`，或標籤大小寫對不上檔名 | 元件放 `components/`，以檔名作標籤、自動註冊（slide-structure.md §4） |
| 匯出中文變方框 | 匯出環境（chromium）取不到中文字型 | 用本地子集化 woff2 + `provider: none`，確認字型可得（鐵則 #8，setup.md §5） |
| 匯出沒有逐步動畫，只剩最終狀態 | 預設不展開 click | 加 `slidev export --with-clicks`（鐵則 #8，export-delivery.md） |
| 匯出失敗 / 卡住 / 逾時 | 沒裝 `playwright-chromium`，或大圖 / iframe 載入慢 | `npm i -D playwright-chromium`；加 `--timeout` / `--wait`（export-delivery.md） |
| 匯出後頁碼 / 頁尾全是第一頁的值 | global layer 依賴導覽狀態，匯出沒逐頁渲染 | `slidev export --per-slide`，或改用 `slide-bottom.vue`（slide-structure.md §5） |
| 部署後整頁資源 404 | 部署在子路徑卻沒設 base | `slidev build --base /<repo>/`（GitHub Pages，export-delivery.md §5） |
| 首屏載入很慢、字型抓很久 | `Noto Sans TC` 全字集全字重從 CDN 抓 | 限 `weights`、或本地子集化字型（鐵則 #8，setup.md §5） |
| 英文與數字看起來粗糙、不像 Inter | `fonts.sans` 把 CJK 字型放第一個 | 拉丁字型在前、CJK 當 fallback（setup.md §5） |
| 一頁點擊數爆多、自己數錯 | 把複雜編排硬塞同一頁 | 拆頁、控制每頁 click 預算 ≤ 6（鐵則 #3，animation.md §4） |
| 備註沒出現在 presenter | `<!-- -->` 不在該頁**內文結尾**（夾在中間的只是註解） | 備註移到該頁最後（presenter-notes.md §1） |
| 備註 `[click]` 高亮不跟著動 | 標記不在行首，或標記數多於該頁 click 數 | `[click]` 放行首；數量對齊 `<v-clicks>` 項數（presenter-notes.md §1） |
| 連續好幾頁長得一樣、觀眾走神 | 全 deck 都是 `default` + 清單，沒有換氣頁 | 每 3–4 頁插 `section` / `fact` / `statement`（deck-planning.md §4） |
| 內容塞不下、溢出畫布 | 一頁兩個 exhibit，或程式碼太長 | 照 §3 的溢出階梯處理，別先縮 `zoom` |
| 內嵌 canvas / 自訂動畫深色模式對不上、或開「減少動態」還在狂動 | 元件寫死色、沒尊重 reduced-motion、離開該頁也沒停 | 讀主題 token 取色、`prefers-reduced-motion` 定格代表幀、非當前頁停 RAF（code-and-diagrams.md §10） |

## 2. 自檢指令

```bash
# 靜態檢查：鐵則 #1/#2/#3/#4/#7/#8、節奏、備註、minutes 預算（詳見腳本開頭）
node ~/.claude/skills/slidev-deck-stack/scripts/validate-deck.mjs slides.md --target-minutes 30 --require-notes

grep -n '^layout:' slides.md                         # layout 序列，目視節奏是否交錯
grep -c 'v-click="[0-9]' slides.md                   # 手刻絕對索引數，應接近 0
grep -nE '\]\(\.{1,2}/|src="\.{1,2}/' slides.md      # 相對路徑圖片，應無
grep -n '^```md magic-move' slides.md                # 三反引號 magic-move，應無（要四個）
grep -n '^---' slides.md                             # 分頁線行號，對照「前後空行」
```

**視覺核對不可省**：程式碼只能證明結構存在，證明不了版面舒服。

```bash
slidev export --format png --output shots --with-clicks   # 每頁（每擊）一張 PNG，逐張看
```

Agent 可直接讀 PNG 檢查：標題有沒有折成兩行、程式碼有沒有被裁、圖與文字有沒有撞、深色模式對比夠不夠。
dev 模式搭 Slidev 內建 MCP（v52.17+，`slidev-goto-slide`）可邊改邊跳到該頁目視。

## 3. 先量後改：內容溢出階梯

Slidev 畫布固定 `canvasWidth`（預設 980px）等比縮放，**溢出直接被裁、不會自動縮**。看到溢出先判斷
程度，再按階梯處理——不要一上來就砍內容或縮 `zoom`，縮過頭底部會多出一大片空白：

| 溢出程度 | 做法 |
|---------|------|
| 1–2 行 | 刪贅字、合併兩條清單、標題改短；程式碼刪空行與註解 |
| 約三分之一 | 拆成兩頁；或改 `two-cols` 重排；程式碼用 `{maxHeight:'300px'}` 可捲、或 `<<<` 只匯入 `#region` 片段 |
| 整頁放不下 | 換 layout / 拆章節；真要縮用 `zoom: 0.9`（**下限 0.8**）；單一元素用 `<Transform :scale="0.8">` |

反查：修完如果底部空白超過三分之一，就是修過頭，回調一格。每輪只動一個階梯，重新出圖再看。

## 4. 分級檢查清單（交付前逐項勾）

### 🔴 P0 · 不過就不上台

- [ ] `validate-deck.mjs` **0 錯誤**：headmatter 位置、分頁空行、magic-move 反引號、相對路徑、routeAlias 重複。
- [ ] **匯出 PDF 備援翻過**：`slidev export --with-clicks`，中文沒變方框、粗體有對到字重、逐步動畫有展開。
- [ ] `playwright-chromium` 在 devDependencies；換機器 / CI 能重現匯出。
- [ ] **資源離線可用**：圖在 `public/`、字型本地化；拔網路再開一次不掉資源。
- [ ] **每頁有講者備註**，presenter 實測過一次：下一頁預覽、timer、第二視窗同步。
- [ ] **部署 URL 實開**：子路徑 base 正確、資源不 404。

### 🟡 P1 · 節奏與可讀性

- [ ] 節奏：無連續 4 頁同 layout、無連續 5 頁密集頁；每章開頭有 `section`。
- [ ] 每頁 click ≤ 6；列表用 `<v-clicks>`、沒有手刻一排 `v-click="n"`。
- [ ] 密度：每頁 ≤ 8 條清單、標題 ≤ 24 字；`zoom` ≥ 0.8；沒用 `text-xs` 硬塞內文（theming-style.md §6）。
- [ ] 程式碼：行高亮或 magic-move，沒有整坨貼；長片段走 `<<<`。
- [ ] `minutes` 加總 ≤ `duration` 的 90%，或明確決定不規劃時間。

### 🟢 P2 · 視覺打磨

- [ ] 深色 / 淺色都看過（`colorSchema: all` 時兩個模式對比都夠）。
- [ ] 圖走程式碼；非放不可的截圖同組統一比例、遮了敏感資訊、沒自帶標題 / 頁碼（deck-planning.md §5）。
- [ ] 字型：拉丁字型在前、CJK 在後；`mono` 有中文 fallback。
- [ ] `transition` 全場一種；`v-motion` 只在 cover / section（animation.md §8）。
- [ ] 術語一詞一寫法；中英文之間空格一致。

### 🔵 P3 · 操作細節

- [ ] headmatter 有 `title` / `info` / `exportFilename`；`duration` / `timer` 依場合設。
- [ ] `comark: true`（不是舊鍵 `mdc`）。
- [ ] `routeAlias` 是小寫 slug；`plan.md` 與 `slides.md` 頁序一致。
- [ ] `.gitignore` 有 `dist/`、`.slidev/`（drawings 不 persist 時）。
- [ ] 現場用 `drawings.presenterOnly: true`，避免觀眾視窗誤畫。
