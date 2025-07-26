"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Settings, Calculator } from "lucide-react";

type TradeFormProps = {
  buyPrice: number | "";
  sellPrice: number | "";
  shares: number | "";
  onBuyChange: (value: number | "") => void;
  onSellChange: (value: number | "") => void;
  onSharesChange: (value: number | "") => void;
  onCalculate: () => void;
  onOpenSalary: () => void;
  isInvalid: boolean;
};

const TradeForm = ({
  buyPrice,
  sellPrice,
  shares,
  onBuyChange,
  onSellChange,
  onSharesChange,
  onCalculate,
  onOpenSalary,
  isInvalid,
}: TradeFormProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="buyPrice" className="mb-2 block">
          買入價格
        </Label>
        <Input
          id="buyPrice"
          type="number"
          placeholder="請輸入每股買入價"
          value={buyPrice}
          onChange={(e) =>
            onBuyChange(e.target.value === "" ? "" : +e.target.value)
          }
        />
      </div>

      <div>
        <Label htmlFor="sellPrice" className="mb-2 block">
          賣出價格
        </Label>
        <Input
          id="sellPrice"
          type="number"
          placeholder="請輸入每股賣出價"
          value={sellPrice}
          onChange={(e) =>
            onSellChange(e.target.value === "" ? "" : +e.target.value)
          }
        />
      </div>

      <div>
        <Label htmlFor="shares" className="mb-2 block">
          股數
        </Label>
        <Input
          id="shares"
          type="number"
          placeholder="請輸入股數"
          value={shares}
          onChange={(e) =>
            onSharesChange(e.target.value === "" ? "" : +e.target.value)
          }
        />
      </div>

      <div className="space-y-2 mt-6">
        <Button className="w-full" variant="outline" onClick={onOpenSalary}>
          <Settings className="w-4 h-4 mr-2" /> 薪資設定
        </Button>
        <Button className="w-full" disabled={isInvalid} onClick={onCalculate}>
          <Calculator className="w-5 h-5 mr-2" /> 立即換算成工作日數
        </Button>
      </div>
    </div>
  );
};

export default TradeForm;
