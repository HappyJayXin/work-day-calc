import type { CalcRecord } from "@/types/trade";

const STORAGE_KEY = "workdayCalc:records";
const MAX_RECORDS = 100;

export class StorageService {
  private static isStorageAvailable(): boolean {
    try {
      const test = "__storage_test__";
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  static getRecords(): CalcRecord[] {
    if (!this.isStorageAvailable()) {
      console.warn("localStorage is not available");
      return [];
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];

      const records = JSON.parse(stored) as CalcRecord[];
      return records.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
      console.error("Failed to load records from localStorage:", error);
      return [];
    }
  }

  static saveRecord(record: CalcRecord): boolean {
    if (!this.isStorageAvailable()) {
      console.warn("localStorage is not available - record will not be saved");
      return false;
    }

    try {
      const records = this.getRecords();
      records.unshift(record);

      if (records.length > MAX_RECORDS) {
        records.splice(MAX_RECORDS);
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
      return true;
    } catch (error) {
      console.error("Failed to save record to localStorage:", error);
      return false;
    }
  }

  static deleteRecord(id: string): boolean {
    if (!this.isStorageAvailable()) {
      return false;
    }

    try {
      const records = this.getRecords();
      const filteredRecords = records.filter(record => record.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredRecords));
      return true;
    } catch (error) {
      console.error("Failed to delete record from localStorage:", error);
      return false;
    }
  }

  static isAvailable(): boolean {
    return this.isStorageAvailable();
  }
}
