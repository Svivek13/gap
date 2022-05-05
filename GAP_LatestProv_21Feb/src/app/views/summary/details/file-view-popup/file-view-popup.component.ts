import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MlopsService } from 'src/app/mlops.service';

@Component({
  selector: 'app-file-view-popup',
  templateUrl: './file-view-popup.component.html',
  styleUrls: ['./file-view-popup.component.scss']
})
export class FileViewPopupComponent implements OnInit {

  top10Records: any;
  topColumns: any;
  data: any;

  constructor(@Inject(MAT_DIALOG_DATA) public topTenData: any, private mlopsService: MlopsService,
              public dialogRef: MatDialogRef<FileViewPopupComponent>) {
                this.data = topTenData.data.topTenRecords;
               }

  ngOnInit(): void {
    this.topColumns = Object.keys(this.data[0]);
    this.top10Records = this.data;
    // console.log(this.top10Records);
  }

}
