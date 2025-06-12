export interface PassData {
  passNo: number;
  width: string;
  length: string;
  thickness: string;
  reduction: string;
  reductionPercent: string;
}

export interface HistoryEntry {
  date: string;
  supervisor: string;
  shift: string;
  crm: string;
  ingot: string;
  lotNo: string;
  potLid: string;
  circleDia: number;
  circleTh: number;
  sheetW: string;
  sheetL: string;
  sheetTh: string;
  passes: string[];  // ✅ Add this line
}