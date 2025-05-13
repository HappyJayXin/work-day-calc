'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calculator } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Result } from '@/types/trade';
import { formatNumber } from '@/lib/utils';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  result: Result | null;
};

const ResultDialog = ({ open, onOpenChange, result }: Props) => {
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
                'text-center font-semibold text-lg',
                result.netProfit >= 0 ? 'text-green-600' : 'text-red-500'
              )}
            >
              {result.message}
            </p>
            <div className="space-y-1">
              <p>原始買入金額：{formatNumber(result.buyAmount)}</p>
              <p>買入手續費：{formatNumber(result.buyFee)}</p>
              <p>
                賣出金額：
                <span className={cn(result.netProfit >= 0 ? 'text-green-600' : 'text-red-500')}>
                  {formatNumber(result.sellAmount)}
                </span>
              </p>
              <p>
                賣出手續費：
                <span>{formatNumber(result.sellFee)}</span>
              </p>
              <p>
                交易稅金：
                <span>{formatNumber(result.tax)}</span>
              </p>
              <p>
                淨盈虧：
                <span
                  className={cn(
                    result.netProfit >= 0 ? 'text-green-600' : 'text-red-500',
                    'font-semibold'
                  )}
                >
                  {formatNumber(result.netProfit)}
                </span>
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ResultDialog;
