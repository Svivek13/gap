import { Component, Injectable, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MlopsService } from 'src/app/mlops.service';
import { get as _get, reduce as _reduce, isEmpty as _isEmpty, has as _has } from 'lodash';
import { UtilsService } from 'src/app/services/utils.service';
import { DataService } from 'src/app/services/data.service';
import cleanDeep from 'clean-deep';
import { EventEmitter } from '@angular/core';
import { tourDetails } from 'src/shared/tour';
import { TrackService } from 'src/app/track/track.service';
import { map, startWith } from 'rxjs/operators';
import { HorizontalBarChartComponent } from 'src/app/common-components/horizontal-bar-chart/horizontal-bar-chart.component';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AESEncryptDecryptServiceService } from 'src/app/services/aesencrypt-decrypt-service.service';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DriftFeatureComponent } from '../drift-feature/drift-feature.component';
import { ThemeService } from 'src/app/theme/theme.service';

@Component({
  selector: 'app-drift',
  templateUrl: './drift.component.html',
  styleUrls: ['./drift.component.scss'],
})
@Injectable({
  providedIn: 'root',
})
export class DriftComponent implements OnInit, OnDestroy {
  @ViewChild(HorizontalBarChartComponent) chart;
  @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;
  public featureTrendData: any;
  public featureTrendDataRev: any;
  public featureTrendLabels: any = [];
  public featureTrendLabelsRev: any = [];
  public driftTrendData: any;
  public driftTrendDataRev: any;
  public driftTrendLabels: any = [];

  // Density chart
  densityTrendData: any;
  densityTrendDataRev: any;


  // Horizontal Bar Chart
  public horBarChartData: ChartDataSets[];
  public horBarChartDataRev: ChartDataSets[];
  public horBarChartLabels: string[];
  public horBarChartLabelsRev: string[];
  public horBarChartColors: any[] = [{ backgroundColor: [] }];
  projectId: string;

  @Input() execId;
  @Input() projName: string;
  @Input() modelObj: any;
  featuresLength: number;
  featuresLengthRev: number;
  firstN = 0;
  lastN: number;
  driftFeaturesData: any = [];
  driftFeaturesLabels: any = [];
  barClickedIndex: any;
  allExecIds: any = [];
  showAllExec: any;
  lastvalue = [0, 0];
  overallDriftRev: string;
  driftTrendLabelsRev: any = [];
  driftFeaturesDataRev: any = [];
  driftFeaturesLabelsRev: any = [];
  chartReady1: boolean = false;
  test: any;
  train: any;
  testCardRev: any;
  trainCardRev: any;
  horBarChartReady1: boolean;
  featureDataRev: any;
  featureData: any;
  sortFeatureData: {};
  sortFeatureDataRev: {};
  driftAvailable2: boolean;
  modelObjData: any;

  @Input() set pId(value: string) {
    this.projectId = value;
    // this.execId = undefined;
    // // console.log('projectId: ', this.projectId, ' execId: ', this.execId);
    this.latestExecObj = undefined;
    // this.fetchDriftData();
    this.callDataDrift();
  }

  loader: boolean;
  overallDrift = '0%';
  chartReady = false;

  featureName: string;
  featureNameRev: string;
  featureTrendObj: any;
  selectedFeatureData: any;
  densityChartReady: boolean;
  densityChartReady1: boolean;
  horBarChartReady: boolean;
  driftAvailable: boolean;
  errorMsg: string;
  featureErrorMsg: string;
  driftProbability: boolean = false;
  driftRevenue: boolean = false;
  dataTill: string;
  @Output() dataTillEvent = new EventEmitter<string>();
  latestExecId: any;
  tours: any;
  modelSearchForm: FormGroup;
  latestExecObj: any;
  @Output() xaiTourEvent = new EventEmitter<string>();
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  public comboChartOptions: ChartOptions;
  ticksColor = 'rgba(130,131,132,255)';
  gridsColor = 'rgba(199,205,207,255)';
  public comboChartLegend = true;
  public comboColors = [
    { backgroundColor: 'rgba(170,177,196,0.6)' },
    { backgroundColor: 'rgba(242, 123, 80, 0.6)' },
    {
      borderColor: 'rgb(170,177,196)',
      backgroundColor: 'transparent',
      pointBackgroundColor: 'white'
    },
    {
      borderColor: '#F27B50',
      backgroundColor: 'transparent',
      pointBackgroundColor: 'white'
    }
  ];
  featureLabel: any = {};
  featureLabelRev: any = {};
  modelFilteredOption: Observable<string[]>;
  brandFilteredOption: Observable<string[]>;
  cardFilteredOption: Observable<string[]>;
  locattionFilteredOption: Observable<string[]>;
  modelOption: any = ["Direct model"]
  brandOption: any = [];
  locationOption: any = ["US", "CA", "GB", "JP"]
  cardOption: any = [{ "value": "card", "displayText": "Card" }, { "value": "noncard", "displayText": "Non-Card" }]
  model: any = 'Card_probability_BRFS';
  card: any = "card";
  brand: any = 'BRFS';
  flag: boolean = false;
  showDMDrift: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private mlopsService: MlopsService,
    private utilsService: UtilsService,
    private dataService: DataService,
    private trackService: TrackService,
    private aESEncryptDecryptServiceService: AESEncryptDecryptServiceService,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private themeService: ThemeService
  ) {
    this.modelSearchForm = this.formBuilder.group({
      model: new FormControl(''),
      brand: new FormControl(''),
      card: new FormControl(''),
      location: new FormControl(''),
    });

    let data;
    if (this.activatedRoute.snapshot.paramMap.get('data') !== null) {
      data = this.aESEncryptDecryptServiceService.decrypt(
        this.activatedRoute.snapshot.paramMap.get('data')
      );
      data = JSON.parse(data);
    }
    if (_has(data, 'execObj')) {
      const latestPayload = _get(data, 'execObj');
      this.latestExecObj = JSON.parse(latestPayload);
      // // console.log(this.latestExecObj, 'sjdhagfef');
    }
  }

  ngOnInit(): void {
   // console.log((this.modelObj));
    if(this.modelObj != undefined){
      this.modelObjData = JSON.parse(this.modelObj);
    }else{
      this.modelObjData = this.modelObj;
    }
    
   // console.log(this.modelObjData.brand);
    
    if (this.modelObjData != undefined) {
      if (this.modelObjData.card_type == 'card') {
        this.modelSearchForm.patchValue({
          //  model: { "value": "DM", "displayText": "Direct Mail" },
          card: { "value": this.modelObjData.card, "displayText": "Card" },
         // brand: this.modelObjData.brand,
        });
      } else {
        this.modelSearchForm.patchValue({
          //  model: { "value": "DM", "displayText": "Direct Mail" },
         // brand: this.modelObjData.brand,
          card: { "value": this.modelObjData.card, "displayText": "Non-Card" },
        });
      }

    } else {
      this.modelSearchForm.patchValue({
        model: { "value": "DM", "displayText": "Direct Mail" },
        // brand: 'AT',
        card: { "value": "card", "displayText": "Card" },
        // location: "US"
      });
    }
    this.tours = tourDetails;
    this.getLatestExecObj();
    const colors = this.mlopsService.fetchChartColorTheme();
    this.ticksColor = colors.ticksColor;
    this.gridsColor = colors.gridsColor;
    // this.testTrainChartOptions();
    this.createForm();
    this.subjectUpdates();
    // if coming from summary run
    // if (this.dataService.summaryExecRun) {
    //   this.execId = this.dataService.summaryExecRun.execId;
    //   this.projectId = this.dataService.summaryExecRun.projectId;
    // }
    // this.fetchDriftData(this.projectId, this.execId);
    // this.modelFilteredOption = this.modelSearchForm.get('model')
    //   .valueChanges.pipe(
    //     startWith(''),
    //     map((name) => this._filtermodel(name))
    //   );
    // this.brandFilteredOption = this.modelSearchForm.get('brand')
    //   .valueChanges.pipe(
    //     startWith(''),
    //     map(value => typeof value === 'string' ? value : value.value),
    //     map((name) => this._filterbrand(name))
    //   );

    this.modelFilteredOption = this.modelSearchForm.get('card')
      .valueChanges.pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.value),
        map((name) => this._filtercard(name))
      );
    //this.fetchDriftData();


  }
  createForm() {


  }
  // private _filtermodel(name: string): any {
  //   const filterValue = name.toLowerCase();
  //   return this.modelOption.filter(
  //     (option) => option.displayText.toLowerCase().indexOf(filterValue) >= 0
  //   );
  // }
  private _filterbrand(name: string): any {
    const filterValue = name.toLowerCase();
    return this.brandOption.filter(
      (option) => option.toLowerCase().indexOf(filterValue) >= 0
    );
  }
  private _filterLocation(name: string): any {
    const filterValue = name.toLowerCase();
    return this.locationOption.filter(
      (option) => option.toLowerCase().indexOf(filterValue) >= 0
    );
  }
  private _filtercard(name: string): any {
    const filterValue = name.toLowerCase();
    return this.cardOption.filter(
      (option) => option.displayText.toLowerCase().indexOf(filterValue) >= 0
    );
  }
  displayFnModel(subject) {
    // this.model = subject.value;
    return subject.displayText ? subject.displayText : undefined;
  }
  displayFnBrand(subject) {
    this.brand = subject;
    return subject ? subject : undefined;
  }
  displayFnLocation(subject) {
    return subject ? subject : undefined;
  }
  displayFnCard(subject) {
    this.card = subject;
    return subject.displayText ? subject.displayText : undefined;
  }
  subjectUpdates() {
    this.mlopsService.themeSubject.subscribe(data => {
      const colors = this.mlopsService.fetchChartColorTheme();
      this.ticksColor = colors.ticksColor;
      this.gridsColor = colors.gridsColor;
      //  this.testTrainChartOptions();
    });
  }
  showProbability() {
    this.driftRevenue = false;
    this.driftProbability = true;

    const obj = {
      model: this.projName,
      brand: this.modelSearchForm.value.brand,
      card: this.modelSearchForm.value.card.value,
      location: this.modelSearchForm.value.location,
      horBarChartReady: this.horBarChartReady,
      horBarChartData: this.horBarChartData,
      horBarChartLabels: this.horBarChartLabels,
      horBarChartColors: this.horBarChartColors,
      featuresLength: this.featuresLength,
      driftAvailable: this.driftAvailable,
      chartReady: this.chartReady,
      featureTrendData: this.featureTrendData,
      featureTrendLabels: this.featureTrendLabels,
      featureName: this.featureName,
      densityChartReady: this.densityChartReady,
      densityTrendData: this.densityTrendData,
      driftFeaturesData: this.driftFeaturesData,
      driftFeaturesLabels: this.driftFeaturesLabels,
      driftProbability: true,
      featureTrendObj: this.featureTrendObj,
      driftRevenue: false,
      sortFeatureData: this.sortFeatureData,
      featureLabel: this.featureLabel
    }
    this.openDriftFeature(obj)
  }

  showRevenue() {
    //this.fetchtesttrainDataCoreCardRev();
    this.driftProbability = false;
    this.driftRevenue = true;
    const obj1 = {
      model: this.projName,
      brand: this.modelSearchForm.value.brand,
      card: this.modelSearchForm.value.card.value,
      horBarChartReady1: this.horBarChartReady1,
      horBarChartColors: this.horBarChartColors,
      horBarChartDataRev: this.horBarChartDataRev,
      horBarChartLabelsRev: this.horBarChartLabelsRev,
      chartReady1: this.chartReady1,
      featureTrendObj: this.featureTrendObj,
      featuresLengthRev: this.featuresLengthRev,
      featureTrendDataRev: this.featureTrendDataRev,
      featureTrendLabelsRev: this.featureTrendLabelsRev,
      featureNameRev: this.featureNameRev,
      driftAvailable2: this.driftAvailable2,
      driftFeaturesDataRev: this.driftFeaturesDataRev,
      driftFeaturesLabelsRev: this.driftFeaturesLabelsRev,
      driftRevenue: true,
      driftProbability: false,
      densityChartReady1: this.densityChartReady1,
      densityTrendDataRev: this.densityTrendDataRev,
      sortFeatureDataRev: this.sortFeatureDataRev,
      driftFeaturesLabels: this.driftFeaturesLabels,
      featureLabelRev: this.featureLabelRev
    }
    this.openDriftFeature(obj1)
  }

  getBrandFilter() {
    this.brandOption = [];
    const obj = { model: this.projName }
    this.mlopsService.getBrandDMDropdown(obj).subscribe((res) => {
      this.brandOption = res.data;
     // console.log(this.modelObjData.brand);
      if (this.modelObjData == undefined) {
        this.modelSearchForm.patchValue({
          brand: this.brandOption[0]
        });
      } else {
        this.modelSearchForm.patchValue({
          brand: this.modelObjData.brand
        });

      }

      this.brandFilteredOption = this.modelSearchForm.get('brand')
        .valueChanges.pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value.value),
          map((name) => {
            return name ? this._filterbrand(name) : this.brandOption.slice();
          }),
          map((name) => this._filterbrand(name))
        );
    })
   // console.log(this.modelSearchForm);
    
  }
  getLocationFilter() {
    const obj = { model: this.projName }
    this.mlopsService.getLocationDMDropdown(obj).subscribe((res) => {
      this.locationOption = res.data;
     // console.log(this.modelObjData.location);
      if (this.modelObjData == undefined) {
        this.modelSearchForm.patchValue({
          location: this.locationOption[0]
        });
       
      } else {
        this.modelSearchForm.patchValue({
          location: this.modelObjData.location
        });
      }

      this.locattionFilteredOption = this.modelSearchForm.get('location')
        .valueChanges.pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value.value),
          map((name) => {
            return name ? this._filterLocation(name) : this.locationOption.slice();
          }),
          map((name) => this._filterLocation(name))
        );
    })
  }

  fetchDriftDataGraphs() {
    this.loader = true;
    this.driftAvailable = false;
    this.chartReady1 = false;
    this.horBarChartReady = false;
    this.driftFeaturesLabels = [];
    this.driftFeaturesData = [];
    this.driftTrendLabels = [];
    const driftTrendData = [];
    const driftTrendtooltips = [];
    this.featureTrendLabels = [];
    const payload = cleanDeep({
      model: this.projName, brand: this.modelSearchForm.value.brand, location: this.modelSearchForm.value.location,
    });

    this.mlopsService.driftDataData(payload).subscribe((res) => {
      this.loader = false;
      this.driftAvailable = true;
      const data = res.data;

      // this.allExecIds = res.data.driftTrend.map((i) => i.execId);
      // this.latestExecId = res.data.latestExecution;
      // this.findDataTill(res.data.driftTrend);
      this.overallDrift = (res.data[0].overall_drift * 100).toFixed(2) + '%';
      driftTrendData.push((res.data[0].overall_drift * 100).toFixed(2));
      driftTrendtooltips.push(moment.utc(res.data[0].scoring_data_run_date).format('MM/DD/YYYY'));
      this.driftTrendLabels.push(moment.utc(res.data[0].scoring_data_run_date).format('MM/DD/YYYY'));
      const featureObj = {};

      for (let key of data) {
        featureObj[key.feature] = key.feature_drift;
        this.featureLabel[key.feature] = (key.scoring_data_run_date)
      }
      const sortFeature = Object.entries(featureObj)
        .sort(([, v1]: any, [, v2]: any) => v2 - v1)
        .reduce((obj, [k, v]) => ({
          ...obj,
          [k]: v
        }), {});
      Object.keys(sortFeature).forEach(key => {
        this.driftFeaturesData.push(((sortFeature[key]) * 100).toFixed(2));
        this.driftFeaturesLabels.push(key);

      });
      this.sortFeatureData = sortFeature
      this.driftTrendData = [
        {
          data: driftTrendData,
          borderWidth: 1.5,
          lineTension: 0,
          tooltip: driftTrendtooltips,
        },
      ];
      this.chartReady = true;
      this.horBarChartReady = true;
      this.loader = false;


      this.lastN = this.firstN + 5;
      this.horBarChartData = [
        {
          data: this.driftFeaturesData.slice(this.firstN, this.lastN),
          barThickness: 15,
        },
      ];
      this.horBarChartLabels = this.driftFeaturesLabels.slice(
        this.firstN,
        this.lastN
      );
      this.featuresLength = this.driftFeaturesLabels.length;
      this.featuresColors();
      this.changeBarColorClicked(0);
      this.featureTrendObj = this.driftFeaturesData[0];
      this.featureName = this.driftFeaturesLabels[0];
      this.featureData = sortFeature[this.featureName];
      // featureData.push(res.data[0].feature_drift);
      const featureTrendTooltips = [];
      featureTrendTooltips.push(moment.utc(res.data[0].scoring_data_run_date).format('MM/DD/YYYY'));
      // const featureTrendTooltips = res.data.featureTrend
      //   .map((i) => i.dateTime)
      //   .map((element) => this.utilsService.formatDateTime(element));

      this.featureTrendData = [
        {
          data: ((this.featureData) * 100).toFixed(2),
          borderWidth: 1.5,
          lineTension: 0,
          tooltip: featureTrendTooltips,
        },
      ];
      this.featureTrendLabels.push(moment.utc(res.data[0].scoring_data_run_date).format('MM/DD/YYYY'));

      this.horBarChartReady = true;

    })
  }
  fetchDriftData() {

    this.loader = true;
    this.driftAvailable = false;
    this.driftAvailable2 = false;
    this.chartReady1 = false;
    this.horBarChartReady = false;
    this.horBarChartReady1 = false;
    const driftTrendData = [];
    const driftTrendtooltips = [];
    const driftTrendDataRev = [];
    const driftTrendtooltipsRev = [];
    this.driftFeaturesLabels = [];
    this.driftFeaturesData = [];
    this.driftTrendLabels = [];
    this.driftFeaturesLabelsRev = [];
    this.driftFeaturesDataRev = [];
    this.driftTrendLabelsRev = [];

    this.featureTrendLabels = [];
   // console.log("Brand", this.modelSearchForm.value.brand, "Card", this.modelSearchForm.value.card.value);

    const payload = cleanDeep({
      model: this.projName, brand: this.modelSearchForm.value.brand, card_type: this.modelSearchForm.value.card.value,
      model_type: "probability"
    });
    const payload2 = cleanDeep({
      model: this.projName, brand: this.modelSearchForm.value.brand, card_type: this.modelSearchForm.value.card.value,
      model_type: "revenue"
    });
    this.mlopsService.driftDataData(payload).subscribe((res) => {
      this.loader = false;
      this.driftAvailable = true;
      const data = res.data;

      // this.allExecIds = res.data.driftTrend.map((i) => i.execId);
      // this.latestExecId = res.data.latestExecution;
      // this.findDataTill(res.data.driftTrend);
      this.overallDrift = (res.data[0].overall_drift * 100).toFixed(2) + '%';
      driftTrendData.push((res.data[0].overall_drift * 100).toFixed(2));
      driftTrendtooltips.push(moment.utc(res.data[0].scoring_data_run_date).format('MM/DD/YYYY'));
      this.driftTrendLabels.push(moment.utc(res.data[0].scoring_data_run_date).format('MM/DD/YYYY'));
      const featureObj = {};

      for (let key of data) {
        featureObj[key.feature] = key.feature_drift;
        this.featureLabel[key.feature] = (key.scoring_data_run_date)
      }
      const sortFeature = Object.entries(featureObj)
        .sort(([, v1]: any, [, v2]: any) => v2 - v1)
        .reduce((obj, [k, v]) => ({
          ...obj,
          [k]: v
        }), {});
      Object.keys(sortFeature).forEach(key => {
        this.driftFeaturesData.push(((sortFeature[key]) * 100).toFixed(2));
        this.driftFeaturesLabels.push(key);

      });

      this.sortFeatureData = sortFeature
      this.driftTrendData = [
        {
          data: driftTrendData,
          borderWidth: 1.5,
          lineTension: 0,
          tooltip: driftTrendtooltips,
        },
      ];
      this.chartReady = true;
      this.horBarChartReady = true;
      this.loader = false;

      //  // console.log("OverallDrift: ", res.data[0].overall_drift, this.overallDrift);


      this.lastN = this.firstN + 5;
      this.horBarChartData = [
        {
          data: this.driftFeaturesData.slice(this.firstN, this.lastN),
          barThickness: 15,
        },
      ];
      this.horBarChartLabels = this.driftFeaturesLabels.slice(
        this.firstN,
        this.lastN
      );
      this.featuresLength = this.driftFeaturesLabels.length;
      this.featuresColors();
      this.changeBarColorClicked(0);
      this.featureTrendObj = this.driftFeaturesData[0];
      this.featureName = this.driftFeaturesLabels[0];
      this.featureData = sortFeature[this.featureName];
      // featureData.push(res.data[0].feature_drift);
      const featureTrendTooltips = [];
      featureTrendTooltips.push(moment.utc(res.data[0].scoring_data_run_date).format('MM/DD/YYYY'));
      // const featureTrendTooltips = res.data.featureTrend
      //   .map((i) => i.dateTime)
      //   .map((element) => this.utilsService.formatDateTime(element));

      this.featureTrendData = [
        {
          data: ((this.featureData) * 100).toFixed(2),
          borderWidth: 1.5,
          lineTension: 0,
          tooltip: featureTrendTooltips,
        },
      ];
      this.featureTrendLabels.push(moment.utc(res.data[0].scoring_data_run_date).format('MM/DD/YYYY'));

      this.horBarChartReady = true;

    })
    this.mlopsService.driftDataData(payload2).subscribe((res) => {
      this.loader = false;
      this.driftAvailable2 = true;
      const data = res.data;
      // console.log(data);
      this.overallDriftRev = (res.data[0].overall_drift * 100).toFixed(2) + '%';
      driftTrendDataRev.push((res.data[0].overall_drift * 100).toFixed(2));
      driftTrendtooltipsRev.push(moment.utc(res.data[0].scoring_data_run_date).format('MM/DD/YYYY'));
      this.driftTrendLabelsRev.push(moment.utc(res.data[0].scoring_data_run_date).format('MM/DD/YYYY'));
      const featureObj = {};
      for (let key of data) {
        featureObj[key.feature] = key.feature_drift;
        this.featureLabelRev[key.feature] = (key.scoring_data_run_date);
      }
      const sortFeature = Object.entries(featureObj)
        .sort(([, v1]: any, [, v2]: any) => v2 - v1)
        .reduce((obj, [k, v]) => ({
          ...obj,
          [k]: v
        }), {});
      Object.keys(sortFeature).forEach(key => {
        this.driftFeaturesDataRev.push(((sortFeature[key]) * 100).toFixed(2));
        this.driftFeaturesLabelsRev.push(key);

      });
      this.sortFeatureDataRev = sortFeature
      this.driftTrendDataRev = [
        {
          data: driftTrendDataRev,
          borderWidth: 1.5,
          lineTension: 0,
          tooltip: driftTrendtooltipsRev,
        },
      ];
      this.chartReady1 = true;
      this.horBarChartReady1 = true;
      this.loader = false;
      // console.log("OverallDrift: ", res.data[0].overall_drift, driftTrendDataRev,this.driftTrendLabelsRev);
      this.lastN = this.firstN + 5;
      this.horBarChartDataRev = [
        {
          data: this.driftFeaturesDataRev.slice(this.firstN, this.lastN),
          barThickness: 15,
        },
      ];
      this.horBarChartLabelsRev = this.driftFeaturesLabelsRev.slice(
        this.firstN,
        this.lastN
      );
      this.featuresLengthRev = this.driftFeaturesLabelsRev.length;
      this.featuresColors();
      this.changeBarColorClicked(0);
      // this.featureTrendObj = res.data.featureTrend;
      this.featureNameRev = this.driftFeaturesLabelsRev[0];
      this.featureDataRev = sortFeature[this.featureNameRev];
      // featureDataRev.push(this.featureNameRev);
      const featureTrendTooltipsRev = [];
      featureTrendTooltipsRev.push(moment.utc(res.data[0].scoring_data_run_date).format('MM/DD/YYYY'));
      // const featureTrendTooltips = res.data.featureTrend
      //   .map((i) => i.dateTime)
      //   .map((element) => this.utilsService.formatDateTime(element));

      this.featureTrendDataRev = [
        {
          data: ((this.featureDataRev) * 100).toFixed(2),
          borderWidth: 1.5,
          lineTension: 0,
          tooltip: featureTrendTooltipsRev,
        },
      ];
      this.featureTrendLabelsRev.push(moment.utc(res.data[0].scoring_data_run_date).format('MM/DD/YYYY'));

      this.horBarChartReady1 = true;



    })


  }
  submitDrift() {
    this.model = this.projName;


    if (this.projName == 'Direct_Mail') {
      this.showDMDrift = true;
      this.fetchDriftData();
    } else {
      this.showDMDrift = false;
      // this.getBrandFilter();
      // this.getLocationFilter();
      this.fetchDriftDataGraphs()
    }
  }
  callDataDrift() {
    this.model = this.projName;

    if (this.projName == 'Direct_Mail') {
      this.showDMDrift = true;
      this.getBrandFilter();
      setTimeout(() => {
        this.fetchDriftData();
      }, 3000);
    } else {
      this.showDMDrift = false;
      this.getBrandFilter();
      this.getLocationFilter();
      setTimeout(() => {
        this.fetchDriftDataGraphs();
      }, 3000);
      
    }
  }

  featuresColors() {
    for (let i = 0; i < this.horBarChartData[0].data.length; i++) {
      this.horBarChartColors[0].backgroundColor[i] = 'rgba(248,189,167,0.6)';
    }
  }
  featuresColorsRev() {
    for (let i = 0; i < this.horBarChartDataRev[0].data.length; i++) {
      this.horBarChartColors[0].backgroundColor[i] = 'rgba(248,189,167,0.6)';
    }
  }

  changeBarColorClicked(index) {
    this.horBarChartColors[0].backgroundColor[index] = 'rgba(242,123,80,0.6)';
  }



  findDataTill(listArg: any) {
    const list = [...listArg].reverse();
    this.dataTill = this.utilsService.formatDateTime(list[0].dateTime);
    this.dataTillEvent.emit(this.dataTill);
  }

  getLatestExecObj() {
    // this.mlopsService.getLatestExec({ projectId: this.projectId }).subscribe(
    //   (response) => {
    //     this.latestExecObj = response.data;
    //     // // console.log(response.data);
    //   },
    //   (err) => {
    //     // console.log('error occurred');
    //   }
    // );
  }


  onStep24Next() {
    this.xaiTourEvent.emit('xaiTour');
  }

  getDriftValue(event) {
    // console.log(event,event.active.length);

    if (event.active.length > 0) {
      const execIdSelected = this.allExecIds[event.active[0]._index];
      // console.log(execIdSelected, 'exec id selectedd');
      this.showAllExec = 'y';
      this.fetchDriftData();
    }
  }

  openDriftFeature(obj) {
    const active = this.themeService.getActiveTheme();
    let panelClass;
    if (active.name === 'light') {
      panelClass = 'custom-dialog-class';
    } else {
      panelClass = 'dark-dialog-class';
    }
    const dialogRef = this.dialog.open(DriftFeatureComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '96%',
      width: '97%',
      data: {
        data: obj
      },
      panelClass
    });
    dialogRef.afterClosed().subscribe(() => {
    });
  }

  public ngOnDestroy(): void {
    // This aborts all HTTP requests.
    this.ngUnsubscribe.next();
    // This completes the subject properlly.
    this.ngUnsubscribe.complete();
  }
}
