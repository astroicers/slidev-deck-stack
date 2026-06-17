# 地雷對照表與上台前檢查（pitfalls）

適用：出現怪 bug、匯出破版、上台前最後檢查。先查表，再回對應 reference 看完整解法。

## 地雷對照表

| 症狀 | 原因 | 解法 |
|------|------|------|
| 分頁全亂、某頁併進前一頁 | `---` 分隔線前後沒空行，被當水平線或併進內文 | 分隔線上下各留一空行（鐵則 #2，slide-structure.md） |
| 換了 `theme:`/`fonts:` 沒反應 | 寫到了某頁的 per-slide frontmatter，不是第一個區塊 | 全域設定只放 `slides.md` 最上方第一個 `---`（鐵則 #1，setup.md） |
| 內容一次全出現、點擊不展開 | 沒用 v-click/v-clicks，或手刻索引錯位 | 列表用 `<v-clicks>` 自動排序（鐵則 #3，animation.md） |
| `<v-clicks>` 包了 markdown 列表卻無效 | 標籤與列表之間沒空行，markdown 沒被解析 | `<v-clicks>` 與列表之間各留空行（animation.md §2） |
| magic-move 不動、整段不變形 | 外層不是四個反引號，或各步驟語言/結構差太多 | 用 ` ````md magic-move ` 四反引號包多個同語言區塊（鐵則 #4，code-and-diagrams.md） |
| 程式碼行高亮沒作用 | `{}` 沒接在語言同一行，或段落分隔符寫錯 | `\`\`\`ts {2,3\|5}` 緊接語言；用 `\|` 分段（code-and-diagrams.md §1） |
| Mermaid/PlantUML 不渲染或空白 | fence 標籤拼錯、圖語法錯；PlantUML 離線連不到伺服器 | 確認 ` ```mermaid ` / ` ```plantuml ` 與語法；離線設 `plantUmlServer`（code-and-diagrams.md） |
| 圖片 dev 看得到、`build` 後 404 | 圖放錯位置或用相對路徑/import | 放 `public/`、用絕對路徑 `/x.png` 引用（鐵則 #7，setup.md） |
| 自訂 Vue 元件「未註冊」 | 沒放 `components/`，或標籤大小寫對不上檔名 | 元件放 `components/`，以檔名作標籤、自動註冊（slide-structure.md §4） |
| 匯出中文變方框 | 匯出環境（chromium）取不到中文字型 | 用本地子集化 woff2 + `provider: none`，確認字型可得（鐵則 #8，setup.md §5） |
| 匯出沒有逐步動畫，只剩最終狀態 | 預設不展開 click | 加 `slidev export --with-clicks`（鐵則 #8，export-delivery.md） |
| 匯出失敗/卡住/逾時 | 沒裝 `playwright-chromium`，或大圖/iframe 載入慢 | `npm i -D playwright-chromium`；加 `--timeout`/`--wait`（export-delivery.md） |
| 部署後整頁資源 404 | 部署在子路徑卻沒設 base | `slidev build --base /<repo>/`（GitHub Pages，export-delivery.md §5） |
| 首屏載入很慢、字型抓很久 | `Noto Sans TC` 全字集全字重從 CDN 抓 | 限 `weights`、或本地子集化字型（鐵則 #8，setup.md §5） |
| 一頁點擊數爆多、自己數錯 | 把複雜編排硬塞同一頁 | 拆頁、控制每頁 click 預算（鐵則 #3，animation.md §4） |

## 上台前檢查清單

- [ ] **整份翻一次**：dev 模式逐頁走，確認每頁 click 數與節奏符合預期。
- [ ] **匯出 PDF 備援**：`slidev export`（需要動畫加 `--with-clicks`），翻過確認中文
      沒變方框、粗體有對到字重。
- [ ] **資源離線可用**：圖片在 `public/`、字型本地化；拔網路再開一次確認不掉資源。
- [ ] **presenter 備註**：每頁 `<!-- 備註 -->` 齊全，用 presenter 模式對過時間。
- [ ] **部署 URL 實開**：線上 SPA 開過，子路徑 base 正確、資源不 404。
- [ ] **深色/淺色都看**：若 `colorSchema: all`，兩個模式都檢查對比是否足夠。
- [ ] **版本鎖定**：`playwright-chromium` 在 devDependencies，換機器/CI 能重現匯出。
