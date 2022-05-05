import { Component, ElementRef, Injectable, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { HttpClient, HttpEventType} from '@angular/common/http';
import { get as _get, isEmpty as _isEmpty, has as _has } from 'lodash';
import { MlopsService } from '../mlops.service';
import { MatDialog } from '@angular/material/dialog';
import { MappingComponent } from './mapping/mapping.component';
import { ErrorStateMatcher } from '@angular/material/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { forkJoin, Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import cleanDeep from 'clean-deep';
import { FileUploadService } from '../services/file-upload.service';
import { JoyrideService } from 'ngx-joyride';
import { ThemeService } from '../theme/theme.service';
import { tourDetails } from '../../shared/tour';
import { v4 as uuidv4 } from 'uuid';
import { TrackService } from '../track/track.service';
import { isEmpty } from 'rxjs/operators';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.scss'],
  providers: [FileUploadService]
})
@Injectable()
export class SetupComponent implements OnInit {
  @ViewChild('inputFile') myInputVariable: ElementRef;
  @ViewChild('itemName') itemName: ElementRef;
  @ViewChild('testItemName') testItemName: ElementRef;
  buttons = [{name: 'execution', label: 'Drift', checked: true}, {name: 'execution', label: 'Explainability', checked: true}];
  @ViewChildren ('checkBox' ) checkBox: QueryList<any>;
  drift = {
    label: 'Drift',
    checked: true
  };
  explainability = {
    label: 'Explainability',
    checked: true
  };
  setupFormGroup = new FormGroup({
    projectName: new FormControl('', [Validators.required]),
    projectDesc: new FormControl(''),
    dataModel: new FormControl(''),
    trainingFile: new FormControl(''),
    testFile: new FormControl('', [Validators.required]),
    modelFile: new FormControl(''),
    drift: new FormControl(true),
    explainability: new FormControl(true)
  });
  formData = new FormData();
  items = ['Each file can have a maximum of 25 columns and 100k rows',
   'First column and first row in the uploaded file should not be blank', 'Accepted formats: .csv'];
  matcher = new MyErrorStateMatcher();
  selectedModel: any;
  trainFormData: FormData;
  testFormData: FormData;
  modelFormData: FormData;
  checked: any[];
  topTenRecords: [];
  autoConfigProjects: any;
  acSetupFlow = false;
  mSetupFlow = true;
  acSetupFormGroup: FormGroup;
  trainingTargetData: any;
  fileSelected: any;
  testTargetData: any;
  popupError = {
    headers: false,
    topTen: false
  };
  dxCase: string;
  testFile: any;
  trainFile: any;
  modelFile: any;
  filePrefix: any;
  testRowValidation: boolean;
  testColValidation: boolean;
  trainColValidation: boolean;
  trainRowValidation: boolean;
  filematch: boolean;
  pklfilematch: boolean;
  checkboxError: boolean;
  checkboxErrorMsg: string;
  get projectNameFormControl() { return this.setupFormGroup.get('projectName'); }
  get dataModelFormControl() { return this.setupFormGroup.get('dataModel'); }
  models: any;
  trainingProgress: number;
  testingProgress: number;
  dataProgress: number;
  targetVariables: any;
  dataTypes: any;
  loader = false;
  trainingFileUploadError = false;
  trainingFileUploadErrorMessage = '';
  testFileUploadError = false;
  testFileUploadErrorMessage = '';
  modelFileUploadError = false;
  modelFileUploadErrorMessage = '';
  showTrainFile = true;
  showModelFile = true;
  downLoadLoaderTrain = false;
  downLoadLoaderTest = false;
  downLoadLoaderModel = false;
  showUniqueProjectError = false;
  uniqueProjectErrorMsg = '';
  tours: any;
  targetSubscribe: Subscription;


  constructor(private http: HttpClient, private mlopsService: MlopsService,
              private trackService: TrackService, public dialog: MatDialog,
              private snackBar: MatSnackBar, private fileUploadService: FileUploadService,
              private router: Router,
              // private readonly joyrideService: JoyrideService,
              private themeService: ThemeService
              ) { }

  ngOnInit(): void {
    this.fetchDataModelTypes();
    this.tours = tourDetails;
    this.captureTarget();
  }

  resetForm() {
    this.setupFormGroup.reset();
  }

  captureTarget() {
    this.targetSubscribe = this.mlopsService.targetSubject.subscribe(targetObj => {
      if (!_isEmpty(targetObj)) {
      if (_has(targetObj, 'label') || _get(targetObj, 'label') !== '') {
        this.testFileUploadError = false;
        this.testFileUploadErrorMessage = '';
        this.testTargetData = targetObj;
      }
    }
    }
    );
  }

  openMapping() {
    if (this.setupFormGroup.get('explainability').value === true && this.setupFormGroup.get('drift').value === false) {
      this.dxCase = 'X';
    } else if (this.setupFormGroup.get('explainability').value === false && this.setupFormGroup.get('drift').value === true) {
      this.dxCase = 'D';
    } else if (this.setupFormGroup.get('explainability').value === true && this.setupFormGroup.get('drift').value === true) {
      this.dxCase = 'BOTH';
    }

    const active = this.themeService.getActiveTheme();
    let panelClass;
    if (active.name === 'light') {
      panelClass = 'custom-dialog-class';
    } else {
      panelClass = 'dark-dialog-class';
    }

    const dialogRef = this.dialog.open(MappingComponent, {
      height: '40vh',
      maxHeight: '90vh',
      minHeight: '40vh',
      data: { data: {target: this.targetVariables, topTenRecords: this.topTenRecords,
         fileSelected: this.fileSelected, error: this.popupError, dxCase: this.dxCase } },
      panelClass
    });
    dialogRef.afterClosed().subscribe(result => {
      if (this.fileSelected === 'trainingFile') {
      this.trainingTargetData = result;
      } else {
        this.testTargetData = result;
        if (!_has(this.testTargetData, 'label') || _get(this.testTargetData, 'label') === '') {
          this.testFileUploadError = true;
          this.testFileUploadErrorMessage = this.testFileUploadErrorMessage.concat('Target not selected');
        } else {
          this.testFileUploadError = false;
          this.testFileUploadErrorMessage = '';
        }
      }
      console.log('data from popup: ', result);
    });
  }

  // tourStart() {

  //   console.log(this.tours);
  //   this.joyrideService.startTour(
  //       {
  //         steps: ['step1', 'step2', 'step3', 'step4', 'step5', 'step6', 'step7', 'step8', 'step9', 'step10', 'step11', 'step12', 'step13'
  //  , 'step14', 'step15', 'step16', 'step17', 'step18', 'step19', 'step20', 'step21', 'step22', 'step23',
  // 'step24', 'step25', 'step26', 'step27', 'ste28', 'step29'
  //         , 'step30'], // Your steps order
  //         showPrevButton: false,
  //         // stepDefaultPosition: 'top',
  //         themeColor: '#f06938'
  //       }
  //   );
  // }
  // on2ndNext() {
  //   this.router.navigate(['/overview']);
  // }

  descBlur(event) {
    this.trackService.trackingMetrics(event, '5');
  }

  modelSelectionChangeEvent(event) {
    this.trackService.trackingMetrics(event, '6');
  }

  projectNameBlurEvent(event) {
    this.trackService.trackingMetrics(event, '4');
    this.showUniqueProjectError = false;
    const projectName = event.target.value;
    console.log('project Name', projectName);
    this.mlopsService.checkUniqueProject({ projectName }).subscribe(response => {
      console.log(response, 'porject sfdfsfsdf');
      if (_get(response, 'data.code') !== 1) {
        this.showUniqueProjectError = true;
        this.uniqueProjectErrorMsg = _get(response, 'data.message');
      }
    }, err => {
      console.log(err);
    });
  }

  createForm() {
    const projects = this.autoConfigProjects;
    let firstProject = projects[0];
    firstProject = this.trimFilenames(firstProject);
    let driftChecked = false;
    let xaiChecked = false;

    firstProject.executionType.map((item: string) => {
      if (item === 'drift') {
        driftChecked = true;
      }
      if (item === 'explainability')  {
        xaiChecked = true;
      }
    });

    // show hide files initially
    if (firstProject.executionType.includes('drift') && firstProject.executionType.includes('explainability')) {
      this.showTrainFile = true;
      this.showModelFile = true;
    } else if (firstProject.executionType.includes('drift') && !firstProject.executionType.includes('explainability')) {
      this.showTrainFile = true;
      this.showModelFile = false;
    } else if (!firstProject.executionType.includes('drift') && firstProject.executionType.includes('explainability')) {
      this.showTrainFile = false;
      this.showModelFile = true;
    }

    this.acSetupFormGroup = new FormGroup({
      projectName: new FormControl(projects, [Validators.required]),
      projectDesc: new FormControl(firstProject.description),
      dataModel: new FormControl(firstProject.modelType),
      trainingFile: new FormControl({value: firstProject.trainFile, disabled: true}),
      testFile: new FormControl({value: firstProject.testFile, disabled: true}),
      modelFile: new FormControl({value: firstProject.modelFile, disabled: true}),
      drift: new FormControl({value: driftChecked, disabled: true}),
      explainability: new FormControl({value: xaiChecked, disabled: true}),
    });
    this.acSetupFormGroup.get('dataModel').disable();
    this.acSetupFormGroup.patchValue({
      projectName: firstProject.projectId
    });
  }
  trimFilenames(project) {
    console.log('project to trimFilenames: ', project);
    this.filePrefix = project.trainFile[0].url.split('/').slice(0, project.trainFile[0].url.split('/').length - 1 ).join('/');
    console.log(this.filePrefix);
    project.trainFile = project.trainFile.map(item => item.url.split('/').pop());
    // project.trainFile = project.trainFile.split('/').pop();

    if (project.testFile) {
      project.testFile = project.testFile.map(item => item.url.split('/').pop());
      // project.testFile = project.testFile.split('/').pop();
    }
    if (project.modelFile) {
      project.modelFile = project.modelFile.url.split('/').pop();
    }
    console.log('project modified file urls: ', project);
    return project;
  }

  manualFlowChosen() {
    this.acSetupFlow = false;
    this.mSetupFlow = true;
    this.trainingProgress = 0;
    this.showTrainFile = true;
    this.showModelFile = true;
  }

  fetchDataModelTypes() {
    this.mlopsService.getDataModels().subscribe(response => {
      this.models = response.data;
      this.setupFormGroup.controls.dataModel.setValue(this.models[0].value, {onlySelf: true});
    });
  }

  validateFile(fileuploaded) {
    const file = fileuploaded.name;
    const reg = /(.*?)\.(xlsx|xls|csv)$/;
    if (!file.match(reg)) {
      this.filematch = false;
    } else {
      this.filematch = true;
    }
  }

  async trainingUploadFile(trainingFile) {
    this.trainFile = null;
    console.log(trainingFile, 'fileComing');
    this.trainingFileUploadError = false;
    this.trainingFileUploadErrorMessage = '';
    await this.validateFile(trainingFile);
    if (this.filematch !== false) {
    this.trainingProgress = 1;
    this.trainFormData = new FormData();
    this.trainFormData.append('file', trainingFile);

    this.trainFile = trainingFile;
    console.log(trainingFile, 'training file');

    this.fileUploadService.postFile(trainingFile).subscribe(
      event => {
        if (event.type === HttpEventType.UploadProgress) {
        this.trainingProgress = Math.round((100 / event.total) * event.loaded);
        if (this.trainingProgress === 100) {
          forkJoin({
            headerReq: this.mlopsService.popupHeaders(this.trainFormData),
            topTenReq: this.mlopsService.popupTopTenHeaders(this.trainFormData),
          })
          .subscribe(({headerReq, topTenReq}) => {
            console.log(headerReq, topTenReq);
            // error handling to be done here
            if (!headerReq.hasOwnProperty('data') && !topTenReq.hasOwnProperty('data')) {
              // do not open popup
              // show proper message here
              // snackbar can be used
              this.snackBar.open('Error occurred', 'Ok', {
                duration: 2000
              });
              // this._snackBar.open(topTenReq.error.message, 'Ok', {
              //   duration: 2000
              // });
            } else {
              // below separate if conditions can be used to know which one failed and
              // that info can be passed to popup screen to show proper failure message
              if (headerReq.hasOwnProperty('data')) {
                this.targetVariables = headerReq.data.fields;
                this.dataTypes = headerReq.data.datatypes;
                this.trainColValidation = headerReq.data.colValidation;
                this.trainRowValidation = headerReq.data.rowValidation;
                // comment below two if conditions after trial
                if (this.trainColValidation === false) {
                  // file having more than 25 columns is not allowed
                  this.trainingFileUploadError = true;
                  this.trainingFileUploadErrorMessage = this.trainingFileUploadErrorMessage.concat('More than 25 columns not allowed ');
                  return;
                }
                if (this.trainRowValidation === false) {
                  this.trainingFileUploadError = true;
                  this.trainingFileUploadErrorMessage = this.trainingFileUploadErrorMessage.concat('More than 100k rows not allowed');
                  return;
                }
              }
              if (topTenReq.hasOwnProperty('data')) {
                this.topTenRecords = topTenReq.data;
              }
              // this.openMapping();
            }
          });
        }
      }
      }
    ,
      (err) => {
        console.log('Upload Error:', err);
      }
    );
    } else {
      this.trainingFileUploadError = true;
      this.trainingFileUploadErrorMessage = 'File type mismatch. Upload only .xlsx, .xls or .csv';
    }
  }

  async testingUploadFile(testfile) {
    this.mlopsService.testObject = undefined;
    this.testFileUploadError = false;
    this.testFileUploadErrorMessage = '';
    await this.validateFile(testfile);
    if (this.filematch !== false) {
    this.testingProgress = 1;
    this.testFormData = new FormData();
    this.testFormData.append('file', testfile);

    this.testFile = testfile;
    this.fileUploadService.postFile(testfile).subscribe(
      event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.testingProgress = Math.round((100 / event.total) * event.loaded);
          if (this.testingProgress === 100) {
            this.loader = true;
            forkJoin({
                headerReq: this.mlopsService.popupHeaders(this.testFormData),
                topTenReq: this.mlopsService.popupTopTenHeaders(this.testFormData),
              })
              .subscribe(({headerReq, topTenReq}) => {
                this.loader = false;
                console.log(headerReq, topTenReq);
                // error handling to be done here
                if (!headerReq.hasOwnProperty('data') && !topTenReq.hasOwnProperty('data')) {
                  // do not open popup
                  // show proper message here
                  this.snackBar.open('Error occurred', 'Ok', {
                    duration: 2000
                  });
                  // this._snackBar.open(topTenReq.error.message, 'Ok', {
                  //   duration: 2000
                  // });
                } else {
                  // below separate if conditions can be used to know which one failed and
                  // that info can be passed to popup screen to show proper failure message
                  if (headerReq.hasOwnProperty('data')) {
                    this.targetVariables = headerReq.data.fields;
                    this.dataTypes = headerReq.data.datatypes;
                    this.testRowValidation = headerReq.data.rowValidation;
                    this.testColValidation = headerReq.data.colValidation;
                    if (this.testColValidation === false) {
                      // file having more than 25 columns is not allowed
                      this.testFileUploadError = true;
                      this.testFileUploadErrorMessage = this.testFileUploadErrorMessage.concat('More than 25 columns not allowed ');
                      return;
                    }
                    if (this.testRowValidation === false) {
                      this.testFileUploadError = true;
                      this.testFileUploadErrorMessage = this.testFileUploadErrorMessage.concat('More than 100k rows not allowed');
                      return;
                    }
                  } else {
                    // error in headers fetching
                    this.popupError.headers = true;
                  }
                  if (topTenReq.hasOwnProperty('data')) {
                    this.topTenRecords = topTenReq.data;
                  } else {
                    // error in top 10 records
                    this.popupError.topTen = true;
                  }
                  this.openMapping();
                }

              });
            }
        }
      },
      (err) => {
        console.log('Upload Error:', err);
      }
    );
    } else {
      this.testFileUploadError = true;
      this.testFileUploadErrorMessage = 'File type mismatch. Upload only .xlsx, .xls or .csv';
    }
  }

  validatePickleFile(fileuploaded) {
    const file = fileuploaded.name;
    const reg = /(.*?)\.(pkl|pickle)$/;
    if (!file.match(reg)) {
      this.pklfilematch = false;
    } else {
      this.pklfilematch = true;
    }
  }

  async dataUploadFile(modelfile) {
    this.modelFileUploadError = false;
    this.modelFileUploadErrorMessage = '';
    await this.validatePickleFile(modelfile);
    if (this.pklfilematch !== false) {
    this.dataProgress = 1;
    this.modelFormData = new FormData();
    this.modelFormData.append('file', modelfile);

    this.modelFile = modelfile;
    this.fileUploadService.postFile(modelfile).subscribe(
      event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.dataProgress = Math.round((100 / event.total) * event.loaded);
        }
      },
      (err) => {
        console.log('Upload Error:', err);
      }
    );
    } else {
      this.modelFileUploadError = true;
      this.modelFileUploadErrorMessage = 'File type mismatch. Upload only .pkl or .pickle';
    }
  }

  driftOptions(driftEvent) {
    this.trackService.trackingMetrics('checkbox', '2');
    if (driftEvent.checked === true && this.setupFormGroup.get('explainability').value === false) {
      this.showModelFile = false;
      this.showTrainFile = true;
      this.checkboxError = false;
    } else if (driftEvent.checked === false && this.setupFormGroup.get('explainability').value === true) {
      this.showModelFile = true;
      this.showTrainFile = false;
      this.checkboxError = false;
    } else if (driftEvent.checked === false && this.setupFormGroup.get('explainability').value === false) {
      this.showModelFile = true;
      this.showTrainFile = true;
      this.checkboxError = true;
      this.checkboxErrorMsg = 'Please select at least one execution type';
    } else {
      this.showModelFile = true;
      this.showTrainFile = true;
    }
  }

  explainOptions(explainEvent) {
    this.trackService.trackingMetrics('checkbox', '3');
    if (explainEvent.checked === true && this.setupFormGroup.get('drift').value === false) {
      this.showModelFile = true;
      this.showTrainFile = false;
      this.checkboxError = false;
    } else if (explainEvent.checked === false && this.setupFormGroup.get('drift').value === true) {
      this.showModelFile = false;
      this.showTrainFile = true;
      this.checkboxError = false;
    } else if (explainEvent.checked === false && this.setupFormGroup.get('drift').value === false) {
      this.showModelFile = true;
      this.showTrainFile = true;
      this.checkboxError = true;
      this.checkboxErrorMsg = 'Please select at least one execution type';
    } else {
      this.showModelFile = true;
      this.showTrainFile = true;
    }
  }

  setupSubmit = (event) => {
    this.trackService.trackingMetrics(event, '11');
    this.formData = new FormData();

    if (
      this.setupFormGroup.get('drift').value === true &&
      this.setupFormGroup.get('explainability').value === false
    ) {
      if (_isEmpty(_get(this.setupFormGroup, 'value.trainingFile'))) {
        this.trainingFileUploadError = true;
        this.trainingFileUploadErrorMessage = 'Please upload the training file';
      }
      if (_isEmpty(_get(this.setupFormGroup, 'value.testFile'))) {
        this.testFileUploadError = true;
        this.testFileUploadErrorMessage = 'Please upload the test file';
      }
    } else if (
      this.setupFormGroup.get('explainability').value === true &&
      this.setupFormGroup.get('drift').value === false
    ) {
      if (_isEmpty(_get(this.setupFormGroup, 'value.testFile'))) {
        this.testFileUploadError = true;
        this.testFileUploadErrorMessage = 'Please upload the test file';
      }
      if (_isEmpty(_get(this.setupFormGroup, 'value.modelFile'))) {
        this.modelFileUploadError = true;
        this.modelFileUploadErrorMessage = 'Please upload the model file';
      }
    } else if (this.setupFormGroup.get('explainability').value === false &&
    this.setupFormGroup.get('drift').value === false) {
      if (_isEmpty(_get(this.setupFormGroup, 'value.trainingFile'))) {
        this.trainingFileUploadError = true;
        this.trainingFileUploadErrorMessage = 'Please upload the training file';
      }
      if (_isEmpty(_get(this.setupFormGroup, 'value.testFile'))) {
        this.testFileUploadError = true;
        this.testFileUploadErrorMessage = 'Please upload the test file';
      }
      if (_isEmpty(_get(this.setupFormGroup, 'value.modelFile'))) {
        this.modelFileUploadError = true;
        this.modelFileUploadErrorMessage = 'Please upload the model file';
      }
    } else if (
      this.setupFormGroup.get('explainability').value === true &&
      this.setupFormGroup.get('drift').value === true
    ) {
      if (
        _isEmpty(_get(this.setupFormGroup, 'value.trainingFile')) &&
        (this.setupFormGroup.get('drift').value === true ||
          this.setupFormGroup.get('explainability').value === true)
      ) {
        this.trainingFileUploadError = true;
        this.trainingFileUploadErrorMessage = 'Please upload the training file';
      }
      if (
        _isEmpty(_get(this.setupFormGroup, 'value.testFile')) &&
        this.setupFormGroup.get('drift').value === true
      ) {
        this.testFileUploadError = true;
        this.testFileUploadErrorMessage = 'Please upload the test file';
      }
      if (
        _isEmpty(_get(this.setupFormGroup, 'value.modelFile')) &&
        this.setupFormGroup.get('explainability').value === true
      ) {
        this.modelFileUploadError = true;
        this.modelFileUploadErrorMessage = 'Please upload the model file';
      }
    }

    if (this.trainingFileUploadError === false && this.testFileUploadError === false &&
        this.modelFileUploadError === false && !_isEmpty(this.setupFormGroup.get('projectName').value)) {
    this.loader = true;
    if (this.setupFormGroup.valid) {
      this.formData.append('test', this.testFile);
      this.formData.append('train', this.trainFile);
      this.formData.append('model', this.modelFile);

      const executionType = [];
      if (this.setupFormGroup.get('drift').value) {
        executionType.push('drift');
        this.formData.append('executionType', 'drift');
      }
      if (this.setupFormGroup.get('explainability').value) {
        executionType.push('explainability');
        this.formData.append('executionType', 'explainability');
        this.formData.append(
          'modelType',
          _get(this.setupFormGroup, 'value.dataModel')
        );
      }
      this.formData.append(
        'name',
        _get(this.setupFormGroup, 'value.projectName')
      );
      this.formData.append(
        'description',
        _get(this.setupFormGroup, 'value.projectDesc')
      );
      if (
        !_isEmpty(this.trainingTargetData) ||
        !_isEmpty(this.testTargetData)
      ) {
        const explainabilityObj = JSON.stringify(
          cleanDeep({
            trainDataTargetVars: this.trainingTargetData,
            testDataTargetVars: this.testTargetData,
          })
        );
        console.log(explainabilityObj);
        this.formData.append('explainability', explainabilityObj);
      }
      console.log(this.formData, 'formData');
      this.mlopsService.uploadExecute(this.formData).subscribe(
        (response) => {
          console.log(response);
          this.snackBar.open(
            `${response.data.name} created successfully`,
            'Ok',
            {
              duration: 2000,
            }
          );
          this.loader = false;
          this.router.navigate(['/overview']);
        },
        (err) => {
          const errorMessage = _get(err, 'error.message');
          this.snackBar.open(errorMessage, 'Ok', {
            duration: 2000,
          });
          this.loader = false;
        }
      );
    }
}
}

  captureFileName(event) {
    this.trackService.trackingMetrics(event, '7');
    this.fileSelected = this.itemName.nativeElement.getAttribute('formControlName');
    this.trainingFileUploadError = false;
    this.trainingProgress = 0;
  }

  captureTestName(event) {
    this.trackService.trackingMetrics(event, '8');
    this.fileSelected = this.testItemName.nativeElement.getAttribute('formControlName');
    this.testFileUploadError = false;
    this.testingProgress = 0;
  }

  modelFileClick(event) {
    this.trackService.trackingMetrics(event, '9');
    this.modelFileUploadError = false;
    this.dataProgress = 0;
  }

  downloadTrainingFile() {
    if ( Array.isArray(this.acSetupFormGroup.get('trainingFile').value) ) {
      console.error('yet to handle case of multiple flies');
      this.snackBar.open('Yet to handle case of multiple flies', 'Ok', {
        duration: 2000
      });
      return;
    }
    this.downLoadLoaderTrain = true;
    let name = this.acSetupFormGroup.get('trainingFile').value;
    name = this.createFullName(name);
    console.log('training file value: ', this.acSetupFormGroup.get('trainingFile').value);
    this.downloadFile(name);
  }

  createFullName(name: string): string {
    return this.filePrefix + '/' + name;
  }

  downloadFile(name: string) {
    this.mlopsService.downloadFile({ name })
      .subscribe((response: any) => {
        console.log(response);
        const dataType = response.type;
        const binaryData = [];
        binaryData.push(response);
        const downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: dataType}));
        if (name) {
                downloadLink.setAttribute('download', name);
            }
        document.body.appendChild(downloadLink);
        downloadLink.click();
        this.downLoadLoaderTrain = false;
        this.downLoadLoaderTest = false;
        this.downLoadLoaderModel = false;
      },
        error => {
          this.downLoadLoaderTrain = false;
          this.downLoadLoaderTest = false;
          this.downLoadLoaderModel = false;
          const errorMessage = _get(error, 'error.message');
          this.snackBar.open(errorMessage, 'Ok', {
            duration: 2000
          });
        });
  }

  downloadTestFile() {
    if ( Array.isArray(this.acSetupFormGroup.get('testFile').value) ) {
      console.error('yet to handle case of multiple flies');
      this.snackBar.open('Yet to handle case of multiple flies', 'Ok', {
        duration: 2000
      });
      return;
    }
    this.downLoadLoaderTest = true;
    let name = this.acSetupFormGroup.get('testFile').value;
    name = this.createFullName(name);
    this.downloadFile(name);
  }

  downloadModelFile() {
    this.downLoadLoaderModel = true;
    let name = this.acSetupFormGroup.get('modelFile').value;
    name = this.createFullName(name);
    this.downloadFile(name);
  }

  // skipToOverview(event) {
  //   this.router.navigate(['/overview']);
  //   this.trackService.trackingMetrics(event, '1');
  // }

  trackHelp(event, name) {
    this.trackService.trackingMetrics(event, '10');
    if (name === 'drift') {
      this.router.navigate(['/help'], { queryParams: { name: 'Drift' }});
    } else if (name === 'xai') {
      this.router.navigate(['/help'], { queryParams: { name: 'Explainability' }});
    } else if (name === 'model') {
      this.router.navigate(['/help'], { queryParams: { name: 'Models' }});
    } else if (name === 'preprocessed') {
      this.router.navigate(['/help'], { queryParams: { name: 'Preprocessed' }});
    }
  }

}
