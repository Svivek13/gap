import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MlopsService } from 'src/app/mlops.service';
import { CommonModalPdfviewerComponent } from '../common-modal-pdfviewer/common-modal-pdfviewer.component';
import { CONSTANTS } from '../../../app/helpers/constant';
import { get as _get } from 'lodash';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor(private router: Router, public dialog: MatDialog, private mlopsService: MlopsService) { }

  pdftype = {
    termsCondition: 'termsandcondition',
    privacyPolicy: 'privacypolicy',
    drift: 'drift',
    xai: 'explainability',
    models: 'model',
    pre: 'preprocessedData'
  };

  // pdfData = {
  //   privacypolicy: {
  //     pdfsrc: 'assets/docs/PrivacyPolicy.pdf',
  //     header: 'PRIVACY POLICY'
  //   },
  //   termscondition: {
  //     pdfsrc: 'assets/docs/endUserLicenseAgreement.pdf',
  //     header: 'END USER LICENSE AGREEMENT'
  //   },
  //   drift: {
  //     pdfsrc: 'assets/docs/ML Works - Drift Documentation.pdf',
  //     header: 'DRIFT'
  //   },
  //   xai: {
  //     pdfsrc: 'assets/docs/ML Works - XAI Documentation.pdf',
  //     header: 'EXPLAINABILITY'
  //   },
  //   models: {
  //     pdfsrc: 'assets/docs/How to Create Model Object for ML Works.pdf',
  //     header: 'MODELS'
  //   },
  //   pre: {
  //     pdfsrc: 'assets/docs/How to create pre processed data for ML Works.pdf',
  //     header: 'PREPROCESSED'
  //   }
  // };

  ngOnInit(): void {
  }


  openDialog(pdfType, fileUrl) {
    const dialogRef = this.dialog.open(CommonModalPdfviewerComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '90%',
      width: '70%',
      data: { pdfsrc: fileUrl, header: _get(CONSTANTS, `pdfType.${pdfType}.header`) },
    });
    dialogRef.afterClosed().subscribe(() => {
    });
  }

  openPDF(pdfType) {
    const body = { name: _get(CONSTANTS, `pdfType.${pdfType}.name`) };
    this.mlopsService.getMetaFile(body).subscribe(res => {
      const dataType = res.type;
      const binaryData = [];
      binaryData.push(res);

      const fileUrl = window.URL.createObjectURL(
          new Blob(binaryData, { type: dataType })
        );
      this.openDialog(pdfType, fileUrl);
    });
  }

}
