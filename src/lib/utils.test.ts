import { describe, it, expect } from "vitest";
import { calculateResult } from "./utils";

const base = {
  buyPrice: 10,
  sellPrice: 20,
  shares: 1000,
  hoursPerDay: 8,
};

describe("calculateResult", () => {
  it("handles yearly salary with profit", () => {
    const result = calculateResult({
      ...base,
      salary: 720000,
      salaryType: "yearly",
    });
    expect(result?.message).toBe("🎉 你可以少工作 3 天");
    expect(result?.netProfit).toBeGreaterThan(0);
    expect(result?.workDays).toBe(3);
  });

  it("handles yearly salary with loss", () => {
    const result = calculateResult({
      ...base,
      buyPrice: 20,
      sellPrice: 10,
      salary: 720000,
      salaryType: "yearly",
    });
    expect(result?.message).toBe("😅 你需要加班 3 天補回來");
    expect(result?.netProfit).toBeLessThan(0);
    expect(result?.workDays).toBe(3);
  });

  it("handles monthly salary with profit", () => {
    const result = calculateResult({
      ...base,
      salary: 30000,
      salaryType: "monthly",
    });
    expect(result?.message).toBe("🎉 你可以少工作 7 天");
    expect(result?.netProfit).toBeGreaterThan(0);
    expect(result?.workDays).toBe(7);
  });

  it("handles monthly salary with loss", () => {
    const result = calculateResult({
      ...base,
      buyPrice: 20,
      sellPrice: 10,
      salary: 30000,
      salaryType: "monthly",
    });
    expect(result?.message).toBe("😅 你需要加班 7 天補回來");
    expect(result?.netProfit).toBeLessThan(0);
    expect(result?.workDays).toBe(7);
  });

  it("handles hourly salary with profit", () => {
    const result = calculateResult({
      ...base,
      salary: 1000,
      salaryType: "hourly",
    });
    expect(result?.message).toBe("🎉 你可以少工作 1 天");
    expect(result?.netProfit).toBeGreaterThan(0);
    expect(result?.workDays).toBe(1);
  });

  it("handles hourly salary with loss", () => {
    const result = calculateResult({
      ...base,
      buyPrice: 20,
      sellPrice: 10,
      salary: 1000,
      salaryType: "hourly",
    });
    expect(result?.message).toBe("😅 你需要加班 1 天補回來");
    expect(result?.netProfit).toBeLessThan(0);
    expect(result?.workDays).toBe(1);
  });
});
