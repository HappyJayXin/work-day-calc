"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Settings } from "lucide-react";
import type { SalaryType } from "@/types/trade";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  salary: number;
  salaryType: SalaryType;
  hoursPerDay: number;
  onSalaryChange: (value: number) => void;
  onTypeChange: (value: SalaryType) => void;
  onHoursChange: (value: number) => void;
};

const SalaryDialog = ({
  open,
  onOpenChange,
  salary,
  salaryType,
  hoursPerDay,
  onSalaryChange,
  onTypeChange,
  onHoursChange,
}: Props) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-medium flex items-center justify-center gap-2">
            <Settings className="w-5 h-5" /> 薪資設定
          </DialogTitle>
          <DialogDescription className="text-center mb-4">
            請設定你的薪資資訊
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label className="mb-2 block">薪資類型</Label>
              <RadioGroup
                value={salaryType}
                onValueChange={(value: SalaryType) => onTypeChange(value)}
                className="flex space-x-4"
              >
                <Label className="flex items-center space-x-1">
                  <RadioGroupItem value="yearly" />
                  <span>年薪</span>
                </Label>
                <Label className="flex items-center space-x-1">
                  <RadioGroupItem value="monthly" />
                  <span>月薪</span>
                </Label>
                <Label className="flex items-center space-x-1">
                  <RadioGroupItem value="hourly" />
                  <span>時薪</span>
                </Label>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="salary" className="mb-2 block">
                薪資金額
              </Label>
              <Input
                id="salary"
                type="number"
                placeholder="請輸入薪資"
                value={salary}
                onChange={(e) => onSalaryChange(+e.target.value)}
              />
            </div>

            {salaryType === "hourly" && (
              <div>
                <Label htmlFor="hoursPerDay" className="mb-2 block">
                  每日工作時數
                </Label>
                <Input
                  id="hoursPerDay"
                  type="number"
                  placeholder="請輸入每日工作時數"
                  value={hoursPerDay}
                  onChange={(e) => onHoursChange(+e.target.value)}
                />
              </div>
            )}
          </div>
          <DialogFooter className="justify-end mt-4">
            <Button type="submit">儲存設定</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SalaryDialog;
