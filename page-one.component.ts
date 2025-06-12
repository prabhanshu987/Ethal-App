import { Component } from '@angular/core';

@Component({
  selector: 'app-page-one',
  templateUrl: './page-one.component.html'
})
export class PageOneComponent {
  formData = {
    date: '',
    supervisor: '',
    shift: '',
    crm: ''
  };
  submitted = false;

  isFormValid() {
    return this.formData.date && this.formData.supervisor && this.formData.shift && this.formData.crm;
  }

  nextPage() {
    if (this.isFormValid()) {
      sessionStorage.setItem('pageOneData', JSON.stringify(this.formData));
      window.location.href = '/page-two';
    } else {
      this.submitted = true;
    }
  }
   history(){
    window.location.href = '/history';  }
}