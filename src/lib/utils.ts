import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { SalaryType, Result } from "@/types/trade";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

export const formatNumber = (value: number): string => {
  return `${new Intl.NumberFormat("zh-TW", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)} 元`;
};

export const calculateResult = (params: {
  buyPrice: number;
  sellPrice: number;
  shares: number;
  salary: number;
  salaryType: SalaryType;
  hoursPerDay: number;
}): Result | null => {
  const { buyPrice, sellPrice, shares, salary, salaryType, hoursPerDay } = params;

  if (!buyPrice || !sellPrice || !shares || salary <= 0) return null;

  const buyAmount = buyPrice * shares;
  const sellAmount = sellPrice * shares;
  const buyFee = buyAmount * 0.001425;
  const sellFee = sellAmount * 0.001425;
  const tax = sellAmount * 0.003;
  const cost = buyAmount + buyFee;
  const revenue = sellAmount - sellFee - tax;
  const netProfit = revenue - cost;

  const dailyWage =
    salaryType === "yearly"
      ? salary / 250
      : salaryType === "monthly"
      ? (salary * 12) / 250
      : salary * hoursPerDay;

  if (dailyWage === 0) return null;

  const workDays = Math.round(Math.abs(netProfit) / dailyWage);
  const message =
    netProfit >= 0
      ? `🎉 你可以少工作 ${workDays} 天`
      : `😅 你需要加班 ${workDays} 天補回來`;

  return {
    message,
    buyAmount,
    buyFee,
    sellAmount,
    sellFee,
    tax,
    cost,
    revenue,
    netProfit,
  };
};
