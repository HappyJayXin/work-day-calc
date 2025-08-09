export type SalaryType = "yearly" | "monthly" | "hourly";

export type Result = {
  message: string;
  buyAmount: number;
  buyFee: number;
  sellAmount: number;
  sellFee: number;
  tax: number;
  cost: number;
  revenue: number;
  netProfit: number;
};

export type TradeInput = {
  buyPrice: number;
  sellPrice: number;
  shares: number;
  salary: number;
  salaryType: SalaryType;
  hoursPerDay: number;
};

export type CalcRecord = {
  id: string;
  createdAt: string;
  input: TradeInput;
  result: Result;
};
