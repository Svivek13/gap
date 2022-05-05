import { Component, OnInit } from '@angular/core';

import { MlopsService } from '../../../mlops.service';
import { CONSTANTS } from '../../../helpers/constant';
import { get as _get } from 'lodash';

@Component({
  selector: 'app-provenance',
  templateUrl: './provenance.component.html',
  styleUrls: ['./provenance.component.scss']
})
export class ProvenanceComponent implements OnInit {

  constructor(private mlopsService: MlopsService) { }
  loader: boolean;
  pdfSrc: string;
  ngOnInit(): void {
    this.openPDF('provenance');

    // const tag = document.createElement('script');
    // tag.src = 'https://www.youtube.com/iframe_api';
    // document.body.appendChild(tag);
  }

  openPDF(pdfType) {
    const body = { name: _get(CONSTANTS, `pdfType.${pdfType}.name`) };
    this.loader = true;
    this.mlopsService.getMetaFile(body).subscribe(res => {
      this.loader = false;
      // console.log(res, 'file res');
      const dataType = res.type;
      const binaryData = [];
      binaryData.push(res);

      const fileUrl = window.URL.createObjectURL(
          new Blob(binaryData, { type: dataType })
        );
      this.pdfSrc = fileUrl;
    }, err => {
      this.loader = false;
      console.log(err);
    });
  }

}
