"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Github, Eye, Trash2, Calculator } from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";
import { StorageService } from "@/lib/storage";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type { CalcRecord } from "@/types/trade";

export default function HomePage() {
  const router = useRouter();
  const [records, setRecords] = useState<CalcRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<CalcRecord | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<CalcRecord | null>(null);
  const [storageError, setStorageError] = useState(false);

  useEffect(() => {
    if (!StorageService.isAvailable()) {
      setStorageError(true);
      return;
    }

    const loadRecords = () => {
      const loadedRecords = StorageService.getRecords();
      setRecords(loadedRecords);
    };

    loadRecords();

    // 監聽 storage 變化
    const handleStorageChange = () => {
      loadRecords();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleAddNew = () => {
    router.push("/add");
  };

  const handleViewDetail = (record: CalcRecord) => {
    setSelectedRecord(record);
    setIsDetailModalOpen(true);
  };

  const handleDeleteClick = (record: CalcRecord) => {
    setRecordToDelete(record);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (recordToDelete) {
      StorageService.deleteRecord(recordToDelete.id);
      setRecords((prev) => prev.filter((r) => r.id !== recordToDelete.id));
      setRecordToDelete(null);
    }
    setIsDeleteConfirmOpen(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("zh-TW", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getWorkDays = (record: CalcRecord) => {
    const { netProfit } = record.result;
    const { salary, salaryType, hoursPerDay } = record.input;

    const dailyWage =
      salaryType === "yearly"
        ? salary / 250
        : salaryType === "monthly"
          ? (salary * 12) / 250
          : salary * hoursPerDay;

    return Math.round(Math.abs(netProfit) / dailyWage);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">工作日換算工具</h1>
        <Button onClick={handleAddNew}>
          <Plus className="w-4 h-4 mr-2" />
          新增
        </Button>
      </div>

      {storageError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">
            ⚠️ 無法存取本機儲存，部分功能可能無法正常使用
          </p>
        </div>
      )}

      {records.length === 0 ? (
        <div className="text-center py-12">
          <Calculator className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">尚無紀錄</h3>
        </div>
      ) : (
        <div className="space-y-3">
          {records.map((record) => (
            <div
              key={record.id}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-gray-500">
                      {formatDate(record.createdAt)}
                    </span>
                  </div>

                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">買入/賣出/股數:</span>
                      <span>
                        {record.input.buyPrice} → {record.input.sellPrice} ×{" "}
                        {record.input.shares}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">淨損益:</span>
                      <span
                        className={cn(
                          "font-semibold",
                          record.result.netProfit >= 0
                            ? "text-green-600"
                            : "text-red-500",
                        )}
                      >
                        {formatNumber(record.result.netProfit)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">換算工作天數:</span>
                      <span className="font-medium">
                        {record.result.netProfit >= 0 ? "少工作" : "加班"}{" "}
                        {getWorkDays(record)} 天
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleViewDetail(record)}
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    查看
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteClick(record)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              計算詳情
            </DialogTitle>
          </DialogHeader>
          {selectedRecord && (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-2">
                  {formatDate(selectedRecord.createdAt)}
                </p>
                <p
                  className={cn(
                    "font-semibold text-lg",
                    selectedRecord.result.netProfit >= 0
                      ? "text-green-600"
                      : "text-red-500",
                  )}
                >
                  {selectedRecord.result.message}
                </p>
              </div>

              <div className="space-y-2 text-sm">
                <div className="bg-gray-50 p-3 rounded">
                  <h4 className="font-medium mb-2">交易參數</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>買入價格:</span>
                      <span>{selectedRecord.input.buyPrice} 元</span>
                    </div>
                    <div className="flex justify-between">
                      <span>賣出價格:</span>
                      <span>{selectedRecord.input.sellPrice} 元</span>
                    </div>
                    <div className="flex justify-between">
                      <span>股數:</span>
                      <span>
                        {selectedRecord.input.shares.toLocaleString()} 股
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded">
                  <h4 className="font-medium mb-2">薪資設定</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>薪資類型:</span>
                      <span>
                        {selectedRecord.input.salaryType === "yearly"
                          ? "年薪"
                          : selectedRecord.input.salaryType === "monthly"
                            ? "月薪"
                            : "時薪"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>薪資金額:</span>
                      <span>
                        {selectedRecord.input.salary.toLocaleString()} 元
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>每日工時:</span>
                      <span>{selectedRecord.input.hoursPerDay} 小時</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-3 rounded">
                  <h4 className="font-medium mb-2">計算結果</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>買入金額:</span>
                      <span>
                        {formatNumber(selectedRecord.result.buyAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>買入手續費:</span>
                      <span>{formatNumber(selectedRecord.result.buyFee)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>賣出金額:</span>
                      <span>
                        {formatNumber(selectedRecord.result.sellAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>賣出手續費:</span>
                      <span>{formatNumber(selectedRecord.result.sellFee)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>交易稅金:</span>
                      <span>{formatNumber(selectedRecord.result.tax)}</span>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between font-semibold">
                      <span>淨損益:</span>
                      <span
                        className={
                          selectedRecord.result.netProfit >= 0
                            ? "text-green-600"
                            : "text-red-500"
                        }
                      >
                        {formatNumber(selectedRecord.result.netProfit)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>確認刪除</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              確定要刪除這筆計算紀錄嗎？此操作無法復原。
            </p>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setIsDeleteConfirmOpen(false)}
              >
                取消
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                刪除
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
