# PATH — 食記與旅記網站

一個以 [Astro](https://astro.build) 為核心的靜態內容網站，整合 [Decap CMS](https://decapcms.org/) 讓你可以**直接在瀏覽器發文，不需要碰任何程式碼**。

---

## 🚀 部署步驟（給非工程師的完整指南）

### 第一步：把專案推上 GitHub

1. 前往 [github.com](https://github.com) 建立新的 Repository（名稱例如 `path-site`）
2. 在你的電腦終端機執行：
   ```bash
   cd /Users/brandon/Desktop/project/PATH
   git init
   git add .
   git commit -m "initial commit"
   git remote add origin https://github.com/你的帳號/path-site.git
   git push -u origin main
   ```

---

### 第二步：連接 Vercel 並部署

1. 前往 [vercel.com](https://vercel.com) 並用 GitHub 帳號登入
2. 點「Add New Project」→ 選擇你剛剛建立的 `path-site` Repository
3. Vercel 會自動偵測到 `vercel.json`，確認設定如下：
   - Build Command：`npm run build`
   - Output Directory：`dist`
4. 點「Deploy」→ 等待部署完成（通常 1–2 分鐘）
5. 部署成功後，記下你的 Vercel 網址（格式類似 `https://path-site-abc123.vercel.app`）

---

### 第三步：設定 GitHub OAuth App（讓 CMS 可以登入）

> 這個步驟只需要做一次，設定完成後你就可以永久在 `/admin/` 頁面發文。

1. 前往 GitHub → 右上角頭像 → **Settings** → 左側 **Developer settings** → **OAuth Apps** → **New OAuth App**

2. 填入以下資料：
   - **Application name**：PATH CMS
   - **Homepage URL**：`https://你的-vercel-網址.vercel.app`（第二步記下的網址）
   - **Authorization callback URL**：`https://你的-vercel-網址.vercel.app/api/auth`

3. 點「Register application」後，你會看到：
   - **Client ID**（複製起來）
   - 點「Generate a new client secret」→ **Client Secret**（立刻複製，只顯示一次）

4. 前往 Vercel Dashboard → 你的專案 → **Settings** → **Environment Variables**，新增：
   - `GITHUB_CLIENT_ID` = 你剛複製的 Client ID
   - `GITHUB_CLIENT_SECRET` = 你剛複製的 Client Secret

5. 回到 Vercel → **Deployments** → 點「Redeploy」讓環境變數生效

---

### 第四步：更新 CMS 設定檔

用任何文字編輯器（或直接在 GitHub 網頁上）編輯 `public/admin/config.yml`，找到這兩行並替換：

```yaml
# 改成你的 GitHub 帳號/repo名稱，例如：
repo: 你的帳號/path-site

# 改成你的 Vercel 網址（不含結尾的 /），例如：
base_url: https://path-site-abc123.vercel.app
```

存檔後 commit & push，Vercel 會自動重新部署。

---

### 第五步：購買網域後的設定

1. 購買網域後，前往 Vercel → 你的專案 → **Settings** → **Domains** → 輸入你的網域
2. 依照 Vercel 指示，到你的網域商（GoDaddy、Cloudflare 等）設定 DNS 記錄
3. 同時更新這兩個地方的網域：
   - `astro.config.mjs` 第 5 行的 `site` 欄位
   - `public/robots.txt` 最後一行的 Sitemap URL

---

### 第六步：提交 Sitemap 給 Google

1. 前往 [Google Search Console](https://search.google.com/search-console)
2. 新增你的網域並完成驗證（Vercel 有提供一鍵 DNS 驗證）
3. 左側選「Sitemap」→ 輸入 `sitemap-index.xml` → 提交

---

## ✍️ 日常發文方式

部署完成後，你只需要：

1. 前往 `https://你的網域/admin/`
2. 用 GitHub 帳號登入
3. 點「食記文章」→「新增」
4. 填寫表單：標題、摘要、關鍵字、封面圖片、文章內容
5. 點「發布」→ 文章自動上線（Vercel 會在 1–2 分鐘內重新部署）

---

## 📁 專案結構說明

```
PATH/
├── src/
│   ├── content/
│   │   ├── config.ts          ← 文章欄位定義（schema）
│   │   └── eats/
│   │       └── puli/          ← 埔里食記文章（.md 檔案）
│   ├── layouts/
│   │   └── BaseLayout.astro   ← 所有頁面共用的 SEO layout
│   └── pages/
│       ├── index.astro        ← 首頁
│       └── eats/
│           └── [city]/
│               ├── index.astro     ← 城市列表頁（/eats/puli/）
│               └── [...slug].astro ← 單篇文章頁
├── public/
│   ├── admin/
│   │   ├── index.html         ← CMS 管理後台入口
│   │   └── config.yml         ← CMS 欄位與後端設定 ← 你需要更新這個
│   ├── images/eats/puli/      ← 上傳的圖片會存到這裡
│   ├── styles/global.css      ← 全域 CSS（設計師的 token 替換在這裡）
│   └── robots.txt
├── api/
│   └── auth.js                ← GitHub OAuth Proxy（Vercel Serverless Function）
├── astro.config.mjs           ← 網站網址設定（TODO 換成真實網域）
└── vercel.json                ← Vercel 部署設定
```

---

## 🔮 未來擴充（已預留架構）

新增城市：只需在 `src/content/eats/` 下建立新資料夾（例如 `taizhong/`），URL 和列表頁會自動生成，**不需修改任何程式碼**。

新增 vertical（旅記 `/trip/`）：建立 `src/content/trip/` collection，並新增對應頁面。
