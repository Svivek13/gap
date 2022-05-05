import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';

export enum KEY_CODE {
  RIGHT_ARROW = 39,
  LEFT_ARROW = 37
}

@Component({
  selector: 'app-chart-paginator',
  templateUrl: './chart-paginator.component.html',
  styleUrls: ['./chart-paginator.component.scss']
})
export class ChartPaginatorComponent implements OnInit {
  startIndex = 1;
  lastIndex = 10;
  @Input() totalLength: any;
  @Input() modelName: any;
  @Input() personaType: any;
  disablePrev = true;
  disableNext: boolean;
  @Output() prevClickEvent = new EventEmitter<any>();
  @Output() nextClickEvent = new EventEmitter<any>();
  firstN = 0;
  lastN = this.firstN + 10;
  pageSize = 10;
  disableSkipLast: boolean;
  disableSkipFirst = true;

  constructor() { }

  ngOnInit(): void {
   // console.log(this.modelName,this.personaType);
    if (this.modelName == 'Direct_Mail' || this.personaType == 'completeness') {
      this.startIndex = 1;
      this.lastIndex = 5;
      this.lastN = this.firstN + 5;
      this.pageSize = 5;
    }
    if (this.lastN === this.totalLength || this.lastN > this.totalLength) {
      this.disableNext = true;
      this.disableSkipLast = true;
    } else {
      this.disableNext = false;
    }
  }

  showPrevValues() {
    this.disableNext = false;
    this.disableSkipLast = false;
    this.firstN = this.firstN - this.pageSize;
    if (this.modelName == 'Direct_Mail' || this.personaType == 'completeness') {
      this.lastN = Math.ceil((this.lastN - this.pageSize) / 5) * 5;
    } else {
      this.lastN = Math.ceil((this.lastN - this.pageSize) / 10) * 10;
    }
    this.startIndex = this.firstN + 1;
    this.lastIndex = this.startIndex + this.pageSize - 1;
    if (this.firstN < this.pageSize) {
      this.disablePrev = true;
      this.disableSkipFirst = true;
    } else {
      this.disablePrev = false;
      this.disableSkipFirst = false;
    }
    this.prevClickEvent.emit({ first: this.firstN, last: this.lastN });
  }

  showNextValues() {
    this.disablePrev = false;
    this.disableSkipLast = false;
    this.disableSkipFirst = false;
    this.firstN = this.firstN + this.pageSize;
    this.lastN = this.lastN + this.pageSize;
    this.startIndex = this.firstN + 1;
    this.lastIndex = Math.min(this.lastN, this.totalLength);
    if (this.lastN === this.totalLength || this.lastN > this.totalLength) {
      this.disableNext = true;
      this.disableSkipLast = true;
    } else {
      this.disableNext = false;
      this.disableSkipLast = false;
    }
    this.nextClickEvent.emit({ first: this.firstN, last: this.lastN });
  }

  skipToFirst() {
    this.disableSkipFirst = true;
    this.disablePrev = true;
    this.disableNext = false;
    this.disableSkipLast = false;
    if (this.modelName == 'Direct_Mail' || this.personaType == 'completeness') {
      this.firstN = 0;
      this.lastN = 5;
    } else {
      this.firstN = 0;
      this.lastN = 10;
    }

    this.startIndex = this.firstN + 1;
    this.lastIndex = this.startIndex + this.pageSize - 1;
    this.prevClickEvent.emit({ first: this.firstN, last: this.lastN });
  }

  skipToLast() {
    this.disableSkipLast = true;
    this.disableSkipFirst = false;
    this.disableNext = true;
    this.disablePrev = false;
    this.lastN = this.totalLength;
    if (this.modelName == 'Direct_Mail' || this.personaType == 'completeness') {
      this.firstN = Math.floor(this.lastN / 5) * 5;
    } else {
      this.firstN = Math.floor(this.lastN / 10) * 10;
    }
  //  console.log(this.lastIndex,this.startIndex,this.firstN);
    this.lastIndex = this.lastN;
    this.startIndex = this.firstN + 1;
    this.nextClickEvent.emit({ first: this.firstN, last: this.lastN });
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.key === 'ArrowRight' && this.lastN < this.totalLength) {
      this.showNextValues();
    }
    if (event.key === 'ArrowLeft' && this.firstN > 0) {
      this.showPrevValues();
    }
  }

}
