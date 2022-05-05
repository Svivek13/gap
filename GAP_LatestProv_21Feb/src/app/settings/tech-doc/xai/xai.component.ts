import { Component, OnInit } from '@angular/core';
import { MlopsService } from '../../../mlops.service';
import { CONSTANTS } from '../../../helpers/constant';
import { get as _get } from 'lodash';

@Component({
  selector: 'app-xai',
  templateUrl: './xai.component.html',
  styleUrls: ['./xai.component.scss'],
})
export class XaiComponent implements OnInit {
  loader: boolean;
  // pdfSrc = "assets/docs/ML Works - XAI Documentation.pdf";
  pdfSrc: string;
  constructor(private mlopsService: MlopsService) {}

  ngOnInit(): void {
    this.openPDF('explainability');
  }

  openPDF(pdfType) {
    const body = { name: _get(CONSTANTS, `pdfType.${pdfType}.name`) };
    this.loader = true;
    this.mlopsService.getMetaFile(body).subscribe(
      (res) => {
        this.loader = false;
        // console.log(res, 'file res');
        const dataType = res.type;
        const binaryData = [];
        binaryData.push(res);

        const fileUrl = window.URL.createObjectURL(
          new Blob(binaryData, { type: dataType })
        );
        this.pdfSrc = fileUrl;
      },
      (err) => {
        this.loader = false;
        console.log(err);
      }
    );
  }
}
