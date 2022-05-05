import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ThemeService } from 'src/app/theme/theme.service';
import { MlopsService } from 'src/app/mlops.service';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { TrackService } from 'src/app/track/track.service';

@Component({
  selector: 'app-add-execution',
  templateUrl: './add-execution.component.html',
  styleUrls: ['./add-execution.component.scss'],
  providers: [FileUploadService]
})
export class AddExecutionComponent implements OnInit {

  modelName: any;
  addExecFormGroup: FormGroup;
  execId: any;
  formData: FormData;
  drift = {label: 'Drift', checked: true};
  explainability = {label: 'Explainability', checked: true};
  trainingFiles: any;
  testFiles: any;
  filename: any;
  trainProgressDisplay: boolean;
  trainPercentDone: number;
  testPercentDone: number;
  testProgressDisplay: boolean;
  newTestFile: any;
  newTrainFile: any;
  loader: boolean;
  execType: string;
  driftCheckboxShow = false;
  xaiCheckboxShow = false;
  preLoadedFlow = true;
  newFileFlow = false;
  filesLength: any;
  disableTrainUpload = false;
  disableTestUpload = false;
  darkTheme = false;

  constructor(@Inject(MAT_DIALOG_DATA) public mappingData: any, private fileUploadService: FileUploadService,
              private mlopsService: MlopsService, private snackBar: MatSnackBar,
              private dialogRef: MatDialogRef<AddExecutionComponent>,
              private theme: ThemeService,
              private trackService: TrackService) {
    this.execId = this.mlopsService.execId;
    this.modelName = mappingData.data.modelName;
    this.execType = mappingData.data.execType;
    this.filesLength = mappingData.data.filesLength;
    this.trainingFiles = this.mlopsService.trainFilesForAddExec;
    this.testFiles = this.mlopsService.testFilesForAddExec;
   }

  ngOnInit(): void {
    this.driftXAICheckDecide();
    this.fileNameShortener();
    this.createForm();
    this.fileUploadDecide();
    this.themeCheck();
  }
  themeCheck() {
    const active = this.theme.getActiveTheme();
    if (active.name === 'dark') {
      this.darkTheme = true;
    }
  }
  fileUploadDecide() {
    this.disableTrainUpload = this.filesLength.train >= 2 ? true : false;
    this.disableTestUpload = this.filesLength.test >= 10 ? true : false;
    // console.log('disableTrain: ', this.disableTrainUpload, 'disableTest: ', this.disableTestUpload);
    if (this.disableTrainUpload === true) {
      this.addExecFormGroup.get('newtrainfilename').disable();
    }
    if (this.disableTestUpload === true) {
      this.addExecFormGroup.get('newtestfilename').disable();
    }
  }
  fileNameShortener() {
    this.trainingFiles = this.trainingFiles.map(item => {
      const midway = item.url.substring(item.url.lastIndexOf('/') + 1);
      const extension = midway.substring(midway.lastIndexOf('.') + 1);
      item.showUrl = midway.slice(0, midway.lastIndexOf('_')) + '.' + extension;
      return item;
    });
    this.testFiles = this.testFiles.map(item => {
      const midway = item.url.substring(item.url.lastIndexOf('/') + 1);
      const extension = midway.substring(midway.lastIndexOf('.') + 1);
      item.showUrl = midway.slice(0, midway.lastIndexOf('_')) + '.' + extension;
      return item;
    });
  }
  createForm() {
    try {
      this.addExecFormGroup = new FormGroup({
        drift: new FormControl({value: true, disabled: true}),
        explainability: new FormControl({value: true, disabled: true}),
        trainingDataFile: new FormControl(''),
        newtrainfilename: new FormControl(''),
        testDataFile: new FormControl(this.testFiles[0].url),
        newtestfilename: new FormControl('')
      });
      if (this.execType.includes('Drift')) {
        this.addExecFormGroup.patchValue({
          testDataFile: this.testFiles[0].url
        });
      }
    } catch (error) {
      console.error(error);
    }
  }
  driftXAICheckDecide() {
    // console.log('this.execType is: ', this.execType);
    if (this.execType.includes('Drift') || this.execType.includes('drift')) {
      this.driftCheckboxShow = true;
    }
    if (this.execType.includes('Explainability') || this.execType.includes('explainability')) {
      this.xaiCheckboxShow = true;
    }
  }

  addExecSubmit(event) {
    this.loader = true;
    this.formData = new FormData();
    this.formData.append('execId', this.execId);
    if (this.newTrainFile) {
      this.formData.append('train', this.newTrainFile);
    } else {
      this.formData.append('trainInput', this.addExecFormGroup.get('trainingDataFile').value);
    }
    if (this.newTestFile) {
      this.formData.append('test', this.newTestFile);
    } else {
      this.formData.append('testInput', this.addExecFormGroup.get('testDataFile').value);
    }
    // console.log('here formdata: ', this.formData);
    this.mlopsService.addExec(this.formData).subscribe(res => {
      this.snackBar.open(`Execution created successfully`, 'Ok', {
        duration: 2000
      });
      this.loader = false;
      this.dialogRef.close();
      // call summary details api here
    }, err => {
      this.loader = false;
      console.log('error', err);
    });
  }

  newTestFileUpload(testfile) {
    this.newTestFile = testfile;
    // this.fileUploadService.postFile(testfile).subscribe(
    //   event => {
    //       this.testProgressDisplay = true;
    //       if (event.type === HttpEventType.UploadProgress) {
    //       this.testPercentDone = Math.round(100 * event.loaded / event.total);
    //     }
    //   },
    //   (err) => {
    //     console.log('Upload Error:', err);
    //   }
    // );
  }

  newTrainFileUpload(trainfile) {
    this.newTrainFile = trainfile;
    // this.fileUploadService.postFile(trainfile).subscribe(
    //   event => {
    //       this.trainProgressDisplay = true;
    //       if (event.type === HttpEventType.UploadProgress) {
    //       this.trainPercentDone = Math.round(100 * event.loaded / event.total);
    //       if (this.trainPercentDone === 100) {
    //         this.loader = true;
    //         forkJoin({
    //           headerReq: this.mlopsService.popupHeaders(this.trainFormData),
    //           topTenReq: this.mlopsService.popupTopTenHeaders(this.trainFormData),
    //         })
    //         .subscribe(({headerReq, topTenReq}) => {
    //           this.loader = false;
    //           console.log(headerReq, topTenReq);
    //           if (!headerReq.hasOwnProperty('data') && !topTenReq.hasOwnProperty('data')) {
    //             this.snackBar.open('Error occurred', 'Ok', {
    //               duration: 2000
    //             });
    //           } else {
    //             if (headerReq.hasOwnProperty('data')) {
    //               this.targetVariables = headerReq.data.fields;
    //               this.dataTypes = headerReq.data.datatypes;
    //               this.trainColValidation = headerReq.data.colValidation;
    //               this.trainRowValidation = headerReq.data.rowValidation;
    //               if (this.trainColValidation === false) {
    //                 this.trainingFileUploadError = true;
    //                 this.trainingFileUploadErrorMessage = this.trainingFileUploadErrorMessage.concat('More
    //       than 25 columns not allowed ');
    //                 return;
    //               }
    //               if (this.trainRowValidation === false) {
    //                 this.trainingFileUploadError = true;
    //                 this.trainingFileUploadErrorMessage = this.trainingFileUploadErrorMessage.concat('More than 100k rows not allowed');
    //                 return;
    //               }
    //             }
    //             if (topTenReq.hasOwnProperty('data')) {
    //               this.topTenRecords = topTenReq.data;
    //             }
    //             this.openMapping();
    //           }
    //         });
    //       }
    //     }
    //   },
    //   (err) => {
    //     console.log('Upload Error:', err);
    //   }
    // );
  }

  preLoadedChosen() {
    this.preLoadedFlow = true;
    this.newFileFlow = false;
  }

  newFileChosen(event) {
    this.trackService.trackingMetrics(event, '39');

    this.preLoadedFlow = false;
    this.newFileFlow = true;
  }

}
