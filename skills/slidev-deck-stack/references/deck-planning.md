# 規劃 deck（deck-planning）

適用：動手寫 `slides.md` **之前**。把需求澄清、時長換頁數、頁面計畫表、版面節奏、圖片約定
先對齊，再開始寫——結構定錯了，事後翻修的成本最高。

對應鐵則：#3（click 預算）、#5（內建 layout）、#6 / #7（圖與資源）。

> 工作流借鑒 [guizang-ppt-skill](https://github.com/op7418/guizang-ppt-skill) 的「七問澄清 →
> 節奏表 → 分級自檢」，落到 Slidev；內容與論證仍歸 talk-craft（見 handoff.md）。

## 0. 兩種入口

| 入口 | 怎麼走 |
|------|--------|
| 有 talk-craft 的 **ghost-deck** | 跳過 §1；照 [handoff.md](handoff.md) 對映，本檔 §2–§4 的「頁面計畫表」接在 handoff.md §4 第 1 步與第 2 步之間 |
| 只有題目 / 大綱 / 文章 | 先走 §1 七問；**沒有大綱或論證**時建議先用 talk-craft 產 ghost-deck，再回來 |

使用者已給完整大綱 + 素材 + 交付形式 → 可直接進 §3。只給一個題目或模糊想法 → 七問逐一對齊，
**別猜著開工**。

## 1. 需求澄清七問（動手前必做）

| # | 問題 | 為什麼要問 | 影響哪個決定 |
|---|------|-----------|-------------|
| 1 | **受眾與場景？**（研討會 talk / 內部分享 / 教學 workshop / 產品 demo / 課程） | 決定密度、語氣、要不要現場互動 | theme 方向、每頁字數、是否用 Monaco |
| 2 | **時長？** | 換算頁數與 click 預算（§2） | 頁數、`duration:`、每頁 `minutes:` |
| 3 | **有什麼素材？**（大綱 / 文章 / 舊 deck / repo 程式碼 / 數據） | 有素材就以素材為本，沒大綱先走 talk-craft | 內容來源、`snippets/` 要匯入哪些檔 |
| 4 | **要展示哪些程式碼、畫哪些圖？有沒有非放不可的截圖？** | 程式碼走行高亮 / magic-move、圖走 Mermaid / SVG（鐵則 #4 / #6）；截圖是例外要先講好 | `<<<` 匯入清單、圖表型別、截圖處理（§5） |
| 5 | **設計方向 / 品牌色？深色還是淺色？** | 對映 theme 與 token | `theme:`、`colorSchema:`、`--slidev-theme-primary`（theming-style.md §1 / handoff.md §3） |
| 6 | **交付形式？**（現場投影 SPA / PDF 備援 / PPTX 給主辦 / 線上部署 / 錄影） | 決定字型策略與匯出旗標（鐵則 #8） | `--with-clicks`、字型本地化、`exportFilename`、部署 base |
| 7 | **硬約束？**（必含 / 不可出現：機密、客戶名、logo、語言、模板） | 避免返工 | 遮蔽清單、術語表、`public/` 資源 |

- 一次最多問 **3 個最關鍵**的（通常是 1、2、6）；不影響開工的缺口先做合理假設，並在回覆裡標明。
- Claude Code 內用 AskUserQuestion 逐項問；一般對話直接問，別假設工具存在。
- 問完把答案記到 deck 根目錄的 `plan.md`（§3 的頁面計畫表也放這裡），**不進 `slides.md`**。

## 2. 時長 → 頁數與 click 預算

技術 deck 的程式碼頁比敘事頁慢，預算要比一般簡報保守：

| 時長 | 頁數建議 | 備註 |
|------|---------|------|
| 10 分（lightning） | 8–10 頁 | 一個主張、一段程式碼、一張圖 |
| 15 分 | 10–12 頁 | |
| 30 分 | 18–22 頁 | 2–3 個章節，各配一頁 `section` |
| 45 分 | 25–30 頁 | |
| 60 分（workshop） | 30–40 頁 | 含練習頁，練習頁不計 click |

- 每頁平均 1–1.5 分；**程式碼 / magic-move 頁 2–4 分**；`section` / `fact` / `statement` 頁 0.5 分。
- 各頁 `minutes:` 加總 **≤ 時長的 90%**，留停頓、互動、意外的緩衝（presenter-notes.md §3）。
- 每頁 click 預算預設 **≤ 6**（鐵則 #3）；超過就拆頁，不要硬塞。

## 3. 頁面計畫表（寫碼前先填）

規劃「看什麼」的同時規劃「說什麼」，一張表對齊三件事：敘事弧（talk-craft）↔ 版面 ↔ 時間。

| 頁 | `routeAlias` | 章節 | layout | exhibit | 觀眾看到 | click | min | 講者補充 / 轉場 |
|---:|--------------|------|--------|---------|----------|------:|----:|----------------|
| 1 | `cover` | — | cover | none | 題目 + 一句 governing thought | 0 | 1 | 自介 15 秒 → 「今天只講三件事」 |
| 2 | `part-structure` | 一 | section | section | 章節名 | 0 | 0.5 | 一句帶過 |
| 3 | `separator-rule` | 一 | two-cols | code | 三條規則 + 錯誤示範 | 3 | 3 | [click] 逐條；轉場：「版面也一樣」 |
| 4 | `fact-layouts` | 一 | fact | number | 「19 種內建 layout」 | 0 | 1 | 強調不手刻 |
| … | | | | | | | | |

欄位規則：

- **`routeAlias`**：小寫英文 slug，當**穩定 ID**（頁面重排不改；`<Link to="alias">` 與備註對照都用它）。
  寫進該頁 frontmatter（Slidev 原生鍵）。
- **layout / exhibit**：exhibit → layout 對映見 [handoff.md](handoff.md) §2；一頁**一個** exhibit。
- **click**：估算該頁點擊數（`<v-clicks>` 項數 + 行高亮分段 + magic-move 步數），≤ 預算。
- **min**：寫進該頁 frontmatter `minutes:`（自訂鍵，Slidev 不報錯；`$nav.currentFrontmatter.minutes`
  可讀，`scripts/validate-deck.mjs` 會加總比對 `duration:`）。
- **講者補充 / 轉場**：之後落成備註（presenter-notes.md §2）；轉場寫「為什麼下一頁緊接著出現」，不是「下一頁」。

計畫表存 `plan.md`，與 `slides.md` 並列；改結構先改表再改檔。

## 4. 版面節奏（rhythm）

把 layout 分兩類：

- **換氣頁（hero）**：`cover` / `intro` / `section` / `statement` / `fact` / `quote` / `end` / `center`——
  一頁一句話或一個數字，給觀眾喘息。
- **密集頁**：`default` / `two-cols` / `two-cols-header` / `image-*`，放程式碼、清單、圖表。

硬規則（`validate-deck.mjs` 會警告）：

1. **每 3–4 頁密集頁插一頁換氣頁**；連續 5 頁密集 → 拆或插 `section` / `fact`。
2. **同一 layout 連續 ≤ 3 頁**；10 頁以上至少用 **4 種** layout。
3. **程式碼頁與大字頁交替**：magic-move 後面接 `statement` 收結論，比再接一頁程式碼有效。
4. **一頁一個訊息**：action title（一句話主張）+ 一個 exhibit；想塞第二個 exhibit 就是第二頁。
5. **章節**：每章開頭 `section`；章節 ≥ 3 個才放 `<Toc>`（builtin-components.md），否則目錄頁是浪費。
6. **動畫節制**：`transition` 全場一種、`v-motion` 只給 cover / section；每頁 click ≤ 預算
   （animation.md §8）。

30 分 / 20 頁的參考骨架：

```
cover → section(一) → 3–4 密集頁 → fact/statement →
section(二) → 3–4 密集頁 → quote/statement →
section(三) → 2–3 密集頁 → statement(takeaway) → end
```

目視自檢：`grep -n '^layout:' slides.md` 把 layout 序列列出來看節奏是否交錯。

## 5. 圖片與截圖約定（鐵則 #6 / #7 的例外處理）

預設圖走程式碼（Mermaid / PlantUML / SVG / KaTeX，鐵則 #6）。**非放不可的截圖**（產品 UI、dashboard、
他人投影片、實拍）才用圖檔，而且先講好規矩：

| 項目 | 約定 |
|------|------|
| 位置與命名 | `public/img/{NN}-{semantic}.{png\|jpg\|webp}`，`NN` 補零 = 頁碼、語義用英文短詞（`03-dashboard.png`）；換圖**同名覆蓋**，`slides.md` 不用改 |
| 規格 | 寬 ≥ 1600px（投影不糊）；UI / 透明用 PNG，照片用 JPG / WebP；單張 < 1 MB、全 deck 圖 < 10 MB（影響載入與匯出），**先壓再放** |
| 比例 | 只用標準比例 16:9 / 16:10 / 4:3 / 3:2 / 1:1；**同一組圖統一比例與高度**，別一張 contain 一張 cover |
| 落位 | 整頁圖 `layout: image`；圖文 `image-left` / `image-right`；多圖用 `two-cols` + `<img class="h-60 object-contain">` 統一高度（slide-structure.md §2） |
| 截圖保真 | UI / 文字截圖**不可裁掉關鍵文字**：`backgroundSize: contain`；照片用預設 `cover` |
| 內容處理 | 先遮敏感資訊（帳號、token、客戶名、內網位址）；裁掉瀏覽器 chrome 與無關工具列；圖內**不要自帶**標題 / 頁碼 / 浮水印（deck 自己有） |
| 深淺模式 | 截圖只有一個底色時，用 `<LightOrDark>` 給兩版，或選底色與 `colorSchema` 一致的那張（builtin-components.md） |
| 沒圖怎麼辦 | 先用 Mermaid / SVG 佔位把結構做完，等圖到了再換；別讓圖擋住整份進度 |

引用一律 `/img/03-dashboard.png`（鐵則 #7）；`image:` / `background:` frontmatter 同理。

## 6. 規劃完成的檢查

- [ ] 七問都有答案，或已明確標註假設。
- [ ] 頁數在時長預算內；`minutes` 加總 ≤ 時長 90%。
- [ ] 每頁一個 exhibit、一個 action title；click ≤ 預算。
- [ ] 節奏：無連續 4 頁同 layout、無連續 5 頁密集頁；章節開頭有 `section`。
- [ ] 截圖清單：路徑、比例、遮蔽項目都列出；其餘圖已決定用哪種程式碼生成。
- [ ] 交付形式已定 → 字型策略（setup.md §5）、`--with-clicks`、部署 base（export-delivery.md）。
- [ ] 以上寫進 `plan.md`；接著進 [slide-structure.md](slide-structure.md) 動手。
