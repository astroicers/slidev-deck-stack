# 匯出與交付（export-delivery）

適用：匯出 PDF/PPTX/PNG、建 SPA 部署、用 presenter 模式講稿、寫每頁備註。

對應鐵則：#8（鎖 `playwright-chromium`、點擊步驟用旗標）、#7（`public/` 資源）。

## 1. 前置：鎖定 playwright-chromium（鐵則 #8）

匯出 PDF/PPTX/PNG 走無頭 chromium，必須裝為 **devDependency** 才能在他人機器/CI 重現：

```bash
npm i -D playwright-chromium
```

> 鎖進 `package.json` 的 devDependencies；只在本機全域裝會導致「我這邊好好的、CI 匯不
> 出來」。

## 2. 匯出 PDF / PPTX / PNG / Markdown

```bash
slidev export                      # 預設 PDF → ./slides-export.pdf
slidev export --format pptx        # PPTX（每頁為圖、含 presenter 備註）
slidev export --format png         # 每頁一張 PNG
slidev export --format md          # 編譯後的 markdown（內嵌 PNG）
```

常用旗標：

| 目的 | 旗標 | 範例 |
|------|------|------|
| 逐步點擊展開成多頁 | `--with-clicks` | `slidev export --with-clicks` |
| 輸出檔名 | `--output` | `slidev export --output my-talk` |
| 深色模式匯出 | `--dark` | `slidev export --dark` |
| 只匯出部分頁 | `--range` | `slidev export --range 1,6-8,10` |
| 等待逾時（大圖/字型慢） | `--timeout` | `slidev export --timeout 60000` |
| 額外等待 | `--wait` | `slidev export --wait 2000` |

- **逐步動畫（鐵則 #8）**：預設一頁一張、不含 click 步驟；要保留 v-clicks/magic-move
  的每一步，加 `--with-clicks`。PPTX 預設**開啟** `--with-clicks`，要關用
  `--with-clicks false`。
- 檔名也可在 headmatter 設 `exportFilename: my-talk`。
- 也可開 `http://localhost:<port>/export` 用瀏覽器手動匯出。

## 3. 建 SPA（線上簡報）

```bash
slidev build                       # 產出靜態 SPA 到 dist/
slidev build --base /my-deck/      # 部署在子路徑時務必設 base（GitHub Pages）
```

`dist/` 可丟任何靜態主機。互動功能（Monaco、動畫、影片）只有 SPA 保得住，PDF 會喪失；
要保留互動就部署 SPA、別只發 PDF。

## 4. Presenter 模式與每頁備註

每頁最後一個 HTML 註解區塊即該頁**講者備註**，會出現在 presenter 模式、並隨 PPTX 匯出：

```md
# 這頁的標題

投影片內容。

<!--
講者備註：這裡講 30 秒，帶到下一頁的轉折。
備註支援 **Markdown** 與 click 標記。
-->
```

開 presenter：dev 模式下開 `http://localhost:3030/presenter`（或 UI 右下角進入），
左講稿、右下一頁預覽、計時器。

## 5. 部署

- **GitHub Pages**：`slidev build --base /<repo>/`，把 `dist/` 推到 `gh-pages`
  分支或用 Actions。base 設錯資源會 404（鐵則 #7 的延伸）。
- **Netlify / Vercel**：scaffold 已附 `netlify.toml` / `vercel.json`；build 指令
  `slidev build`、發佈目錄 `dist`。
- **資源檢查**：部署後翻頁確認 `public/` 圖片、字型都載得到（絕對路徑 + 正確 base）。

## 6. 匯出前自查（鐵則 #8）

- `playwright-chromium` 在 devDependencies？（換機器/CI 能重現）
- 中文字型在匯出環境可得？翻 PDF 確認沒變方框（見 theming-style.md、pitfalls.md）。
- 需要逐步動畫 → 有加 `--with-clicks`？
- 大圖/外部 iframe 多 → 是否要加 `--timeout` / `--wait` 避免半成品。
