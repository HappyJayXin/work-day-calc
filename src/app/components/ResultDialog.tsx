"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calculator } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Result, TradeInput } from "@/types/trade";
import { formatNumber } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  result: Result | null;
  input?: TradeInput;
  onGoHome?: () => void;
};

const ResultDialog = ({ open, onOpenChange, result, input, onGoHome }: Props) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-medium flex items-center justify-center gap-2">
            <Calculator className="w-5 h-5" /> 計算結果
          </DialogTitle>
        </DialogHeader>
        {result && (
          <div className="space-y-4 p-4">
            <p
              className={cn(
                "text-center font-semibold text-lg",
                result.netProfit >= 0 ? "text-green-600" : "text-red-500",
              )}
            >
              {result.message}
            </p>
            <div className="space-y-1 text-sm">
              <p>原始買入金額：{formatNumber(result.buyAmount)}</p>
              <p>買入手續費：{formatNumber(result.buyFee)}</p>
              <p>
                賣出金額：
                <span
                  className={cn(
                    result.netProfit >= 0 ? "text-green-600" : "text-red-500",
                  )}
                >
                  {formatNumber(result.sellAmount)}
                </span>
              </p>
              <p>賣出手續費：{formatNumber(result.sellFee)}</p>
              <p>交易稅金：{formatNumber(result.tax)}</p>
              <p>成本：{formatNumber(result.cost)}</p>
              <p>收益：{formatNumber(result.revenue)}</p>
              <p>
                淨盈虧：
                <span
                  className={cn(
                    result.netProfit >= 0 ? "text-green-600" : "text-red-500",
                    "font-semibold",
                  )}
                >
                  {formatNumber(result.netProfit)}
                </span>
              </p>
              <p>換算工作天數：{result.workDays} 天</p>
            </div>

            {input && (
              <div className="space-y-1 pt-2 border-t text-sm">
                <p>
                  薪資類型：
                  {input.salaryType === "yearly"
                    ? "年薪"
                    : input.salaryType === "monthly"
                      ? "月薪"
                      : "時薪"}
                </p>
                <p>薪資：{formatNumber(input.salary)}</p>
                {input.salaryType === "hourly" && (
                  <p>每日工時：{input.hoursPerDay} 小時</p>
                )}
              </div>
            )}

            {onGoHome && (
              <div className="pt-4 flex justify-center">
                <Button onClick={onGoHome}>回首頁</Button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ResultDialog;
