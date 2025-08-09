"use client";

import { useEffect, useState } from "react";
import { Github } from "lucide-react";
import TradeForm from "../components/TradeForm";
import SalaryDialog from "../components/SalaryDialog";
import ResultDialog from "../components/ResultDialog";
import { calculateResult } from "@/lib/utils";
import { useRouter } from "next/navigation";

import type {
  SalaryType,
  Result,
  TradeInput,
  TradeRecord,
} from "@/types/trade";

const STORAGE_KEY = "workdayCalc:records";

export default function App() {
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

  const [storageError, setStorageError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    try {
      localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      setStorageError(true);
    }
  }, []);

  const isInvalid = !buyPrice || !sellPrice || !shares;

  const saveRecord = (input: TradeInput, res: Result) => {
    if (storageError) return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const records: TradeRecord[] = raw ? JSON.parse(raw) : [];
      const newRecord: TradeRecord = {
        id:
          typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : Date.now().toString(),
        createdAt: Date.now(),
        input,
        result: res,
      };
      records.unshift(newRecord);
      if (records.length > 100) records.pop();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    } catch (e) {
      setStorageError(true);
    }
  };

  const calculate = () => {
    if (isInvalid) return;

    const input: TradeInput = {
      buyPrice: buyPrice as number,
      sellPrice: sellPrice as number,
      shares: shares as number,
      salary,
      salaryType,
      hoursPerDay,
    };

    const res = calculateResult(input);
    if (!res) return;

    saveRecord(input, res);

    setResult(res);
    setIsResultModalOpen(true);
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6">新增計算</h1>
      {storageError && (
        <p className="text-red-500 text-sm text-center mb-4">
          無法存取本機儲存，此次結果不會被保存
        </p>
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

      <ResultDialog
        open={isResultModalOpen}
        onOpenChange={setIsResultModalOpen}
        result={result}
        input={{
          buyPrice: buyPrice as number,
          sellPrice: sellPrice as number,
          shares: shares as number,
          salary,
          salaryType,
          hoursPerDay,
        }}
        onGoHome={() => router.push("/")}
      />

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
