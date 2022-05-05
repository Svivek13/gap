import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { get as _get, isEmpty as _isEmpty } from 'lodash';
import { MlopsService } from 'src/app/mlops.service';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-mapping',
  templateUrl: './mapping.component.html',
  styleUrls: ['./mapping.component.scss']
})
export class MappingComponent implements OnInit {

  selectedIndex = '2';
  targetFormGroup = new FormGroup({
    targetVariableSelected: new FormControl('', [Validators.required]),
    className: new FormControl({value: '', disabled: false}),
    catVariables: new FormControl('')
  });
  matcher = new MyErrorStateMatcher();
  get targeteFormControl() { return this.targetFormGroup.get('targetVariableSelected'); }
  checked = true;
  targetVariables: any;
  variablesSelected: any;
  targetModel: any;
  headers: any;
  dataTypeSelected: any;
  topTenRecords: [];
  rows: unknown[][];
  trainObj: any;
  data: any;
  testObj: any;
  saveDisable = false;
  topColumns: any;
  sl: number[];
  showTargetTab = true;

  constructor(@Inject(MAT_DIALOG_DATA) public mappingData: any, private mlopsService: MlopsService,
              public dialogRef: MatDialogRef<MappingComponent>) {
    this.data = mappingData.data;
    console.log(this.data, 'dataaa');
   }

  ngOnInit(): void {
    console.log('mapping Data', this.mappingData);
    this.targetVariables = this.data.target;
    this.headers = this.targetVariables;
    this.topColumns = Object.keys(this.mappingData.data.topTenRecords[0]);
    this.topColumns.unshift('Sl');
    this.topTenRecords = this.mappingData.data.topTenRecords;
    this.sl = Array.from({length: this.topTenRecords.length}, (_, i) => i + 1);
    console.log(this.topTenRecords, this.targetVariables, 'sjhfkshfqa');
    this.extractHeadersAndRows();
    if (this.data.object) {
      if (this.data.object === 'trainingFile') {
        this.showTargetTab = false;
      } else {
      this.saveDisable = true;
      if (this.mappingData.data.dxCase === 'BOTH' || this.mappingData.data.dxCase === 'X') {
        const targetSelected = this.targetVariables.find(target =>
          target.name === this.data.object.label);
        // const varSelected = this.targetVariables.filter(variables =>
        //     this.data.object.categoricalFeatures.some(vars => variables.name === vars)
        //     ).map(({ name }) => name);
        this.targetFormGroup = new FormGroup({
          targetVariableSelected: new FormControl('', [Validators.required]),
          className: new FormControl({value: this.data.object.classNames, disabled: true}),
          catVariables: new FormControl('')
        });
        this.targetFormGroup.controls.targetVariableSelected.setValue(targetSelected.name, {onlySelf: true});
        // this.targetFormGroup.controls.catVariables.setValue(varSelected, {onlySelf: true});
        // this.targetFormGroup.get('targetVariableSelected').disable();
        // this.targetFormGroup.get('catVariables').disable();
      } else if (this.mappingData.data.dxCase === 'D') {
        const targetSelected = this.targetVariables.find(target =>
          target.name === this.data.object.label);
        this.targetFormGroup = new FormGroup({
          targetVariableSelected: new FormControl('', [Validators.required])
        });
        this.targetFormGroup.controls.targetVariableSelected.setValue(targetSelected.name, {onlySelf: true});
        // this.targetFormGroup.get('targetVariableSelected').disable();
      }
    }
    }
  }

  extractHeadersAndRows() {
    console.log('finding typeof: ', typeof this.topTenRecords);
    // this.headers = Object.keys(this.topTenRecords[0])
    this.rows = this.topTenRecords.map(item => Object.values(item));
    console.log(this.topTenRecords, this.rows);
  }

  saveMappingData() {
    if (this.data.fileSelected === 'trainingFile') {
    this.trainObj = {
      label: _get(this.targetFormGroup, 'value.targetVariableSelected'),
      classNames: _get(this.targetFormGroup, 'value.className'),
      categoricalFeatures: _get(this.targetFormGroup, 'value.catVariables')
    };
    this.mlopsService.targetObject = this.trainObj;
    this.dialogRef.close(this.trainObj);
  } else {
    this.testObj = {
        label: _get(this.targetFormGroup, 'value.targetVariableSelected'),
        classNames: _get(this.targetFormGroup, 'value.className'),
        categoricalFeatures: _get(this.targetFormGroup, 'value.catVariables')
    };
    this.mlopsService.testObject = this.testObj;
    this.dialogRef.close(this.testObj);
  }
  }

}
