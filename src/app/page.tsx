'use client';

import { useState } from 'react';
import { Github } from 'lucide-react';
import TradeForm from './components/TradeForm';
import SalaryDialog from './components/SalaryDialog';
import ResultDialog from './components/ResultDialog';
import { calculateResult } from '@/lib/utils';

import type { SalaryType, Result } from '@/types/trade';

export default function App() {
  // Trade form
  const [buyPrice, setBuyPrice] = useState<number | ''>('');
  const [sellPrice, setSellPrice] = useState<number | ''>('');
  const [shares, setShares] = useState<number | ''>(1000);

  // Salary settings
  const [salary, setSalary] = useState<number>(190);
  const [salaryType, setSalaryType] = useState<SalaryType>('hourly');
  const [hoursPerDay, setHoursPerDay] = useState<number>(8);

  // Modal controls
  const [isSalaryModalOpen, setIsSalaryModalOpen] = useState(false);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);

  // Calculation result
  const [result, setResult] = useState<Result | null>(null);

  const isInvalid = !buyPrice || !sellPrice || !shares;

  const calculate = () => {
    if (isInvalid) return;

    const res = calculateResult({ buyPrice, sellPrice, shares, salary, salaryType, hoursPerDay });
    if (!res) return;

    setResult(res);
    setIsResultModalOpen(true);
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6">工作日換算工具</h1>
      <p className="text-sm text-muted-foreground text-center mb-8">
        將股票交易的盈虧金額轉換為「可以少工作幾天」或「需要加班幾天」
      </p>

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

      <ResultDialog open={isResultModalOpen} onOpenChange={setIsResultModalOpen} result={result} />

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
