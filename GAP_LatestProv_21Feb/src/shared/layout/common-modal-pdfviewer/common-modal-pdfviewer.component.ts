import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-common-modal-pdfviewer',
  templateUrl: './common-modal-pdfviewer.component.html',
  styleUrls: ['./common-modal-pdfviewer.component.scss']
})
export class CommonModalPdfviewerComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public pdfData: any) { }
  // pdfSrc = "assets/docs/How to Create Model Object for ML Works.pdf";
  pdfSrc = this.pdfData.pdfsrc;
  header = this.pdfData.header;
  ngOnInit(): void {

  }

}
