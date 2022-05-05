import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  validToken: any;
  summaryExecRun: any;

  constructor() {
    this.validToken = localStorage.getItem('token');
   }
}
