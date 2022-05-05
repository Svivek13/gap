import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MlopsService } from 'src/app/mlops.service';
import { UtilsService } from 'src/app/services/utils.service';
import { TrackService } from 'src/app/track/track.service';
import { MatDialog } from '@angular/material/dialog';
import { ThemeService } from 'src/app/theme/theme.service';
import { DrilldownTableComponent } from '../drilldown-table/drilldown-table.component';

@Component({
  selector: 'app-data-engineer',
  templateUrl: './data-engineer.component.html',
  styleUrls: ['./data-engineer.component.scss']
})
export class DataEngineerComponent implements OnInit {
  loader = false;
  @Input() projId: any;
  @Input() projName: any;
  @Input() createdBy: any;
  @Input() modelName: any;
  costChartLabels: any;
  costChartData: any;
  costChartReady = false;
  durationChartLabels: any;
  durationChartData: any;
  durationChartReady = false;
  public processedColors = [{ backgroundColor: 'rgba(242, 123, 80, 1)' }];
  processedChartData: any;
  processedChartLabels: any;
  processedChartReady = false;
  metrics = ['Overall', 'Drift Only', 'XAI Only'];
  dropSelected = this.metrics[0];
  costSelected = this.metrics[0];
  pythonVersion: any;
  osUsed: any;
  kubernetesVersion: any;
  mongoVersion: any;
  mysqlVersion: any;
  iconText = 'search';
  lastCost = '0';
  recordCount_data: any;
  displayedColumns: string[] = ['Brand', 'source_name', 'source_count', 'sink_count', 'sink_name'];
  attrfilteredOptions: any = [];
  modelTypeFilter: any = ["PP_3_months", "PP_6_months", "PP_12_months"]
  attributeFilteredOptions: Observable<string[]>;
  locationFilterOptions:Observable<string[]>;
  brandFilterOptions: Observable<string[]>;
  decileFilterOptions: Observable<string[]>;
  modelTypeFilterOptions: Observable<string[]>;
  syndicationAttr: FormGroup;
  attribute: any = 'num_distinct_masterkey';
  brand: any = 'AT';
  filteredOptions: any = [];
  locationOptions:any = [];
  decileOtions: any = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
  decile: any;
  syndicationData: any;
  @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;
  drillDownData: any;
  insertDate: any;
  insertDateSyndication: any;
  showDMDE: boolean;
  showPPDE: boolean;
  constructor(private mlopsService: MlopsService, private trackService: TrackService, private utilsService: UtilsService, private formBuilder: FormBuilder, private themeService: ThemeService, public dialog: MatDialog) {
    this.syndicationAttr = this.formBuilder.group({
      attribute: new FormControl(''),
      brand: new FormControl(''),
      decile: new FormControl(''),
      model_type: new FormControl(''),
      location: new FormControl('')
    });
    this.syndicationAttr.patchValue({
      attribute: { "value": "num_distinct_masterkey", "displayText": "Master Key" },
      //  brand: this.brand
      // decile: this.decile
    })
  }

  ngOnInit(): void {

    this.createForm();
    // this.syndicationAttr.setValue({attribute : { "value": "num_distinct_masterkey", "displayText": "Master Key" }})
    //  this.syndicationAttr.setValue({attribute:{ "value": "num_distinct_masterkey", "displayText": "Master Key" }})


    this.decileFilterOptions = this.syndicationAttr.get('decile')
      .valueChanges.pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.value),
        map((name) => this._filterDecile(name))
      );
    this.modelTypeFilterOptions = this.syndicationAttr.get('model_type')
      .valueChanges.pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.value),
        map((name) => this._filterModelType(name))
      );
    if (this.projName == 'Direct_Mail' || this.projName == 'Purchase_Propensity' || this.projName == 'Email_Response' || this.projName == 'Customer_Lifetime_Value') {
      this.attrfilteredOptions = [{ "value": "num_distinct_masterkey", "displayText": "Master Key" }, { "value": "avg_model_score", "displayText": "Model Score" }];
      this.syndicationAttr.patchValue({
        attribute: this.attrfilteredOptions[0]
      });
      this.attributeFilteredOptions = this.syndicationAttr.get('attribute')
        .valueChanges.pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value.value),
          map((name) => this._filterAttr(name))
        );
    } else {
      this.attrfilteredOptions = [{ "value": "num_distinct_masterkey", "displayText": "Master Key" }];
      this.syndicationAttr.patchValue({
        attribute: this.attrfilteredOptions[0]
      });
      this.attributeFilteredOptions = this.syndicationAttr.get('attribute')
        .valueChanges.pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value.value),
          map((name) => this._filterAttr(name))
        );

    }
    //// console.log(this.recordCount_data);
    this.getDropdownBrand();
    this.getDropdownLocation();
    this.fetchDeData();
    //  this.getDropdownBrand();
    // console.log(this.projName.replace(' ', '_'));

  }
  private _filter(name: string): string[] {
    const filterValue = name.toLowerCase();
    return this.filteredOptions.filter(
      (option) => option.toLowerCase().indexOf(filterValue) >= 0
    );
  }
  private _filterAttr(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.attrfilteredOptions.filter(
      (option) => option.displayText.toLowerCase().indexOf(filterValue) >= 0
    );
  }
  private _filterLocation(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.locationOptions.filter(
      (option) => option.toLowerCase().indexOf(filterValue) >= 0
    );
  }
  private _filterDecile(name: string): string[] {
    const filterValue = name.toLowerCase();
    return this.decileOtions.filter(
      (option) => option.toLowerCase().indexOf(filterValue) >= 0
    );
  }
  private _filterModelType(name: string): string[] {
    const filterValue = name.toLowerCase();
    return this.modelTypeFilter.filter(
      (option) => option.toLowerCase().indexOf(filterValue) >= 0
    );
  }
  createForm() {

    // this.syndicationAttr.patchValue({
    //   attribute: this.attribute,
    //   brand : this.brand,
    //   decile : this.decile
    // });
  }
  displayFn(subject) {
    // console.log(subject)
    // this.brand = '';
    // this.brand = subject;
    return subject ? subject : undefined;
  }
  displayFnAttr(subject) {
    // console.log(subject)
  //  this.attribute = subject.value;
    return subject.displayText ? subject.displayText : undefined;
  }
  displayFnLocation(subject) {
    // console.log(subject)
    // this.brand = '';
    // this.brand = subject;
    return subject ? subject : undefined;
  }

  displayFnDecile(subject) {
    // console.log(subject)
  //  this.decile = subject;
    return subject ? subject : undefined;
  }
  displayFnModelType(subject) {
    return subject ? subject : undefined;
  }
  getDropdownBrand() {
    const obj = { model: this.projName }
    this.syndicationAttr.patchValue({
      model_type: "PP_3_months"
    });
    this.mlopsService.getBrandDESyndDropdown(obj).subscribe((res) => {
      this.filteredOptions = res.data;
      // console.log(this.filteredOptions);

      this.syndicationAttr.patchValue({
        brand: this.filteredOptions[0]
      });
      this.brandFilterOptions = this.syndicationAttr.get('brand')
        .valueChanges.pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value.value),
          map((name) => this._filter(name))
        );
    })
  }
  getDropdownLocation() {
    const obj = { model: this.projName }
    this.mlopsService.getLocationDESyndDropdown(obj).subscribe((res) => {
      this.locationOptions = res.data;
      console.log(this.locationOptions);

      this.syndicationAttr.patchValue({
        location: this.locationOptions[0]
      });
      this.locationFilterOptions = this.syndicationAttr.get('location')
        .valueChanges.pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value.value),
          map((name) => this._filterLocation(name))
        );
    })

  }
  getDropdownAttribute() {
    const obj = { model: this.projName }
    this.mlopsService.getAttributesDESyndDropdown(obj).subscribe((res) => {
      this.attrfilteredOptions = res.data;
      this.syndicationAttr.patchValue({
        attribute: this.attrfilteredOptions[0]
      });
      this.attributeFilteredOptions = this.syndicationAttr.get('attribute')
        .valueChanges.pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value.value),
          map((name) => this._filterAttr(name))
        );
    })
  }
  fetchDeData() {
    this.loader = true;
    // console.log(this.syndicationAttr.get('brand').value);
    this.syndicationData = [];
    // this.filteredOptions = [];
    // console.log(this.projName);
    if (this.projName == 'Purchase_Propensity') {
      this.showPPDE = true;
    }
    if (this.projName == 'Direct_Mail' || this.projName == 'Purchase_Propensity' || this.projName == 'Email_Response' || this.projName == 'Customer_Lifetime_Value') {
      // this.attrfilteredOptions = [{ "value": "num_distinct_masterkey", "displayText": "Master Key" }, { "value": "avg_model_score", "displayText": "Model Score" }];
      // this.syndicationAttr.patchValue({
      //   attribute: this.attrfilteredOptions[0]
      // });
      // this.attributeFilteredOptions = this.syndicationAttr.get('attribute')
      //   .valueChanges.pipe(
      //     startWith(''),
      //     map(value => typeof value === 'string' ? value : value.value),
      //     map((name) => this._filterAttr(name))
      //   );
      this.showDMDE = true;
    } else {
      this.showDMDE = false;
      this.showPPDE = false;
      // this.attrfilteredOptions = [{ "value": "num_distinct_masterkey", "displayText": "Master Key" }];
      // this.syndicationAttr.patchValue({
      //   attribute: this.attrfilteredOptions[0]
      // });
      // this.attributeFilteredOptions = this.syndicationAttr.get('attribute')
      //   .valueChanges.pipe(
      //     startWith(''),
      //     map(value => typeof value === 'string' ? value : value.value),
      //     map((name) => this._filterAttr(name))
      //   );

    }
    // userType 'admin' to be removed in future when it will be made available for custom projects also
    const obj = {
      model: this.projName.replace(' ', '_')
    };

    // console.log("pront obj", obj);

    this.mlopsService.deData(obj).subscribe((res) => {
      // // console.log(this.syndicationAttr.value);


      this.recordCount_data = res.data;
      this.insertDate = (moment.utc(res.data[0].insert_dt).format('MM-DD-YYYY h:mm:ss'));
      this.loader = false;
      //   // console.log("Table Data", this.recordCount_data);
    }, err => {
      // console.log(err);

    })
    // this.mlopsService.deSyndication(obj).subscribe((res) => {
    let obj2;

    // if (res) {
    //   // this.syndicationData = res.data;
    //   // console.log(res.data);
    //   for (let i = 0; i < res.data.length; i++) {

    //     this.filteredOptions.push(res.data[i].brand);
    //   }
    //   this.filteredOptions = [...new Set(this.filteredOptions)];
    //   // console.log(this.filteredOptions);
    //   this.syndicationAttr.patchValue({
    //     brand: this.filteredOptions[0]
    //   })
    //   //   // console.log([...new Set(this.filteredOptions)]);
    // }

    setTimeout(() => {
      // console.log(this.projName, "HI", this.syndicationAttr.value.brand);
      if (this.projName == 'Purchase_Propensity') {
        if (this.syndicationAttr.get('decile').value) {
          obj2 =
          {
            model: this.projName,
            brand: this.syndicationAttr.value.brand,
            location: this.syndicationAttr.value.location,
            attribute: this.syndicationAttr.value.attribute.value,
            decile: this.syndicationAttr.get('decile').value,
            model_type: this.syndicationAttr.value.model_type
          }
        } else {
          obj2 =
          {
            model: this.projName,
            brand: this.syndicationAttr.value.brand,
            location: this.syndicationAttr.value.location,
            attribute: this.syndicationAttr.value.attribute.value,
            decile: this.decile,
            model_type: this.syndicationAttr.value.model_type
          }
        }
      }
      else if (this.projName == 'Direct_Mail' || this.projName == 'Email_Response' || this.projName == 'Customer_Lifetime_Value') {
        //  this.showDMDE = true;
        if (this.syndicationAttr.get('decile').value) {
          obj2 =
          {
            model: this.projName,
            brand: this.syndicationAttr.value.brand,
            location: this.syndicationAttr.value.location,
            attribute: this.syndicationAttr.value.attribute.value,
            decile: this.syndicationAttr.get('decile').value
          }
        } else {
          obj2 =
          {
            model: this.projName,
            brand: this.syndicationAttr.value.brand,
            location: this.syndicationAttr.value.location,
            attribute: this.syndicationAttr.value.attribute.value,
            decile: this.decile
          }
        }

      } else {
        //    this.showDMDE = false;
        obj2 =
        {
          model: this.projName,
          brand: this.syndicationAttr.value.brand,
          location: this.syndicationAttr.value.location,
          attribute: 'num_distinct_masterkey',
        }
      }
      this.mlopsService.deSyndication(obj2).subscribe((res) => {
        // console.log(res)
        if (res) {
          this.syndicationData = res.data;
          // // console.log(this.syndicationData);
          // for(let i=0;i<this.syndicationData.length;i++){

          //   this.filteredOptions.push(this.syndicationData[i].brand);
          // }
          // // console.log([...new Set(this.filteredOptions)]);


          let bardataArr: any = [];
          let barLabelArr = [];
          let barTooltip = [];
          let barTooltipNeg = [];
          this.insertDateSyndication = (moment.utc(res.data[0].insert_dt).format('MM-DD-YYYY h:mm:ss'))

          for (let i = res.data.length - 1; i >= 0; i--) {
            bardataArr.push((res.data[i].percentage_difference).toFixed(2));
            barLabelArr.push(moment.utc(res.data[i].insert_dt).format('MM/DD/YYYY'));
            barTooltip.push(res.data[i].threshold);
            barTooltipNeg.push(-(Math.abs(res.data[i].threshold)))
          }

          // console.log(bardataArr);
          this.processedChartData = [{ data: bardataArr, barThickness: 15 }, { data: barTooltip, label: "Threshold", type: "line", borderDash: [10, 10], backgroundColor: "transparent", borderColor: "#fff", pointBackgroundColor: "#F27B50", borderWidth: 1, pointHoverBackgroundColor: "#fff" }, { data: barTooltipNeg, label: "Threshold", type: "line", borderDash: [10, 10], backgroundColor: "transparent", borderColor: "#fff", pointBackgroundColor: "#F27B50", borderWidth: 1, pointHoverBackgroundColor: "#fff" }];
          this.processedChartLabels = barLabelArr
          this.processedChartReady = true;
          this.costChartLabels = Array.from({ length: 20 }, (_, i) => i + 1);
          this.loader = false;
        }

      }, err => {
        // console.log(err);

      });
    }, 3000)


    //   })


  }
  getDrillDownResult(sinkName, sourceName) {
    if (this.showDMDE) {
      this.openDrillDownTable(sinkName, sourceName);
    }

  }
  openDrillDownTable(sinkName, sourceName) {
    const active = this.themeService.getActiveTheme();
    let panelClass;
    if (active.name === 'light') {
      panelClass = 'custom-dialog-class';
    } else {
      panelClass = 'dark-dialog-class';
    }
    const dialogRef = this.dialog.open(DrilldownTableComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '96%',
      width: '97%',
      data: {
        sink_name: sinkName,
        source_name: sourceName
      },
      panelClass
    });
    dialogRef.afterClosed().subscribe(() => {
    });
  }

  changeDurationMetric(event) {
    this.trackService.trackingMetrics(event, '37');

    this.dropSelected = event.value;
    this.fetchDeData();
  }

  changeCostMetric(event) {
    this.trackService.trackingMetrics(event, '37');

    this.costSelected = event.value;
    this.fetchDeData();
  }
  onHoverSearchIcon() {
    this.iconText = 'clear';
  }

  onLeaveSearchIcon() {
    this.iconText = 'search';
  }
  getPerVal(val) {
    //  // console.log(val);

    if (val > 5) {
      return true;
    } else {
      return false;
    }
  }

}
