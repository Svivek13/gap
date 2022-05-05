import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MlopsService } from 'src/app/mlops.service';
import { UtilsService } from 'src/app/services/utils.service';
import { MappingComponent } from '../../../setup/mapping/mapping.component';
import { FileViewPopupComponent } from './file-view-popup/file-view-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { get as _get, isEmpty as _isEmpty, has as _has } from 'lodash';
import { TrackService } from 'src/app/track/track.service';
import { ThemeService } from 'src/app/theme/theme.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit, OnChanges {

  @Input() name: string;
  @Input() modelFile: any;
  @Input() testFiles: any;
  @Input() trainFiles: any;
  @Input() modelType: string;
  @Input() desc: string;
  @Input() adminProjectOrNot: string;
  @Input() filesLength: any;

  modelColumns = [{header: 'Sl.', field: 'serial'}, {header: 'File Name', field: 'name'}, {header: 'Upload Date', field: 'date'}];
  modelProps = this.modelColumns.map(column => column.field);
  modelSource = [{serial: '1', name: 'Some long very very long file name', date: 'Jan 01 8:56 AM'}];
  trainColumns = [{header: 'Sl.', field: 'serial'}, {header: 'File Name', field: 'name'}, {header: 'Upload Date', field: 'date'}];
  trainProps = this.trainColumns.map(column => column.field);
  trainSource = [{serial: '1', name: 'Some long very very long file name', date: 'Jan 01 8:56 AM'}, {serial: '2', name: 'Some long very very long file name', date: 'Jan 01 8:56 AM'}];
  testColumns = [{header: 'Sl.', field: 'serial'}, {header: 'File Name', field: 'name'}, {header: 'Upload Date', field: 'date'}];
  testProps = this.testColumns.map(column => column.field);
  testSource = [{serial: '1', name: 'Some long very very long file name', date: 'Jan 01 8:56 AM'}, {serial: '2', name: 'Some long very very long file name', date: 'Jan 01 8:56 AM'}, {serial: '3', name: 'Some long very very long file name', date: 'Jan 01 8:56 AM'}, {serial: '4', name: 'Some long very very long file name', date: 'Jan 01 8:56 AM'}, {serial: '5', name: 'Some long very very long file name', date: 'Jan 01 8:56 AM'}, {serial: '6', name: 'Some long very very long file name', date: 'Jan 01 8:56 AM'}, {serial: '7', name: 'Some long very very long file name', date: 'Jan 01 8:56 AM'}, {serial: '8', name: 'Some long very very long file name', date: 'Jan 01 8:56 AM'}, {serial: '9', name: 'Some long very very long file name', date: 'Jan 01 8:56 AM'}, {serial: '10', name: 'Some long very very long file name', date: 'Jan 01 8:56 AM'}];
  testDataSource: any;
  trainDataSource: MatTableDataSource<any>;
  modelDataSource: MatTableDataSource<any>;
  loader: boolean;
  testDownloadText = 'Download';
  trainDownloadText = 'Download';
  modelDownloadText = 'Download';

  constructor(public dialog: MatDialog, private utilsService: UtilsService,
              private mlopsService: MlopsService, private themeService: ThemeService,
              private trackService: TrackService) { }

  topTenRecords: any;
  // fileSelected: any;

  openMapping() {
    const active = this.themeService.getActiveTheme();
    let panelClass;
    if (active.name === 'light') {
      panelClass = 'custom-dialog-class';
    } else {
      panelClass = 'dark-dialog-class';
    }
    const dialogRef = this.dialog.open(FileViewPopupComponent, {
      data: { data: {topTenRecords: this.topTenRecords} },
      panelClass
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('data from popup: ', result);
    });
  }

  ngOnInit(): void {
    this.modelProps = this.modelProps.concat('control');
    this.trainProps = this.trainProps.concat('control');
    this.testProps = this.testProps.concat('control');
    this.dataSourcePrep();
    // console.log(this.adminProjectOrNot);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (_has(changes, 'desc') || _has(changes, 'filesLength')) {
      // console.log(changes);
      this.dataSourcePrep();
    }

    // this.doSomething(changes.desc.currentValue);
    // You can also use desc.previousValue and
    // desc.firstChange for comparing old and new values

}

  dataSourcePrep() {
    try {
      // console.log(this.filesLength);
      this.modelType =
      this.modelType ? this.modelType.charAt(0).toUpperCase() + this.modelType.slice(1) : undefined;
      const model = this.modelFile;
      const modelData = [];
      if (_has(model, 'url')) {
        const data = { serial: 0, fullUrl: '', name: '', date: '' };
        data.serial = 1;
        data.fullUrl = model.url;
        data.name = this.utilsService.fileNameShortener(model.url);
        data.date = this.utilsService.formatDateTime(model.uploadDate);
        modelData.push(data);
      }
      this.modelDataSource = new MatTableDataSource(modelData);

      const testData = [];
      if (this.filesLength.test !== 0) {
        this.testFiles.forEach((element, index) => {
          const data2 = { serial: 0, fullUrl: '', name: '', date: '' };
          data2.serial = index + 1;
          data2.fullUrl = element.url;
          data2.name = this.utilsService.fileNameShortener(element.url);
          data2.date = this.utilsService.formatDateTime(element.uploadDate);
          testData.push(data2);
        });
      }
      this.testDataSource = new MatTableDataSource(testData);

      const trainData = [];
      if (this.filesLength.train !== 0) {
        this.trainFiles.forEach((element, index) => {
          const data3 = { serial: 0, fullUrl: '', name: '', date: '' };
          data3.serial = index + 1;
          data3.fullUrl = element.url;
          data3.name = this.utilsService.fileNameShortener(element.url);
          data3.date = this.utilsService.formatDateTime(element.uploadDate);
          trainData.push(data3);
        });
      }
      this.trainDataSource = new MatTableDataSource(trainData);
    } catch (error) {
      console.error(error);
    }
  }

  fileDownload(element) {
    this.mlopsService.downloadFileFromAzure(element.fullUrl, () => {
      this.testDownloadText = 'Download';
      this.trainDownloadText = 'Download';
      this.modelDownloadText = 'Download';
    });
  }
  testFileDownload(event, element) {
    this.trackService.trackingMetrics(event, '40');
    this.testDownloadText = 'Downloading..';
    this.fileDownload(element);
  }
  trainFileDownload(event, element) {
    this.trackService.trackingMetrics(event, '40');
    this.trainDownloadText = 'Downloading..';
    this.fileDownload(element);
  }
  modelFileDownload(event, element) {
    this.trackService.trackingMetrics(event, '40');

    this.modelDownloadText = 'Downloading..';
    this.fileDownload(element);
  }

  fetchTopTenRecords(event, name) {
    this.trackService.trackingMetrics(event, '41');

    this.loader = true;
    this.mlopsService.getTopTenRecords({name}).subscribe(response => {
      console.log('top 10 details: ', response);
      this.topTenRecords = response.data.fileData;
      this.openMapping();
      this.loader = false;
    }, err => {
      this.loader = false;
    });
  }

}

