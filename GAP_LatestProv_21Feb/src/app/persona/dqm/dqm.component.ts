import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MlopsService } from 'src/app/mlops.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { UtilsService } from 'src/app/services/utils.service';
import * as moment from 'moment';
import { TrackService } from 'src/app/track/track.service';


@Component({
  selector: 'app-dqm',
  templateUrl: './dqm.component.html',
  styleUrls: ['./dqm.component.scss']
})
export class DqmComponent implements OnInit {
  @Input() projName: any;
  completenessResult: any;
  uniquenessResult: any = [];
  loader: boolean;
  displayedColumnsCompleteness: string[] = [];
  displayedColumnsUniqueness: string[] = [];
  displayedColumns: string[] = ['TableName', 'Status', 'Schedule', 'LastUpdatedOn'];
  displayedColumnsUniquness: string[] = ['Table_Name', 'Value'];
  dataSource = []
  filterFormGroup: FormGroup;
  modelFilteredOptions: Observable<string[]>;
  tableFilteredOptions: Observable<string[]>;
  modelFilterOptions: any = ["Direct_Mail"];
  tablefilterOptions: any = [];
  model: any = "Direct_Mail";
  tableval: string;
  overAllcompletness: any;
  uniquenessData: any = [];
  globalXAIDataSegRev: any = [];
  globalXAILabelsSegRev: any = [];
  max5: Number;
  max: Number;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  globalChartDataSegRev: { data: any; barThickness: number; }[];
  globalChartDataUniqueness: { data: any; barThickness: number; tooltip: any }[];
  globalChartLabelsSegRev: any;
  globalLengthSegRev: any;
  firstN = 0;
  lastN: number;
  chartReady: boolean;
  chartReady2: boolean;
  public globalColors: any[] = [{ backgroundColor: 'rgba(242, 123, 80, 1)' }];
  globalXAILabelsUniqueness: any = [];
  globalXAIDataUniqueness: any = [];

  globalChartLabelsUniqueness: any;
  globalLengthUniqueness: any;
  arrUnique: any = [];
  insertDate: any;
  insertDateCompleteness: any;
  timelinessData: any;
  @Input() set pId(value: string) {
    // this.count = 0;
    // this.projectId = value;
    this.getFilterData();
    this.getUniquenessResult();
    this.getCompletenessResult();
    this.getTimelinessData();
    // this.getLatestExecObj();
  }
  constructor(private mlopsService: MlopsService, private activatedRoute: ActivatedRoute,
    private router: Router, private formBuilder: FormBuilder, private utilsService: UtilsService) {
    this.filterFormGroup = this.formBuilder.group({
      model: new FormControl(''),
      tableval: new FormControl('')
    });
  }

  ngOnInit(): void {
    //  this.projName = sessionStorage.getItem('projectName')
    this.createForm();
    this.modelFilteredOptions = this.filterFormGroup.get('model')
      .valueChanges.pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.value),
        map((name) => this._filter(name))
      );
    this.tableFilteredOptions = this.filterFormGroup.get('tableval')
      .valueChanges.pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.value),
        map((name) => this._filterTable(name))
      );
    // this.getFilterData()
    // this.getCompletenessResult();
    // this.getUniquenessResult();
    // console.log(this.projName);

    // this.uniquenessResult.paginator = this.paginator;
    // this.globalColors[0].backgroundColor[0] = 'rgba(242, 123, 80, 1)'
  }
  createForm() {



  }
  private _filter(name: string): string[] {
    const filterValue = name.toLowerCase();
    return this.modelFilterOptions.filter(
      (option) => option.toLowerCase().indexOf(filterValue) >= 0
    );
  }
  private _filterTable(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.tablefilterOptions.filter(
      (option) => option.toLowerCase().indexOf(filterValue) >= 0
    );
  }
  displayFn(subject) {
    // // console.log(subject)
    this.model = subject;
    return subject ? subject : undefined;
  }
  displayFnAttr(subject) {
    // // console.log(subject)
    this.tableval = subject;
    return subject ? subject : undefined;
  }
  getFilterData() {
    this.tablefilterOptions = []
    this.filterFormGroup.value.tableval = '';
    const obj = { model: this.projName };
    // this.tableval = [];
    this.mlopsService.getCompleteness(obj).subscribe((res) => {
      // console.log(res.data);
      (res.data).map((data) => {
        this.tablefilterOptions.push(data.table);
      })
      // console.log(this.tablefilterOptions[0]);

      this.filterFormGroup.patchValue({
        // model: this.model,
        tableval: this.tablefilterOptions[0]
        // decile: this.decile
      });
      // console.log(this.filterFormGroup.value.tableval);

    })
  }
  getCompletenessResult() {
    let obj;
    if (this.filterFormGroup.value.tableval) {
      obj = { model: this.projName, table: this.filterFormGroup.value.tableval }
    }

    this.chartReady = false;
    // console.log(obj);
    this.completenessResult = {}
    this.globalXAIDataSegRev = [];
    this.globalXAILabelsSegRev = [];
    // this.loader = true;
    this.mlopsService.getCompleteness(obj).subscribe((res) => {
      //  this.loader = false;
      this.insertDateCompleteness = (moment.utc(res.data[0].insert_dt).format('MM-DD-YYYY h:mm:ss'));
      this.completenessResult = res.data[0].listOfAttributes;
      //  // // console.log(this.completenessResult);

      this.overAllcompletness = res.data[0].overallCompletenessScore;
      const chartDataSegRev = Object.entries(this.completenessResult)
        .sort(([, v1]: any, [, v2]: any) => v2 - v1)
        .reduce((obj, [k, v]) => ({
          ...obj,
          [k]: v
        }), {})
      //  // // console.log(chartDataSegRev);
      this.lastN = this.firstN + 5;
      Object.keys(chartDataSegRev).forEach(key => {
        //  // // // console.log(key, chartDataRev[key]);
        this.globalXAIDataSegRev.push(chartDataSegRev[key].toFixed(2));
        this.globalXAILabelsSegRev.push(key)
      });
      // // console.log(this.globalXAIDataSegRev);

      this.max5 = this.utilsService.round(Math.ceil(Math.max(...this.globalXAIDataSegRev)));
      // // // console.log("Max1",this.max);
      this.globalChartDataSegRev = [{ data: this.globalXAIDataSegRev.slice(this.firstN, this.lastN), barThickness: 10 }];
      // // console.log(this.globalChartDataSegRev);

      this.globalChartLabelsSegRev = this.globalXAILabelsSegRev.slice(this.firstN, this.lastN);
      this.globalLengthSegRev = this.globalXAILabelsSegRev.length;
      //  // // console.log(this.completenessResult);
      this.chartReady = true;
      // this.displayedColumnsCompleteness = Object.getOwnPropertyNames(this.completenessResult[0]);

    });
  }
  globalChartColors(dataset) {
    for (let i = 0; i < dataset[0].data.length; i++) {
      if (dataset[0].data[i] >= 0) {
        this.globalColors[0].backgroundColor[i] = 'rgba(242, 123, 80, 1)';
      } else {
        this.globalColors[0].backgroundColor[i] = 'rgba(229,173,152,0.6)';
      }
    }
  }
  globalChartColorsUniqueness(dataset) {
    for (let i = 0; i < dataset[0].data.length; i++) {
      if (dataset[0].data[i] >= 0) {
        this.globalColors[0].backgroundColor[i] = 'rgba(242, 123, 80, 1)';
      } else {
        this.globalColors[0].backgroundColor[i] = 'rgba(229,173,152,0.6)';
      }
    }
  }
  showPrevFeaturesSegRev(event) {
    //  this.trackService.trackingMetrics('nav', '31');
    this.globalChartDataSegRev = [{ data: this.globalXAIDataSegRev.slice(event.first, event.last), barThickness: 10 }];
    this.globalChartLabelsSegRev = this.globalXAILabelsSegRev.slice(event.first, event.last);
    this.globalChartColors(this.globalChartDataSegRev);
  }

  showNextFeaturesSegRev(event) {
    // this.trackService.trackingMetrics('nav', '31');
    this.globalChartDataSegRev = [{ data: this.globalXAIDataSegRev.slice(event.first, event.last), barThickness: 10 }];
    this.globalChartLabelsSegRev = this.globalXAILabelsSegRev.slice(event.first, event.last);
    this.globalChartColors(this.globalChartDataSegRev);
  }
  showPrevFeaturesUniqueness(event) {
    //  this.trackService.trackingMetrics('nav', '31');
    this.globalChartDataUniqueness = [{ data: this.globalXAIDataUniqueness.slice(event.first, event.last), barThickness: 10, tooltip: this.arrUnique.slice(event.first, event.last) }];
    this.globalChartLabelsUniqueness = this.globalXAILabelsUniqueness.slice(event.first, event.last);
    this.globalChartColorsUniqueness(this.globalChartDataUniqueness);
  }

  showNextFeaturesUniqueness(event) {
    //  this.trackService.trackingMetrics('nav', '31');
    this.globalChartDataUniqueness = [{ data: this.globalXAIDataUniqueness.slice(event.first, event.last), barThickness: 10, tooltip: this.arrUnique.slice(event.first, event.last) }];
    this.globalChartLabelsUniqueness = this.globalXAILabelsUniqueness.slice(event.first, event.last);
    this.globalChartColorsUniqueness(this.globalChartDataUniqueness);
  }
  getUniquenessResult() {
    // console.log(this.projName);
    const obj = { model: this.projName };
    this.loader = true;
    this.chartReady2 = false;
    // const arrUnique = [];
    this.globalXAIDataUniqueness = [];
    this.globalXAILabelsUniqueness = [];
    this.uniquenessData = [];
    this.mlopsService.getUniqueness(obj).subscribe((res) => {
      //  // // console.log(res);
      this.loader = false;
      this.uniquenessData = res.data;
      this.insertDate = (moment.utc(res.data[0].insert_dt).format('MM-DD-YYYY h:mm:ss'));
      //  // // console.log(uniquenessData, uniquenessData.length);
      const obj2 = {};
      const obj1 = {};
      for (let key of this.uniquenessData) {
        obj1[key.table] = key.uniquenessScore;
        obj2[key.table] = key.listOfAttributes;
      }
      for (let i = 0; i < this.uniquenessData.length; i++) {
        this.arrUnique.push(this.uniquenessData[i].listOfAttributes)
      }
      // // console.log(uniquenessData.length);

      this.uniquenessResult = obj1;
      // // console.log(obj2);
      // const chartDataUniqueness = Object.entries(this.uniquenessResult)
      //   .sort(([, v1]: any, [, v2]: any) => v2 - v1)
      //   .reduce((obj, [k, v]) => ({
      //     ...obj,
      //     [k]: v
      //   }), {});
      //  arrUnique.push(obj2)
      // // console.log(this.arrUnique);
      this.lastN = this.firstN + 5;
      Object.keys(this.uniquenessResult).forEach(key => {
        //  // // // console.log(key, chartDataRev[key]);
        this.globalXAIDataUniqueness.push(this.uniquenessResult[key].toFixed(2));
        this.globalXAILabelsUniqueness.push(key);
      });
      // // // console.log(this.globalXAIDataUniqueness);

      this.max = this.utilsService.round(Math.ceil(Math.max(...this.globalXAIDataUniqueness)));
      // // // console.log("Max1",this.max);
      this.globalChartDataUniqueness = [{ data: this.globalXAIDataUniqueness.slice(this.firstN, this.lastN), barThickness: 10, tooltip: (this.arrUnique).slice(this.firstN, this.lastN) }];
      //  // // console.log(this.globalChartDataUniqueness);

      this.globalChartLabelsUniqueness = this.globalXAILabelsUniqueness.slice(this.firstN, this.lastN);
      this.globalLengthUniqueness = this.globalXAILabelsUniqueness.length;
      this.chartReady2 = true;



    })
  }
  getTimelinessData() {
    const obj = { model: this.projName }
    this.mlopsService.getTimeliness(obj).subscribe((res) => {
      // console.log(res.data);
      this.timelinessData = res.data;
    })
  }
  getStatus(value) {
    // console.log(value);
    if (value == 'Not_Updated') {
      return true;
    } else {
      return false;
    }
  }
  callAll() {

  }

}
