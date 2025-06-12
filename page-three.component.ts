import { Component, ViewChild, ElementRef } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-three',
  templateUrl: './page-three.component.html'
})
export class PageThreeComponent {
  pageOneData: any = {};
  pageTwoData: any = {};
  passScheduleData: any[] = [];

  @ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef;

  selectedRow: any = null;
  showModal: boolean = false;

  circleDia: string = '';
  circleTh: string = '';
  sheetW: string = '';
  sheetL: string = '';
  sheetTh: string = '';

  constructor(private router: Router) {}

  ngOnInit() {
    this.pageOneData = JSON.parse(sessionStorage.getItem('pageOneData') || '{}');
    this.pageTwoData = JSON.parse(sessionStorage.getItem('pageTwoData') || '{}');
    this.passScheduleData = JSON.parse(sessionStorage.getItem('passScheduleData') || '[]');

    // Assign input values from pageTwoData
    this.circleDia = this.pageTwoData.circleDia || '';
    this.circleTh = this.pageTwoData.circleTh || '';
    this.sheetW = this.pageTwoData.initialWidth || '';
    this.sheetL = this.pageTwoData.initialLength || '';
    this.sheetTh = this.pageTwoData.initialThickness || '';
  }

generatePDF() {
  const content = this.pdfContent.nativeElement;

  // Temporarily force desktop layout
  content.classList.add('desktop-print-mode');

  setTimeout(() => {
    html2canvas(content, {
      scale: 2, // for better resolution
      useCORS: true,
      scrollX: 0,
      scrollY: -window.scrollY,
      windowWidth: 1024 // emulate desktop width
    }).then(canvas => {
    const imgData = canvas.toDataURL('image/jpeg', 0.7); // Use JPEG + 70% quality
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
      heightLeft -= pdf.internal.pageSize.getHeight();

      while (heightLeft > 0) {
        position -= imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();
      }

      // Revert to normal view after PDF generation
      content.classList.remove('desktop-print-mode');

      pdf.save('pass-schedule-summary.pdf');
      this.saveToHistory();
    });
  }, 100);
}
  saveToHistory() {
    const passesOnly = Array.from({ length: 15 }, (_, i) => this.passScheduleData[i]?.thickness || '');

    const newEntry = {
      date: this.pageOneData.date,
      supervisor: this.pageOneData.supervisor,
      shift: this.pageOneData.shift,
      crm: this.pageOneData.crm,
      ingot: this.pageTwoData.ingot,
      lotNo: this.pageTwoData.lotNo,
      potLid: this.pageTwoData.potLid,
      circleDia: this.circleDia,
      circleTh: this.circleTh,
      sheetW: this.sheetW,
      sheetL: this.sheetL,
      sheetTh: this.sheetTh,
      passes: passesOnly
    };

    const history = JSON.parse(localStorage.getItem('crmHistory') || '[]');
    history.push(newEntry);
    localStorage.setItem('crmHistory', JSON.stringify(history));

    this.router.navigate(['/history']);
  }

  openModal(row: any): void {
    this.selectedRow = row;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  exportToExcel(){
    this.router.navigate(['/history'])
  }
}