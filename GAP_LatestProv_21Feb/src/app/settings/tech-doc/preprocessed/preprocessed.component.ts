import { Component, OnInit } from '@angular/core';
import { MlopsService } from '../../../mlops.service';
import { CONSTANTS } from '../../../helpers/constant';
import { get as _get } from 'lodash';

@Component({
  selector: 'app-preprocessed',
  templateUrl: './preprocessed.component.html',
  styleUrls: ['./preprocessed.component.scss'],
})
export class PreprocessedComponent implements OnInit {
  // pdfSrc = "assets/docs/How to create pre processed data for ML Works.pdf";
  loader: boolean;
  pdfSrc: string;
  constructor(private mlopsService: MlopsService) {}

  ngOnInit(): void {
    this.openPDF('preprocessedData');
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
