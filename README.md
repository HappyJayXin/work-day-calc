# work-day-calc
這是讓投資變得更生活化工具，別再說投資沒感覺，一賺錢就放假，虧錢直接加班，用血汗值看懂你的股票盈虧！

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🧠 AI Prompt 原始需求

<details>
<summary>點擊展開完整 Prompt</summary>
目標：生成一個生活化工具元件 `WorkdayCalc`，可將股票交易的盈虧金額換算為「可以少工作幾天」或「需要加班幾天補回來」。

---

扮演一位熟悉 React 18、TypeScript、Tailwind CSS 與 shadcn/ui 的前端工程師，依據以下需求撰寫完整的 `App.tsx` 檔案，所有元件集中於此檔案中，使用 arrow function 與 `useState` 管理狀態。

---

### 功能模組

1. **頁面標題與副標說明**
   * 顯示主標題與副標文字，置中並有適當間距
2. **股票交易表單**
   * 使用 shadcn/ui 元件（`Input`、`Button`、`Label`）
   * 欄位：買入價、賣出價、股數
   * 欄位為空或為 0 時，換算按鈕 disabled
   * 下方按鈕區塊含「薪資設定」與「立即換算」
3. **薪資設定 Modal**
   * 使用 Dialog 呈現
   * 提供薪資輸入（年薪、月薪、時薪三種擇一）
   * 若為時薪，可輸入每日工時（預設 8 小時）
   * 儲存後不自動計算，需再次點擊換算
4. **結果顯示 Modal**
   * 使用 Dialog 顯示
   * 顯示換算結果（正值：少工作；負值：需加班）
   * 顯示盈虧明細、費用、淨損益，正負值用不同顏色表示
   * 所有金額格式化為千分位＋兩位小數

---

### 計算邏輯
1. 將使用者輸入薪資轉為每日薪資：
   * 年薪／250、月薪 \* 12／250、時薪 \* 每日工時
2. 根據以下公式計算盈虧：
   * 買入金額、賣出金額、手續費、稅金、成本、收益、淨損益
3. 依據淨損益換算為工作天數：
   * `Math.round(Math.abs(netProfit) / dailyWage)`
4. 產出提示訊息：
   * 若為正值，顯示「你可以少工作 X 天」
   * 若為負值，顯示「你需要加班 X 天補回來」

---

### 技術規範
* 使用 shadcn/ui 搭配 Tailwind CSS 排版
* 使用 lucide-react 的圖示（Settings、Calculator）
* 按鈕樣式、位置、寬度依照規範配置
* 結果呈現正負顏色區分與格式化金額
</details>

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
