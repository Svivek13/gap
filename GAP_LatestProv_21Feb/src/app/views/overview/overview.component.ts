import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MlopsService } from '../../mlops.service';
import { get as _get, isEmpty as _isEmpty, has as _has } from 'lodash';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { of, Subject, Subscription } from 'rxjs';
import { debounceTime, delay, distinctUntilChanged, map, mergeMap } from 'rxjs/operators';
import { UtilsService } from 'src/app/services/utils.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ProvenanceGraphComponent } from './provenance-graph/provenance-graph.component';
import { tourDetails } from 'src/shared/tour';
import { ThemeService } from 'src/app/theme/theme.service';
import { TrackService } from 'src/app/track/track.service';

// socket service
// import { Socket } from 'ngx-socket-io';

import {environment} from '../../../environments/environment';
import { AESEncryptDecryptServiceService } from 'src/app/services/aesencrypt-decrypt-service.service';


@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit, AfterViewInit {
  projectTyped: KeyboardEvent;
  startDate: any;
  endDate: any;
  driftPercentage: number;
  filtersForm: FormGroup;
  driftGT30 = 0;
  dataTill: any;
  projectType: any = 'both';
  isRefreshing: boolean;
  driftCount: any = 0;
  xaiCount: any = 0;
  darkTheme: boolean;
modelName :any;
  constructor( private mlopsService: MlopsService, private router: Router, public dialog: MatDialog,
               private utilsService: UtilsService,
               private snackBar: MatSnackBar,
               private themeService: ThemeService,
              //  private socket: Socket,
               private trackService: TrackService,
               private aESEncryptDecryptServiceService: AESEncryptDecryptServiceService ) {}

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public keyUp = new Subject<KeyboardEvent>();
  private subscription: Subscription;
  options = ['More than 10%', 'More than 20%', 'More than 30%'];
  projectTypes = [
    {
      show: 'Both',
      value: 'both'
    },
    {
      show: 'System',
      value: 'admin'
    },
    {
      show: 'User',
      value: 'non-admin'
    },
  ];
  driftBy = [
    {
      show: 'Select drift percentage',
      value: 0
    },
    {
      show: 'More than 10%',
      value: 10
    },
    {
      show: 'More than 20%',
      value: 20
    },
    {
      show: 'More than 30%',
      value: 30
    },
  ];
  errorBy = [
    {
      show: 'Select error percentage',
      value: 0
    },
    {
      show: 'More than 10%',
      value: 10
    },
    {
      show: 'More than 20%',
      value: 20
    },
    {
      show: 'More than 30%',
      value: 30
    },
  ];
  dropdownLabel = this.options[0];
  columnsToDisplay = [{header: 'Status', field: 'statuss'}, {header: 'Project Name', field:
  'name'}, {header: 'Run Start', field: 'runStart'},
  {header: 'Run End', field: 'runEnd'}, {header: 'By', field: 'createdBy'}, {header: 'Duration', field: 'duration'}, {header: 'Graph', field: 'graph'}];
  columnsProps = this.columnsToDisplay.map(column => column.field);
  dataSource: any;
  loader = false;
  tours: any;

  ngAfterViewInit(): void {
  }


  ngOnInit(): void {
    this.modelName = sessionStorage.getItem('projectName');
    // console.log(this.modelName);
    
    this.createForm();
    this.fetchProjectsWrapper();
    this.searchByProjectName();
    this.tours = tourDetails;

    // socket connection
    // this.socket.disconnect()
    // const userId = localStorage.getItem('userId');
    // this.socket.ioSocket.io.opts.query = { userId } //new options
    // this.socket.ioSocket.io.uri = environment.baseUrl //new uri
    // this.socket.connect(); //manually connection

    // end of socket connection
  }

  onStep21Next() {
    // route with bikesharing data
    this.router.navigate(['/persona', {
      id: '604a0f3662b3125900edf508',
      name: 'BikeSharing',
      type: 'Drift, Explainability',
      by: 'admin',
      execObj: JSON.stringify({
        id: '604a183b7af1af57cb63124d',
        testFile: 'input-files/admin - 5fdc5aa0db506631cc8754a5/BikeSharing_PreProcessed9_1615379217181.csv',
        target: 'cnt'
      })
    }]);
    setTimeout(_ => {
      // console.log('waiting checck for tour issue');
    }, 1000);
  }
  fetchProjectsWrapper() {
    this.fetchProjects(this.projectTyped, this.startDate, this.endDate, this.driftPercentage, this.projectType,this.modelName);
  }

  refreshOverviewTable(event) {
    this.trackService.trackingMetrics(event, '23');

    this.fetchProjectsWrapper();
    this.isRefreshing = true;
  }

  private fetchProjects(projTyped, startDate, endDate, driftPercentage, adminFilter,model) {
    this.resetValues();
    // try catch here
    this.loader = true;

    this.mlopsService.projectsOverview(projTyped, startDate, endDate, driftPercentage, adminFilter,this.modelName).subscribe(res => {
      this.loader = false;
      this.isRefreshing = false;
      if (!_has(res.data, 'projects')) {
        this.snackBar.open('No projects found', 'Ok', {
          duration: 2000
        });
        this.dataSource = new MatTableDataSource([]);
        return;
      }
      // console.log('cockpit res', res);
      const response = res.data.projects;
      this.driftGT30 = res.data.driftGT30;
      this.driftCount = res.data.driftCount;
      this.xaiCount = res.data.xaiCount;
      this.dataTill = this.utilsService.formatDateTime(this.findDataTill(res.data.projects));

      const tableData = [];
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < response.length; i++) {
        const data = { projectId: '', status: '', name: '', executionType: '',  runStart: '', runEnd: '',
        createdBy: '', drift: '', duration: '', latestExec: {}, green: false, yellow: false, red: false};
        data.latestExec = response[i].latestExec;
        data.projectId = response[i].projectId;
        data.status = response[i].status ? response[i].status : 'NA';
        data.executionType = response[i].executionType ? this.utilsService.capitaliseFirstLetter(response[i].executionType) : 'NA';
        data.name = response[i].name ? response[i].name : 'NA';
        data.runStart = response[i].runStart ? response[i].runStart : 'NA';
        const runStart = this.utilsService.formatDateTime(data.runStart);
        data.runStart = response[i].runStart ? runStart : 'NA';
        data.runEnd = response[i].runEnd ? response[i].runEnd : 'NA';
        const runEnd = this.utilsService.formatDateTime(data.runEnd);
        data.runEnd = response[i].runEnd ? runEnd : 'NA';
        data.createdBy = response[i].createdBy ? response[i].createdBy : 'NA';
        data.drift = response[i].drift || response[i].drift === 0 ? this.utilsService.driftToPercentage(response[i].drift) : 'NA';
        const driftValue = response[i].drift * 100;
        if ((driftValue >= 0) && (driftValue < 30)) {
          data.green = true;
        } else if ((driftValue >= 30) && (driftValue <= 50)) {
          data.yellow = true;
        } else if (driftValue >= 51) {
          data.red = true;
        }
        data.duration = response[i].duration ? response[i].duration : 'NA';
        tableData.push(data);
      }
      this.dataSource = new MatTableDataSource(tableData);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, err => {
      this.loader = false;
    }
    );
  }

  findDataTill(projects): any {
    const found = projects.find(item => item.runStart !== 'NA' || item.runEnd !== 'NA');
    if (!found) {
      return; // without this, if found is undefined, still function returns undefined and NA is shown for date till
    }
    try {
      if (found.runEnd !== 'NA') {
        return found.runEnd;
      } else {
        return found.runStart;
      }
    } catch (error) {
      // console.error(error);
    }
  }

  resetValues() {
    this.driftGT30 = 0;
    this.driftCount = 0;
    this.xaiCount = 0;
    this.dataTill = undefined;
  }

  searchByProjectName() {
    this.subscription = this.keyUp.pipe(
      map(event => event),
      debounceTime(1000),
      distinctUntilChanged(),
      mergeMap(search => of(search).pipe(
        delay(500),
      )),
    ).subscribe(res => {
      this.paginator.pageIndex = 0;
      this.projectTyped = res;
      this.fetchProjects(this.projectTyped, this.startDate, this.endDate, this.driftPercentage, this.projectType,this.modelName);
    });
  }

  createForm() {
    this.filtersForm = new FormGroup({
      projectName: new FormControl(''),
      projectType: new FormControl(this.projectTypes[0].value),
      startDate: new FormControl(''),
      endDate: new FormControl(''),
      driftBy: new FormControl(this.driftBy[0].value),
      errorBy: new FormControl({value: this.errorBy[0].value, disabled: true}),
    });
  }

  clearFiltersForm(event) {
    this.trackService.trackingMetrics(event, '18');

    this.filtersForm.reset();
    this.filtersForm.patchValue({
      driftBy: this.driftBy[0].value,
      errorBy: this.errorBy[0].value,
      projectType: this.projectTypes[0].value
    });
    this.startDate = undefined;
    this.endDate = undefined;
    this.projectTyped = undefined;
    this.driftPercentage = undefined;
    this.projectType = 'both';
    this.fetchProjects(undefined, undefined, undefined, undefined, 'both',undefined);
    this.driftGT30 = 0;
    this.dataTill = undefined;
  }

  openGraph(projectId, projectName) {
    const active = this.themeService.getActiveTheme();
    let panelClass;
    if (active.name === 'light') {
      panelClass = 'custom-dialog-class';
    } else {
      panelClass = 'dark-dialog-class';
    }
    const dialogRef = this.dialog.open(ProvenanceGraphComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '96%',
      width: '97%',
      data: {
        projectId,
        projectName
      },
      panelClass
    });
    dialogRef.afterClosed().subscribe(() => {
    });
  }

  goToDetails(event, header, projectId, projName, exectype, latestExec, createdBy) {
    if (header === 'Output') {
      this.trackService.trackingMetrics(event, '26');

      // // console.log({ id: projectId, name: projName, type: exectype, by: createdBy,
      //   execObj: JSON.stringify(latestExec)});

      const stringToPass = JSON.stringify({id: projectId, name: projName, type: exectype, by: createdBy,
          execObj: JSON.stringify(latestExec)});
      const encStringToPass = this.aESEncryptDecryptServiceService.encrypt(stringToPass);

      this.router.navigate(['/persona', { data: encStringToPass}]);
    } else if (header === 'Project Name') {
      this.trackService.trackingMetrics(event, '27');

      const stringToPass = JSON.stringify({ id: projectId, name: projName, type: exectype, by: createdBy });
      const encStringToPass = this.aESEncryptDecryptServiceService.encrypt(stringToPass);

      this.router.navigate(['/summary', { data: encStringToPass }]);
    } else if (header === 'Graph') {
      this.trackService.trackingMetrics(event, '25');
      this.openGraph(projectId, projName);
    }
  }

  startDateChange(eventType, event) {
    this.trackService.trackingMetrics('datepicker', '21');
    this.paginator.pageIndex = 0;
    // console.log('project name search text is: ', this.projectTyped);
    // console.log('take this start date: ', event.value.toISOString());
    this.startDate = event.value.toISOString();
    this.fetchProjects(this.projectTyped, this.startDate, this.endDate, this.driftPercentage, this.projectType,this.modelName);
  }

  endDateChange(eventType, event) {
    this.trackService.trackingMetrics('datepicker', '21');
    this.paginator.pageIndex = 0;
    // console.log('take this end date: ', event.value.toISOString());
    this.endDate = event.value.toISOString();
    this.fetchProjects(this.projectTyped, this.startDate, this.endDate, this.driftPercentage, this.projectType,this.modelName);
  }

  driftMorethan(event) {
    this.trackService.trackingMetrics(event, '22');
    this.paginator.pageIndex = 0;
    this.driftPercentage = event.value;
    this.fetchProjects(this.projectTyped, this.startDate, this.endDate, this.driftPercentage, this.projectType,this.modelName);
  }

  adminFilter(event) {
    this.trackService.trackingMetrics(event, '19');
    this.paginator.pageIndex = 0;
    this.projectType = event.value;
    this.fetchProjects(this.projectTyped, this.startDate, this.endDate, this.driftPercentage,
      this.projectType,this.modelName);
  }

  projectNameSearchBlur(event) {
    this.trackService.trackingMetrics(event, '20');
  }

  // goToSetup(event) {
  //   this.trackService.trackingMetrics(event, '24');

  //   this.router.navigate(['setup']);
  // }

}
