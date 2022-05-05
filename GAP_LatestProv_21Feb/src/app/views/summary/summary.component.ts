import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { SummaryService } from './summary.service';
import { get as _get, has as _has, isEmpty as _isEmpty } from 'lodash';
import { UtilsService } from 'src/app/services/utils.service';
import { MlopsService } from 'src/app/mlops.service';
import { AllExecutionsComponent } from './all-executions/all-executions.component';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import cleanDeep from 'clean-deep';
import { ConsoleService } from '@ng-select/ng-select/lib/console.service';
import { AESEncryptDecryptServiceService } from 'src/app/services/aesencrypt-decrypt-service.service';
export interface Pipeline {
  displayText: string;
  value: string;
}

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {

  @ViewChild(AllExecutionsComponent) child;
  summaryForm: FormGroup;
  projects = [];
  dataSource;
  showProject: any;
  summaryTableData: any;
  projectName: string;
  projectId: string;
  modelName: any;
  loader: boolean;
  execType: string;
  by: string;
  filesLength = {
    test: 0,
    train: 0
  };
  dataTill: string;

  allExecutions: boolean;
  details = true;
  recentExecs: boolean;

  recentExecId: any;
  modelFile: any;
  testFiles: any;
  trainFiles: any;
  modelType: any;
  filteredOptions: Observable<Pipeline[]>;
  options: any;
  description: any;
  selectdTree = 'Repository';
  adminProjectOrNot: string;
  iconText = 'search';

  constructor(private summaryService: SummaryService, private activatedRoute: ActivatedRoute,
              private utilsService: UtilsService, private mlopsService: MlopsService, private ref: ChangeDetectorRef,
              private router: Router,
              private aESEncryptDecryptServiceService: AESEncryptDecryptServiceService
              ) {
    let data;
    if (this.activatedRoute.snapshot.paramMap.get('data') !== null) {
      data = this.aESEncryptDecryptServiceService.decrypt(this.activatedRoute.snapshot.paramMap.get('data'));
      data = JSON.parse(data);
      // console.log(data);
    }
    // console.log(data);

    this.projectId = _get(data, 'id');
    this.projectName = _get(data, 'name');
    if (!_isEmpty(this.projectName)) {
      sessionStorage.setItem('projectName', this.projectName);
    }
    if (!_isEmpty(this.projectId)) {
      sessionStorage.setItem('projectId', this.projectId);
    }
    this.execType = _get(data, 'type');
    this.by = _get(data, 'by');
    // this.allExecutions = true;
   }

  ngOnInit(): void {
    this.createForm();
    this.fetchProjects();
    this.fetchProjectDetailsPublic();
  }

  fetchProjectDetailsPublic() {
    this.fetchProjectDetails(this.projectId);
  }

  createForm() {
    this.summaryForm = new FormGroup({
      projectName: new FormControl(this.projectName)
    });
  }

  fetchProjects() {
    this.summaryService.getProjects().subscribe(response => {
      // console.log('summary page projects: ', response.data);
      this.options = response.data;
      // if user lands directly on summary page
      if (!this.activatedRoute.snapshot.paramMap.get('data')) {
        this.projectId = sessionStorage.getItem('projectId') || this.options[0].value;
        this.projectName = sessionStorage.getItem('projectName') || this.options[0].displayText;

        this.summaryForm.patchValue({
          projectName: this.projectName
        });
        this.fetchProjectDetailsPublic();
      }
      this.projectOptionsFilter();
    }, err => {
      console.log('error occurred');
    });
  }

  getProjDetails(value) {
    // console.log(value);
    this.projectName = value;
    sessionStorage.setItem('projectName', value);
    const found = this.options.find(item => item.displayText === value);
    this.projectId = found.value;
    sessionStorage.setItem('projectId', found.value);
    this.fetchProjectDetails(found.value);
  }

  projectOptionsFilter() {
    try {
      this.filteredOptions = this.summaryForm.get('projectName').valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.displayText),
        map(name => {
          return name ? this._filter(name) : this.options.slice();
        })
      );
    } catch (error) {
      console.error(error);
    }
  }

  private _filter(name: string): Pipeline[] {
    const filterValue = name.toLowerCase();
    return this.options.filter(option => option.displayText.toLowerCase().indexOf(filterValue) >= 0);
  }

  private fetchProjectDetails(projectId) {
    try {
      this.summaryService.getProjectDetails(projectId).subscribe(
        (response) => {
          // console.log('summary page project details: ', response.data);
          this.modelName = response.data[0].modelType;
          const res = response.data[0];
          this.modelFile = res.modelFile;
          this.testFiles = res.testFiles;
          this.trainFiles = res.trainFiles;
          this.modelType = res.modelType;
          this.description = res.description;
          this.mlopsService.trainFilesForAddExec = response.data[0].trainFiles;
          this.mlopsService.testFilesForAddExec = response.data[0].testFiles;

          const tableData = [];
          res.exec = res.exec.reverse(); // to show latest execution first
          this.mlopsService.execId = res.exec[0]._id;
          this.recentExecId = res.exec[0]._id;
          this.execType = res.exec[0].executionType.join(', ');
          this.dataTill = this.utilsService.formatDateTime(
            this.findDataTill(res.exec)
          );
          // res.exec[0].executionType

          res.exec.forEach((element) => {
            const data = {name: '', runStart: '', runEnd: '', runTime: '', createdBy: '', trainingFile: '',
            modelFile: '', testFile: '', target: '', statuss: '', execId: ''};
            data.testFile = element.testFile;
            data.target = _get(element, 'explainability.testDataTargetVars.label');
            data.statuss = this.evalStatus(
              _get(element, 'driftexecutionTime.status'),
              _get(element, 'xaiexecutionTime.status')
            );
            // const chosenStart = this.chooseStart(_get(element, 'driftexecutionTime.start'), _get(element, 'xaiexecutionTime.start'));
            const chosenStart = _get(element, 'createdAt');
            const chosenEnd = this.chooseEnd(_get(element, 'driftexecutionTime.end'), _get(element, 'xaiexecutionTime.end'));
            // console.log('chosenStart and chosenEnd resp: ', chosenStart, ' : ', chosenEnd);
            data.name = element.executionName;
            data.runTime = this.utilsService.msToTime(
              new Date(chosenEnd).getTime() -
                new Date(chosenStart).getTime()
            );

            data.runStart = this.utilsService.formatDateTime(
              chosenStart
            );
            data.runEnd = this.utilsService.formatDateTime(
              chosenEnd
            );

            data.createdBy = this.systemForAdmin(element.user[0]);
            this.adminProjectOrNot = element.user[0] === 'admin' ? 'y' : 'n';
            // console.log('adminProjectOrNot: ', this.adminProjectOrNot);
            data.execId = element._id;
            // because trainFile won't be present for xai case
            // check this string null case, why it's coming
            if (!_isEmpty(element.trainFile) && element.trainFile !== 'null') {
              // console.log(element.trainFile);
              let t = element.trainFile.split('/', -1)[2];
              const extension = t.substr(t.lastIndexOf('.') + 1);
              t = t.substr(0, t.lastIndexOf('_'));
              data.trainingFile = t + '.' + extension;
            }
            tableData.push(data);
          });
          this.summaryTableData = new MatTableDataSource(tableData);

          this.showProject = _get(response, 'data.0', {});

          this.filesLength = {
            test: _get(response, 'data.0.testFiles', []).length,
            train: _get(response, 'data.0.trainFiles', []).length
          };

          // console.log('test and train file length: ', this.filesLength.test, this.filesLength.train);
          this.ref.detectChanges();
          this.summaryTableData.paginator = this.child.paginator;
          this.summaryTableData.sort = this.child.sort;

        },
        (err) => {}
      );
    } catch (error) {
      console.error(error);
    }
  }

  private systemForAdmin(createdBy: any): string {
    return createdBy === 'admin' ? 'System' : createdBy;
  }

  chooseStart(drift: any, xai: any) {
    // console.log('drift: ', drift, ' xai: ', xai, ' in chooseStart');
    if (!drift && !xai) {
      return undefined;
    } else if (drift && !xai) {
      return drift;
    } else if (xai && !drift) {
      return xai;
    } else {
      if ( drift < xai ) {
        return drift;
      } else {
        return xai;
      }
    }
  }

  chooseEnd(drift: any, xai: any) {
    if (!drift && !xai) {
      return undefined;
    } else if (drift && !xai) {
      return drift;
    } else if (xai && !drift) {
      return xai;
    } else {
      if (xai > drift ) {
        return xai;
      } else {
        return drift;
      }
    }
  }

  private evalStatus(dStatus: any, xStatus: any): string {
    if (!dStatus && !xStatus) {
      return 'NA';
    } else if (!dStatus && xStatus) {
      return xStatus;
    } else if (!xStatus && dStatus) {
      return dStatus;
    } else {
      if (dStatus === 'Failed' || xStatus === 'Failed') {
        return 'Failed';
      } else if (dStatus === 'Running' || xStatus === 'Running') {
        return 'Running';
      } else if (dStatus === 'Success' && xStatus === 'Success') {
        return 'Success';
      } else {
        return 'NA';
      }
    }
  }

  findDataTill(execs: any): any {
    const found = execs.find(item => (_has(item, 'driftexecutionTime.start') && item.driftexecutionTime.start  !== 'NA') || (_has(item, 'driftexecutionTime.end') && item.driftexecutionTime.end !== 'NA' )
       || (_has(item, 'xaiexecutionTime.start') && item.xaiexecutionTime.start  !== 'NA') ||
        (_has(item, 'xaiexecutionTime.end') && item.xaiexecutionTime.end !== 'NA' ));
    if (!found) {
      return 'NA';
    }
    const datesArray = cleanDeep([ _get(found, 'driftexecutionTime.end'),
       _get(found, 'driftexecutionTime.start'),
       _get(found, 'xaiexecutionTime.end'),
       _get(found, 'xaiexecutionTime.start') ]);

    return datesArray.reduce((a, b) => {
          return a > b ? a : b;
      });
  }

  changeDetails(event) {
    const selected = event.innerHTML;
    this.selectdTree = selected;
    if (selected === 'All Executions') {
      this.allExecutions = true;
      this.details = false;
      this.recentExecs = false;
      this.ref.detectChanges();
      this.summaryTableData.paginator = this.child.paginator;
      this.summaryTableData.sort = this.child.sort;
    } else if (selected === 'Repository') {
      this.details = true;
      this.allExecutions = false;
      this.recentExecs = false;
    } else {
      this.recentExecs = true;
      this.allExecutions = false;
      this.details = false;
    }
  }

  afterFourthStep() {
    this.router.navigate(['/setup']);
  }

  clearSearch() {
    this.summaryForm.patchValue({
      projectName: '',
    });
  }

  onHoverSearchIcon() {
    this.iconText = 'clear';
  }

  onLeaveSearchIcon() {
    this.iconText = 'search';
  }
}
