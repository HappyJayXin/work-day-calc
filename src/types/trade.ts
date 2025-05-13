export type SalaryType = 'yearly' | 'monthly' | 'hourly';

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
