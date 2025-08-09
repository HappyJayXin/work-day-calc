"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ResultDialog from "./components/ResultDialog";
import { cn, formatNumber } from "@/lib/utils";
import type { TradeRecord } from "@/types/trade";
import { Github } from "lucide-react";

const STORAGE_KEY = "workdayCalc:records";

export default function HomePage() {
  const [records, setRecords] = useState<TradeRecord[]>([]);
  const [storageError, setStorageError] = useState(false);
  const [selected, setSelected] = useState<TradeRecord | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as TradeRecord[];
        parsed.sort((a, b) => b.createdAt - a.createdAt);
        setRecords(parsed);
      }
    } catch (e) {
      setStorageError(true);
    }
  }, []);

  const removeRecord = (id: string) => {
    const updated = records.filter((r) => r.id !== id);
    setRecords(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      setStorageError(true);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6">工作日換算工具</h1>
      {storageError && (
        <p className="text-red-500 text-sm text-center mb-4">
          無法存取本機儲存
        </p>
      )}
      <div className="mb-4 flex justify-center">
        <Button asChild>
          <Link href="/new">新增</Link>
        </Button>
      </div>
      {records.length === 0 ? (
        <p className="text-center text-muted-foreground">尚無紀錄</p>
      ) : (
        <ul className="space-y-4">
          {records.map((r) => (
            <li key={r.id} className="border p-4 rounded-md">
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <p className="text-sm">
                    {new Date(r.createdAt).toLocaleString("zh-TW")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    買 {r.input.buyPrice} / 賣 {r.input.sellPrice} / 股數 {r.input.shares}
                  </p>
                  <p
                    className={cn(
                      r.result.netProfit >= 0
                        ? "text-green-600"
                        : "text-red-500",
                      "text-sm"
                    )}
                  >
                    淨損益 {formatNumber(r.result.netProfit)}
                  </p>
                  <p className="text-sm">換算 {r.result.workDays} 天</p>
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelected(r)}
                  >
                    查看
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      if (confirm("確定刪除這筆紀錄？")) removeRecord(r.id);
                    }}
                  >
                    刪除
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      {selected && (
        <ResultDialog
          open={!!selected}
          onOpenChange={(open) => !open && setSelected(null)}
          result={selected.result}
          input={selected.input}
        />
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
