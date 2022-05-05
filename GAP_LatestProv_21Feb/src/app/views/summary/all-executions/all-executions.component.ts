import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddExecutionComponent } from '../add-execution/add-execution.component';
import { SummaryComponent } from '../../summary/summary.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { MatSort } from '@angular/material/sort';
import { ThemeService } from 'src/app/theme/theme.service';
import { TrackService } from 'src/app/track/track.service';
import { AESEncryptDecryptServiceService } from 'src/app/services/aesencrypt-decrypt-service.service';

@Component({
  selector: 'app-all-executions',
  templateUrl: './all-executions.component.html',
  styleUrls: ['./all-executions.component.scss']
})
export class AllExecutionsComponent implements OnInit {

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  columnsToDisplay = [{header: 'Status', field: 'status'}, {header: 'Execution ID', field:
  'name'}, {header: 'Run Start', field: 'runStart'}, {header: 'Run End', field: 'runEnd'}, {header: 'Run Time', field: 'runTime'}, {header: 'By', field: 'createdBy'}, {header: 'Training File', field: 'trainingFile'}];
  columnsProps = this.columnsToDisplay.map(column => column.field);
  dataSource: any;
  @Input() set summaryDataSource(value: any) {
    this.dataSource = value;
    this.isRefreshing = false;
  }
  @Input() projectId: string;
  @Input() projectName: string;
  @Input() modelName = new MatTableDataSource([]);
  @Input() executionType: any;
  @Input() filesLength: any;
  @Input() latestExecId: any;
  @Input() adminProjectOrNot: string;
  isRefreshing: boolean;

  constructor(public dialog: MatDialog,
              private summary: SummaryComponent,
              private router: Router,
              private dataService: DataService,
              private themeService: ThemeService,
              private trackService: TrackService,
              private aESEncryptDecryptServiceService: AESEncryptDecryptServiceService
              ) {
   }

  openAddExecution(event) {
    this.trackService.trackingMetrics(event, '38');

    const active = this.themeService.getActiveTheme();
    let panelClass;
    if (active.name === 'light') {
      panelClass = 'custom-dialog-class';
    } else {
      panelClass = 'dark-dialog-class';
    }
    const dialogRef = this.dialog.open(AddExecutionComponent, {
      minWidth: '90vh',
      minHeight: '70vh',
      data: { data: {modelName: this.modelName, execType: this.executionType, filesLength: this.filesLength } },
      panelClass
    });
    dialogRef.afterClosed().subscribe(result => {
        this.refreshSummaryTable();
    });
  }

  ngOnInit(): void {
    // console.log(this.filesLength);

    this.columnsProps = this.columnsProps.concat('addExecution');
  }

  refreshSummaryTable() {
    this.summary.fetchProjectDetailsPublic();
    // can use subject here and subscribe that in summary component
    this.isRefreshing = true;
  }

  stopRefreshBtnAnimation() {
    this.isRefreshing = false;
  }

  runExec(element) {
    // console.log(element);
    const index = element.name.lastIndexOf('-');
    const execId = element.execId;
    const latestExec = {
      id: execId,
      testFile: element.testFile,
      target: element.target
    };
    const createdBy = element.createdBy;

    const projectName = this.projectName;
    // console.log('execId is: ', execId, ' and projectId is: ', this.projectId, ' and projectName is: ', projectName);
    // console.log('exectype: ', this.executionType);

    this.dataService.summaryExecRun = {
      projectId: this.projectId,
      execId,
      projectName
    };

    const stringToPass = JSON.stringify({
      id: this.projectId, execId, name: projectName, type: this.executionType,
      by: createdBy,
      execObj: JSON.stringify(latestExec)
    });
    const encStringToPass = this.aESEncryptDecryptServiceService.encrypt(stringToPass);

    this.router.navigate(['persona', {
      data: encStringToPass
    }]);
  }


}
