// history.component.ts
import { Component } from '@angular/core';
import { HistoryEntry } from '../history.model';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent {
  historyData: HistoryEntry[] = [];
  searchTerm = '';
  data: any

  ngOnInit() {
    const stored = localStorage.getItem('crmHistory');
    this.historyData = stored ? JSON.parse(stored) : [];
    console.log('✅ Loaded historyData:', this.historyData);
  }

  normalizePassData(passData: any[]): any[] {
    const result = [];
    for (let i = 0; i < 15; i++) {
      result.push(passData[i] ? passData[i].thickness || '' : '');
    }
    return result;
  }

 filteredData(): any[] {
      console.log("qwe",this.historyData)

    return this.historyData.filter(row =>
      row.supervisor?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      row.date?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

exportToExcel(): void {
  const formattedData = this.historyData.map(entry => {
    const passColumns: { [key: string]: string } = {};

    for (let i = 0; i < 15; i++) {
      passColumns[`P-${i + 1} mm`] = entry.passes?.[i] || '';
    }

    return {
      Date: new Date(entry.date).toLocaleDateString('en-GB'), // Format: dd/mm/yyyy
      Supervisor: entry.supervisor,
      CRM: entry.crm,
      Ingot: entry.ingot,
      LotNo: entry.lotNo,
      'Pot/Lid': entry.potLid,
      'Circle Dia': entry.circleDia,
      'Circle Th': entry.circleTh,
      'Sheet W': entry.sheetW,
      'Sheet L': entry.sheetL,
      'Sheet Th': entry.sheetTh,
      ...passColumns
    };
  });

  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'CRM Summary');

  const excelBuffer: any = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array'
  });

  const fileName = `ColdRollingSummary_${new Date().toISOString().slice(0, 10)}.xlsx`;
  this.saveAsExcelFile(excelBuffer, fileName);
}

private saveAsExcelFile(buffer: any, fileName: string): void {
  const data: Blob = new Blob([buffer], {
    type:
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
  });
  FileSaver.saveAs(data, fileName);
}
}