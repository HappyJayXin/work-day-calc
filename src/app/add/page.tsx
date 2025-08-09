"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import TradeForm from "../components/TradeForm";
import SalaryDialog from "../components/SalaryDialog";
import { calculateResult, formatNumber } from "@/lib/utils";
import { StorageService } from "@/lib/storage";

import type { SalaryType, Result, CalcRecord, TradeInput } from "@/types/trade";

export default function AddPage() {
  const router = useRouter();

  // Trade form
  const [buyPrice, setBuyPrice] = useState<number | "">("");
  const [sellPrice, setSellPrice] = useState<number | "">("");
  const [shares, setShares] = useState<number | "">(1000);

  // Salary settings
  const [salary, setSalary] = useState<number>(190);
  const [salaryType, setSalaryType] = useState<SalaryType>("hourly");
  const [hoursPerDay, setHoursPerDay] = useState<number>(8);

  // Modal controls
  const [isSalaryModalOpen, setIsSalaryModalOpen] = useState(false);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);

  // Calculation result
  const [result, setResult] = useState<Result | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<boolean | null>(null);

  const isInvalid = !buyPrice || !sellPrice || !shares;

  const calculate = () => {
    if (isInvalid) return;

    const res = calculateResult({
      buyPrice: buyPrice as number,
      sellPrice: sellPrice as number,
      shares: shares as number,
      salary,
      salaryType,
      hoursPerDay,
    });
    if (!res) return;

    // 保存到 localStorage
    const record: CalcRecord = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      input: {
        buyPrice: buyPrice as number,
        sellPrice: sellPrice as number,
        shares: shares as number,
        salary,
        salaryType,
        hoursPerDay,
      },
      result: res,
    };

    const saved = StorageService.saveRecord(record);
    setSaveSuccess(saved);
    setResult(res);
    setIsResultModalOpen(true);
  };

  const handleResultClose = () => {
    setIsResultModalOpen(false);
    setSaveSuccess(null);
  };

  const handleBackToHome = () => {
    router.push("/");
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBackToHome}
          className="mr-2"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-2xl font-bold">新增計算</h1>
      </div>

      <p className="text-sm text-muted-foreground text-center mb-8">
        將股票交易的盈虧金額轉換為「可以少工作幾天」或「需要加班幾天」
      </p>

      {!StorageService.isAvailable() && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
          <p className="text-sm text-amber-800">
            ⚠️ 無法存取本機儲存，計算結果將不會被保存
          </p>
        </div>
      )}

      <TradeForm
        buyPrice={buyPrice}
        sellPrice={sellPrice}
        shares={shares}
        onBuyChange={setBuyPrice}
        onSellChange={setSellPrice}
        onSharesChange={setShares}
        onCalculate={calculate}
        onOpenSalary={() => setIsSalaryModalOpen(true)}
        isInvalid={isInvalid}
      />

      <SalaryDialog
        open={isSalaryModalOpen}
        onOpenChange={setIsSalaryModalOpen}
        salary={salary}
        salaryType={salaryType}
        hoursPerDay={hoursPerDay}
        onSalaryChange={setSalary}
        onTypeChange={setSalaryType}
        onHoursChange={setHoursPerDay}
      />

      {/* Enhanced Result Dialog content */}
      {isResultModalOpen && result && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold">計算結果</h3>
            </div>

            <div className="space-y-4">
              <p
                className={`text-center font-semibold text-lg ${
                  result.netProfit >= 0 ? "text-green-600" : "text-red-500"
                }`}
              >
                {result.message}
              </p>

              <div className="space-y-1 text-sm">
                <p>原始買入金額：{formatNumber(result.buyAmount)}</p>
                <p>買入手續費：{formatNumber(result.buyFee)}</p>
                <p>賣出金額：{formatNumber(result.sellAmount)}</p>
                <p>賣出手續費：{formatNumber(result.sellFee)}</p>
                <p>交易稅金：{formatNumber(result.tax)}</p>
                <p>
                  淨盈虧：
                  <span
                    className={`font-semibold ${
                      result.netProfit >= 0 ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {formatNumber(result.netProfit)}
                  </span>
                </p>
              </div>

              <div className="space-y-3 mt-6">
                {saveSuccess === false && (
                  <p className="text-sm text-amber-600 text-center">
                    ⚠️ 結果無法保存到本機儲存
                  </p>
                )}
                {saveSuccess === true && (
                  <p className="text-sm text-green-600 text-center">
                    ✅ 結果已成功保存
                  </p>
                )}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handleResultClose}
                  >
                    繼續計算
                  </Button>
                  <Button className="flex-1" onClick={handleBackToHome}>
                    回首頁
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <a
        href="https://github.com/HappyJayXin/work-day-calc"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4 bg-black text-white rounded-full p-3 shadow-lg hover:bg-gray-800 transition-colors"
        title="View on GitHub"
      >
        <Github className="w-5 h-5" />
      </a>
    </div>
  );
}
