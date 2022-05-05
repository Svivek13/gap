import { ChangeDetectorRef, Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { map, startWith } from 'rxjs/operators';
import { MlopsService } from 'src/app/mlops.service';
import { get as _get, map as _map, find as _find, isEmpty as _isEmpty, trim as _trim, has as _has } from 'lodash';
import { tourDetails } from 'src/shared/tour';
import { JoyrideService } from 'ngx-joyride';
import { UtilsService } from 'src/app/services/utils.service';
import { TrackService } from 'src/app/track/track.service';
import { AESEncryptDecryptServiceService } from 'src/app/services/aesencrypt-decrypt-service.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-explainability',
  templateUrl: './explainability.component.html',
  styleUrls: ['./explainability.component.scss']
})

export class ExplainabilityComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() projName: string;
  max: number;
  max1: number;
  max2: number;
  max3: number;
  max4: number;
  max5: number;
  featuresLength: any;
  localFeatureData: any;
  localFeatureLabels: any;
  colorLength: number;
  colorsGenerated: any;
  targetMin: number;
  targetMax: number;
  targetMid1: number;
  oldXaxis: any;
  oldYaxis: any;
  uniqueTargetValues: number[];
  scatterLoader: boolean;
  allTargetValues: any;
  highlightRow: any;
  tabeReady: boolean;
  sl: number[];
  targets: any[];
  feature1Values: any;
  feature1Value: any;
  feature2Values: any;
  feature2Value: any;
  value1Ready = true;
  value2Ready = true;
  rawData: any;
  xaiSourceCopy: any;
  iconText = 'search';
  categoryDropdowns: string[];
  xaiDataRev: any;
  showPPXAI: boolean;
  showSegment: boolean;
  label: string = '';
  fetureHeading: string = '';
  descriptionCat: string = '';
  @Input() set pId(value: string) {
    this.count = 0;
    this.projectId = value;
    this.getLocationFilter();
    this.getBrandFilter();
    setTimeout(() => {
      this.getExplainability();
    }, 3000)
    // this.getLatestExecObj();
  }
  loader: boolean = false;
  globalChartData: any;
  globalChartLabels: any;
  globalChartDataRev: any;
  globalChartLabelsRev: any;
  globalChartDataTopProb: any;
  globalChartLabelsTopProb: any;
  globalChartDataTopRev: any;
  globalChartLabelsTopRev: any;
  globalChartDataSegProb: any;
  globalChartLabelsSegProb: any;
  globalChartDataSegRev: any;
  globalChartLabelsSegRev: any;
  featureImpData: any;
  featureImpLabels: any;
  xaxis: any;
  yaxis: any;
  ticksColor = 'rgba(242, 123, 80, 1)';
  gridsColor = 'rgba(199,205,207,255)';
  public globalColors: any[] = [{ backgroundColor: [] }];
  // Gauge chart
  gaugeType = 'arch';
  gaugeValue = 58.3;
  gaugeAppendText = '%';
  // Scatter Chart
  public scatterChartOptions: ChartOptions = {
    responsive: true,
    legend: { display: false },
    scales: {
      xAxes: [{
        gridLines: {
          display: true,
          color: this.gridsColor
        },
        scaleLabel: {
          display: true,
          fontSize: 10,
          fontColor: this.ticksColor,
          fontFamily: '"Montserrat", sans-serif'
        },
        ticks: {
          fontColor: this.ticksColor,
          fontFamily: '"Montserrat", sans-serif'
        }
      }], yAxes: [{
        gridLines: {
          display: true,
          color: this.gridsColor
        },
        scaleLabel: {
          display: true,
          fontSize: 10,
          fontColor: this.ticksColor,
          fontFamily: '"Montserrat", sans-serif'
        },
        ticks: {
          beginAtZero: true,
          maxTicksLimit: 5,
          fontColor: this.ticksColor,
          fontFamily: '"Montserrat", sans-serif'
        }
      }]
    },
  };
  public scatterChartData: ChartDataSets[];
  public flattened: ChartDataSets[];
  public scatterChartType: ChartType = 'scatter';
  xaiData: any;
  chartReady: boolean;
  chartReadyRev: boolean;
  projectId: string;
  xValues: any;
  yValues: any;
  scatterChartReady: boolean;
  availableCombinations: any;
  scatterData: any;
  featureChartReady = false;
  showFeatureImp: boolean;
  count = 0;
  latestExec: any;
  selectedkey: string;
  firstN = 0;
  lastN: number;
  globalXAIData: any = [];
  globalLength: any;
  globalLengthRev: any;
  globalLengthTopProb: any;
  globalLengthTopRev: any;
  globalLengthSegProb: any;
  globalLengthSegRev: any;
  globalXAILabels: any = [];
  globalXAIDataRev: any = [];
  globalXAILabelsRev: any = [];
  globalXAIDataTopRev: any = [];
  globalXAILabelsTopRev: any = [];
  globalXAIDataTopProb: any = [];
  globalXAILabelsTopProb: any = [];
  globalXAIDataSegRev: any = [];
  globalXAILabelsSegRev: any = [];
  globalXAIDataSegProb: any = [];
  globalXAILabelsSegProb: any = [];
  tours: any;
  featureMinValue: any;
  featureMaxValue: any;
  @Output() loadDriftEvent = new EventEmitter<string>();
  public scatterChartColors: any;
  xaiColumns: any;
  xaiSource: any;
  feature1: any;
  feature2: any;
  features: any[];
  modelSearchForm: FormGroup;
  formGroupImpRange: FormGroup;
  formGroupSegment: FormGroup;
  formGroupCategory: FormGroup;
  operators = ['Equals', 'Greater than', 'Less than', 'Not equals'];
  operator1 = this.operators[0];
  operator2 = this.operators[0];
  target: any;
  importanceRangeOption: any = [{ "value": "top", "displayText": "High (Top 10%)" }, { "value": "bottom", "displayText": "Low  (Bottom 10%)" }];
  filteredImpRngOption: Observable<string[]>;
  segmentOption: any = [{ "value": "online_new", "displayText": "Online New" }, { "value": "online_retained", "displayText": "Online Retained" }, { "value": "online_reactivated", "displayText": "Online Rectivated" }, { "value": "retail_new", "displayText": "Retail New" }, { "value": "retail_retained", "displayText": "Retail Retained" }, { "value": "retail_reactivated", "displayText": "Retail Rectivated" }]
  segmentFilterOption: Observable<string[]>;
  categoryFilteredOption: Observable<string[]>;
  modelFilteredOption: Observable<string[]>;
  brandFilteredOption: Observable<string[]>;
  cardFilteredOption: Observable<string[]>;
  locationFilteredOption: Observable<string[]>;
  modelTypeFilteredOption: Observable<string[]>;
  modelOption: any = [{ "value": "Direct_Mail", "displayText": "Direct Mail" }, { "value": "PP", "displayText": "Purchase Propensity" }, { "value": "Division_Preference", "displayText": "Division Preference" }];
  brandOption: any = [];
  cardOption: any = [{ "value": "card", "displayText": "Card" }, { "value": "noncard", "displayText": "Non-Card" }];
  modelType: any =[];
  locationOption: any = [];
  importanceRange: any = 'top';
  range: any = 'top';
  segmentOptionFC: any;
  model: any = "DM";
  card: any = { "value": "card", "displayText": "Card" };
  brand: any = "AT";
  location: any = "US";
  selectedRange: string = 'Higher'
  options: any;
  showDMXAI: boolean;

  constructor(private mlopsService: MlopsService, private activatedRoute: ActivatedRoute,
    private router: Router, private utilsService: UtilsService,
    private readonly joyrideService: JoyrideService,
    private trackService: TrackService, private cdRef: ChangeDetectorRef,
    private aESEncryptDecryptServiceService: AESEncryptDecryptServiceService,
    private formBuilder: FormBuilder
  ) {
    this.modelSearchForm = this.formBuilder.group({
      model: new FormControl(''),
      brand: new FormControl(''),
      card: new FormControl(''),
      location: new FormControl(''),
      model_type: new FormControl('')
    });
    this.modelSearchForm.patchValue({
      model: { "value": "DM", "displayText": "Direct Mail" },
      // brand: "AT",
      card: { "value": "card", "displayText": "Card" },
    //  model_type: "PP_3_months"
    });
    let data;
    if (this.activatedRoute.snapshot.paramMap.get('data') !== null) {
      data = this.aESEncryptDecryptServiceService.decrypt(this.activatedRoute.snapshot.paramMap.get('data'));
      data = JSON.parse(data);
    }

    this.projectId = _get(data, 'id');
    if (_has(data, 'execObj')) {
      const xaiPayload = _get(data, 'execObj');
      this.latestExec = JSON.parse(xaiPayload);
    }
  }

  ngOnInit(): void {
    const colors = this.mlopsService.fetchChartColorTheme();
    this.ticksColor = colors.ticksColor;
    this.gridsColor = colors.gridsColor;
    this.tours = tourDetails;
    this.subjectUpdates();
    this.modelType = [];
   
    //  this.getLatestExecObj();
    this.createForm();
    // this.projName = sessionStorage.getItem('projectName')
    this.formGroupImpRange.setValue({ importanceRange: { "value": "top", "displayText": "High (Top 10%)" } });
    this.formGroupSegment.setValue({ segmentOptionFC: { "value": "online_new", "displayText": "Online New" } })
    this.filteredImpRngOption = this.formGroupImpRange.get('importanceRange')
      .valueChanges.pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.value),
        map((name) => this._filterImpRange(name))
      );
    this.segmentFilterOption = this.formGroupSegment.get('segmentOptionFC')
      .valueChanges.pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.value),
        map((name) => this._filterSegment(name))
      );
    this.categoryFilteredOption = this.formGroupCategory.get('category')
      .valueChanges.pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.value),
        map((name) => {
          return name ? this._filtermodel(name) : this.options.slice();
        }),
        map((name) => this._filtermodel(name))
      );

    this.modelFilteredOption = this.modelSearchForm.get('model')
      .valueChanges.pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.value),
        map((name) => {
          return name ? this._filtermodel(name) : this.options.slice();
        }),
        map((name) => this._filtermodel(name))
      );

    this.cardFilteredOption = this.modelSearchForm.get('card')
      .valueChanges.pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.value),
        map((name) => {
          return name ? this._filterCard(name) : this.cardOption.slice();
        }),
        map((name) => this._filterCard(name))
      );
    this.modelTypeFilteredOption = this.modelSearchForm.get('model_type')
      .valueChanges.pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.value),
        map((name) => {
          return name ? this._filterModelType(name) : this.modelType.slice();
        }),
        map((name) => this._filterModelType(name))
      );
  }
  createForm() {
    this.formGroupImpRange = this.formBuilder.group({
      importanceRange: new FormControl('')
    });
    this.formGroupSegment = this.formBuilder.group({
      segmentOptionFC: new FormControl('')
    });
    this.formGroupCategory = this.formBuilder.group({
      category: new FormControl('')
    });
  }


  private _filterImpRange(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.importanceRangeOption.filter(
      (option) => option.displayText.toLowerCase().indexOf(filterValue) >= 0
    );
  }
  private _filterSegment(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.segmentOption.filter(
      (option) => option.displayText.toLowerCase().indexOf(filterValue) >= 0
    );
  }
  private _filterCard(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.modelOption.filter(
      (option) => option.displayText.toLowerCase().indexOf(filterValue) >= 0
    );
  }
  private _filterBrand(name: string): any {
    const filterValue = name.toLowerCase();
    return this.brandOption.filter(
      (option) => option.displayText.toLowerCase().indexOf(filterValue) >= 0
    );
  }
  private _filtermodel(name: string): any {
    const filterValue = name.toLowerCase();
    return this.cardOption.filter(
      (option) => option.displayText.toLowerCase().indexOf(filterValue) >= 0
    );
  }
  private _filterLocation(name: string): any {
    const filterValue = name.toLowerCase();
    return this.locationOption.filter(
      (option) => option.toLowerCase().indexOf(filterValue) >= 0
    );
  }

  private _filterModelType(name: string): any {
    const filterValue = name.toLowerCase();
    return this.modelType.filter(
      (option) => option.toLowerCase().indexOf(filterValue) >= 0
    );
  }
  getBrandFilter() {
    this.brandOption = []
    const obj = { model: this.projName }
    this.mlopsService.getBrandDropdown(obj).subscribe((res) => {
      this.brandOption = res.data;
      // console.log(this.brandOption);

      this.modelSearchForm.patchValue({
        brand: this.brandOption[0]
      });

      this.brandFilteredOption = this.modelSearchForm.get('brand')
        .valueChanges.pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value.value),
          map((name) => {
            return name ? this._filterBrand(name) : this.options.slice();
          }),
          map((name) => this._filterBrand(name))
        );
    })
  }
  getLocationFilter() {
    this.locationOption = []
    const obj = { model: this.projName }
    this.mlopsService.getLocationDropdown(obj).subscribe((res) => {
      this.locationOption = res.data;
      // console.log(this.locationOption);

      this.modelSearchForm.patchValue({
        location: this.locationOption[0]
      });
      this.locationFilteredOption = this.modelSearchForm.get('location')
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
  displayFn(subject) {
    // // console.log(subject)
    return subject.displayText ? subject.displayText : undefined;
  }
  displayFnAttr(subject) {
    // // console.log(subject)
    this.range = subject.val;
    return subject.displayText ? subject.displayText : undefined;
  }
  displayFnModel(subject) {
    // // console.log(subject)
    //  this.model = subject.value;
    return subject.displayText ? subject.displayText : undefined;
  }
  displayFnBrand(subject) {
    // // console.log(subject)
    this.brand = subject;
    return subject ? subject : undefined;
  }
  displayFnCard(subject) {
    // // console.log(subject)
    this.card = subject.value;
    return subject.displayText ? subject.displayText : undefined;
  }
  displayFnLocation(subject) {
    return subject ? subject : undefined;
  }
  displayModelType(subject) {
    return subject ? subject : undefined;
  }
  subjectUpdates() {
    this.mlopsService.themeSubject.subscribe(data => {
      const colors = this.mlopsService.fetchChartColorTheme();
      this.ticksColor = colors.ticksColor;
      this.gridsColor = colors.gridsColor;
      this.chartOptions();
    });
  }
  onSelectionChanged(event) {
    // console.log(event.option.value.value);
    this.model = this.projName;
    this.modelSearchForm.patchValue({
      location: "US"
    });
  }
  getExplainability() {
    this.model = this.projName;
    this.globalXAIData = [];
    this.globalXAILabels = [];
    this.globalXAILabelsRev = [];
    this.globalXAIDataRev = [];
    this.loader = true;
    this.chartReady = false;
    this.xaiData = {};
    this.xaiDataRev = {};
    this.showSegment = false;
    this.showPPXAI = false;
    let obj = {};
    if(this.projName == 'Purchase_Propensity'){
      this.modelType = ['PP_3_months', 'PP_6_months', 'PP_12_months'];
      this.modelSearchForm.patchValue({
        model_type:this.modelType[0]
      })
    }else if(this.projName == 'Store_Clustering'){
      this.modelType = ['cluster_go_us_rtl_stg_08Nov_h2_v1','cluster_go_us_rtl_stg_08Nov_h3_v1','cluster_go_us_rtl_stg_08Nov_h4_v1','cluster_go_us_rtl_stg_08Nov_h5_v1'];
      this.modelSearchForm.patchValue({
        model_type:this.modelType[0]
      })
    }
    // if (this.modelSearchForm.value.model.value == 'DM') {
    if (this.projName == 'Direct_Mail') {
      this.showDMXAI = true;
      this.showPPXAI = false;
      obj = { model: this.projName, brand: this.modelSearchForm.value.brand, card_type: this.modelSearchForm.value.card.value };
      this.mlopsService.getXAI(obj).subscribe((res) => {
        const obj1 = { value: 'online_new', displayText: 'Online New' }
        const obj2 = { value: "top", displayText: "High" }

        // // // console.log(this.modelSearchForm.value);
        // // // console.log("XAI REs: ", res);
        this.chartReady = true;
        this.loader = false;
        this.showSegment = true;
        if (_isEmpty(res.data)) {
          this.globalChartData = [{ data: [] }];
          this.globalChartLabels = ['No Data'];
          this.scatterChartData = [{
            pointBackgroundColor: 'white', pointHoverBackgroundColor: '#F27B50',
            pointBorderColor: '#F27B50', pointHoverBorderColor: '#F27B50', data: []
          }];
          this.scatterChartReady = true;
          this.loader = false;
        } else {
          // this.localFeatureImpPrep();
          //   // // console.log(res.data[0].XAI.probability.overall_importance);


          this.lastN = this.firstN + 5;
          // var v1:any,v2:any;
          //const chartData = res.data[0].XAI.probability.overall_importance
          for (let i = 0; i < res.data.length; i++) {
            // console.log(res.data, res.data[i].model_type);

            if (res.data[i].model_type == 'probability') {
              this.xaiData = res.data[i];
              const chartData = Object.entries(res.data[i].XAI.overall_importance)
                .sort(([, v1]: any, [, v2]: any) => v2 - v1)
                .reduce((obj, [k, v]) => ({
                  ...obj,
                  [k]: v
                }), {});
              //   // // console.log(chartData);
              Object.keys(chartData).forEach(key => {
                //    // // console.log(key, chartData[key]);
                this.globalXAIData.push(chartData[key].toFixed(2));
                this.globalXAILabels.push(key)
              });
              // console.log(this.globalXAILabels);

              this.max = this.utilsService.round(Math.ceil(Math.max(...this.globalXAIData)));
              this.globalChartData = [{ data: this.globalXAIData.slice(this.firstN, this.lastN), barThickness: 10 }];
              this.globalChartLabels = this.globalXAILabels.slice(this.firstN, this.lastN);
              this.globalLength = this.globalXAILabels.length;
              this.getSegmentXAI(obj1)
              this.getRangeXAI(obj2)

              this.globalChartColors(this.globalChartData);
            }
            /**
             * Revenue Global XAI
             */
            // const chartDataRev = res.data[0].XAI.revenue.overall_importance
            else if (res.data[i].model_type == 'revenue') {
              this.xaiDataRev = res.data[i];
              // console.log(this.xaiDataRev);
              this.getSegmentXAI(obj1)
              this.getRangeXAI(obj2)

              const chartDataRev = Object.entries(res.data[i].XAI.overall_importance)
                .sort(([, v1]: any, [, v2]: any) => v2 - v1)
                .reduce((obj, [k, v]) => ({
                  ...obj,
                  [k]: v
                }), {});

              //   // // console.log(chartDataRev);
              Object.keys(chartDataRev).forEach(key => {
                //  // // console.log(key, chartDataRev[key]);
                this.globalXAIDataRev.push(chartDataRev[key].toFixed(2));
                this.globalXAILabelsRev.push(key)
              });
              this.max1 = this.utilsService.round(Math.ceil(Math.max(...this.globalXAIDataRev)));
              this.globalChartDataRev = [{ data: this.globalXAIDataRev.slice(this.firstN, this.lastN), barThickness: 10 }];
              this.globalChartLabelsRev = this.globalXAILabelsRev.slice(this.firstN, this.lastN);
              this.globalLengthRev = this.globalXAILabelsRev.length;

              this.globalChartColors(this.globalChartData);
            }


          }


          // // // console.log("XAI: Chart Data",chartData,"Global XAI Data",this.globalXAIDataRev,"Global XAI Labels",this.globalXAILabelsRev);

        }

      }, err => {
        this.loader = false;
        // // console.log('error occurred');
      })
    } else if (this.projName == 'Purchase_Propensity' || this.projName == 'Email_Response' || this.projName == 'Customer_Lifetime_Value') {
      if (this.projName == 'Purchase_Propensity') {
        obj = { model: this.projName, brand: this.modelSearchForm.value.brand, location: this.modelSearchForm.value.location, model_type: this.modelSearchForm.value.model_type }
      } else {
        obj = { model: this.projName, brand: this.modelSearchForm.value.brand, location: this.modelSearchForm.value.location }
      }
      this.mlopsService.getXAI(obj).subscribe((res) => {
        this.showDMXAI = false;
        this.showPPXAI = true;
        // // // console.log(this.modelSearchForm.value);
        // console.log("XAI REs: ", res);
        this.chartReady = true;
        this.loader = false;
        this.xaiData = res.data[0];
        // console.log(Object.keys(this.xaiData));
        if (Object.keys(this.xaiData.XAI).length > 1) {
          this.showSegment = true;
        } else {
          this.showSegment = false;
        }
        if (_isEmpty(res.data)) {
          this.globalChartData = [{ data: [] }];
          this.globalChartLabels = ['No Data'];
          this.scatterChartData = [{
            pointBackgroundColor: 'white', pointHoverBackgroundColor: '#F27B50',
            pointBorderColor: '#F27B50', pointHoverBorderColor: '#F27B50', data: []
          }];
          this.scatterChartReady = true;
          this.loader = false;
        } else {
          // this.localFeatureImpPrep();
          //   // // console.log(res.data[0].XAI.probability.overall_importance);

          this.lastN = this.firstN + 10;
          // var v1:any,v2:any;
          //const chartData = res.data[0].XAI.probability.overall_importance
          const chartData = Object.entries(res.data[0].XAI.overall_importance)
            .sort(([, v1]: any, [, v2]: any) => v2 - v1)
            .reduce((obj, [k, v]) => ({
              ...obj,
              [k]: v
            }), {});
          //   // // console.log(chartData);
          Object.keys(chartData).forEach(key => {
            //    // // console.log(key, chartData[key]);
            this.globalXAIData.push(chartData[key].toFixed(2));
            this.globalXAILabels.push(key)
          });
          // console.log(this.globalXAILabels);

          this.max = this.utilsService.round(Math.ceil(Math.max(...this.globalXAIData)));
          this.globalChartData = [{ data: this.globalXAIData.slice(this.firstN, this.lastN), barThickness: 20 }];
          this.globalChartLabels = this.globalXAILabels.slice(this.firstN, this.lastN);
          this.globalLength = this.globalXAILabels.length;

          this.globalChartColors(this.globalChartData);
          // this.categoryDropdowns = Object.keys(this.xaiData.XAI[this.modelSearchForm.value.model_type]);
          // this.categoryDropdowns = this.categoryDropdowns.filter(item => item !== 'overall_importance');
          // this.formGroupCategory.patchValue({
          //   category: this.categoryDropdowns[0]
          // })
          const obj1 = { value: 'online_new', displayText: 'Online New' }
          const obj2 = { value: "top", displayText: "High" }
          this.getSegmentXAI(obj1)
          this.getRangeXAI(obj2)
          if(this.projName == 'Email_Response' || this.projName == 'Purchase_Propensity'){
            this.fetureHeading = `Feature importance for customers with ${obj2.displayText} predicted probability`;
          }else if(this.projName == 'Customer_Lifetime_Value'){
           this.fetureHeading = `Feature importance for customers with ${obj2.displayText} predicted revenue` ;
          }
          // if (this.xaiData[obj1.value]) {
          //   this.getSegmentXAI(obj1)
          // }
          // else if (this.xaiData[obj1.value]) {
          //   this.getRangeXAI(obj2)
          // }



          // // // console.log("XAI: Chart Data",chartData,"Global XAI Data",this.globalXAIDataRev,"Global XAI Labels",this.globalXAILabelsRev);

        }

      }, err => {
        this.loader = false;
        // // console.log('error occurred');
      })
    }else if(this.projName == 'Store_Clustering'){
      obj = { model: this.projName, brand: this.modelSearchForm.value.brand, location: this.modelSearchForm.value.location,model_type:this.modelSearchForm.value.model_type}
      this.mlopsService.getXAI(obj).subscribe((res) => {
        this.showDMXAI = false;
        this.showPPXAI = false;
        this.showSegment = false;
        // // // console.log(this.modelSearchForm.value);
        // // // console.log("XAI REs: ", res);
        this.chartReady = true;
        this.loader = false;
        this.xaiData = res.data[0];
        if (_isEmpty(res.data)) {
          this.globalChartData = [{ data: [] }];
          this.globalChartLabels = ['No Data'];
          this.scatterChartData = [{
            pointBackgroundColor: 'white', pointHoverBackgroundColor: '#F27B50',
            pointBorderColor: '#F27B50', pointHoverBorderColor: '#F27B50', data: []
          }];
          this.scatterChartReady = true;
          this.loader = false;
        } else {
          // this.localFeatureImpPrep();
          // console.log(res.data);

          this.lastN = this.firstN + 10;
          const chartData = Object.entries(res.data[0].XAI.overall_importance)
            .sort(([, v1]: any, [, v2]: any) => v2 - v1)
            .reduce((obj, [k, v]) => ({
              ...obj,
              [k]: v
            }), {});
          //   // // console.log(chartData);
          Object.keys(chartData).forEach(key => {
            //    // // console.log(key, chartData[key]);
            this.globalXAIData.push(chartData[key].toFixed(2));
            this.globalXAILabels.push(key)
          });
          this.max = this.utilsService.round(Math.ceil(Math.max(...this.globalXAIData)));
          this.globalChartData = [{ data: this.globalXAIData.slice(this.firstN, this.lastN), barThickness: 20 }];
          this.globalChartLabels = this.globalXAILabels.slice(this.firstN, this.lastN);
          this.globalLength = this.globalXAILabels.length;
          this.categoryDropdowns = Object.keys(this.xaiData.XAI);
          this.categoryDropdowns = this.categoryDropdowns.filter(item => item !== 'overall_importance');
          this.formGroupCategory.patchValue({
            category: this.categoryDropdowns[0]
          })
          this.label = 'Cluster';
          this.fetureHeading = `Feature Importance for ${this.categoryDropdowns[0]} `;
          this.descriptionCat = `Shows the average importance of features when predicting  ${this.categoryDropdowns[0]} as output`;
          this.getCategoryXAI(this.categoryDropdowns[0]);

          this.globalChartColors(this.globalChartData);
          // // // console.log("XAI: Chart Data",chartData,"Global XAI Data",this.globalXAIDataRev,"Global XAI Labels",this.globalXAILabelsRev);

        }

      }, err => {
        this.loader = false;
        // // console.log('error occurred');
      })
    }
     else {
      
      obj = { model: this.projName, brand: this.modelSearchForm.value.brand, location: this.modelSearchForm.value.location }
      // console.log("DP", obj);
      this.mlopsService.getXAI(obj).subscribe((res) => {
        this.showDMXAI = false;
        this.showPPXAI = false;
        this.showSegment = false;
        // // // console.log(this.modelSearchForm.value);
        // // // console.log("XAI REs: ", res);
        this.chartReady = true;
        this.loader = false;
        this.xaiData = res.data[0];
        if (_isEmpty(res.data)) {
          this.globalChartData = [{ data: [] }];
          this.globalChartLabels = ['No Data'];
          this.scatterChartData = [{
            pointBackgroundColor: 'white', pointHoverBackgroundColor: '#F27B50',
            pointBorderColor: '#F27B50', pointHoverBorderColor: '#F27B50', data: []
          }];
          this.scatterChartReady = true;
          this.loader = false;
        } else {
          // this.localFeatureImpPrep();
          // console.log(res.data);

          this.lastN = this.firstN + 10;
          const chartData = Object.entries(res.data[0].XAI.overall_importance)
            .sort(([, v1]: any, [, v2]: any) => v2 - v1)
            .reduce((obj, [k, v]) => ({
              ...obj,
              [k]: v
            }), {});
          //   // // console.log(chartData);
          Object.keys(chartData).forEach(key => {
            //    // // console.log(key, chartData[key]);
            this.globalXAIData.push(chartData[key].toFixed(2));
            this.globalXAILabels.push(key)
          });
          this.max = this.utilsService.round(Math.ceil(Math.max(...this.globalXAIData)));
          this.globalChartData = [{ data: this.globalXAIData.slice(this.firstN, this.lastN), barThickness: 20 }];
          this.globalChartLabels = this.globalXAILabels.slice(this.firstN, this.lastN);
          this.globalLength = this.globalXAILabels.length;
          this.categoryDropdowns = Object.keys(this.xaiData.XAI);
          this.categoryDropdowns = this.categoryDropdowns.filter(item => item !== 'overall_importance');
          this.formGroupCategory.patchValue({
            category: this.categoryDropdowns[0]
          })
          if(this.projName == 'Division_Preference'){
            this.label = 'Division';
            this.fetureHeading = `Feature Importance for the ${this.categoryDropdowns[0]} division`;
            this.descriptionCat = 'Shows the average importance of features when predicting output for this division';
          }else if(this.projName == 'Category_Preference'){
           this.label = 'Category';
           this.fetureHeading = `Feature Importance for the ${this.categoryDropdowns[0]} category` ;
           this.descriptionCat = 'Shows the average importance of features when predicting output for this category';
          }
          this.getCategoryXAI(this.categoryDropdowns[0]);

          this.globalChartColors(this.globalChartData);
          // // // console.log("XAI: Chart Data",chartData,"Global XAI Data",this.globalXAIDataRev,"Global XAI Labels",this.globalXAILabelsRev);

        }

      }, err => {
        this.loader = false;
        // // console.log('error occurred');
      })
    }
    // // console.log("Obj",this.modelSearchForm.value.brand,this.modelSearchForm.value.card.value);



  }
  getCategoryXAI(data) {
    this.globalXAIDataTopProb = [];
    this.globalXAILabelsTopProb = [];
    this.globalXAILabelsTopRev = [];
    this.globalXAIDataTopRev = [];
    this.globalChartDataTopProb = [];
    if(this.projName == 'Division_Preference'){
      this.fetureHeading = `Feature Importance for the ${data} division`;
    }else if(this.projName == 'Category_Preference'){
     this.fetureHeading = `Feature Importance for the ${data} category`;
    }else if(this.projName == 'Store_Clustering'){
      this.fetureHeading = `Feature Importance for ${data} `;
      this.descriptionCat = `Shows the average importance of features when predicting  ${data} as output`;
    }
    this.showDMXAI = false;
    this.showPPXAI = false;
    const chartDataTopProb = Object.entries(this.xaiData.XAI[data])
      .sort(([, v1]: any, [, v2]: any) => v2 - v1)
      .reduce((obj, [k, v]) => ({
        ...obj,
        [k]: v
      }), {});
    //  // // console.log("Hi", chartDataTopProb);
    // const sorted =
    // // // console.log(sorted);

    Object.keys(chartDataTopProb).forEach(key => {
      //   // // console.log(key, chartDataTopProb[key]);
      this.globalXAIDataTopProb.push((chartDataTopProb[key]).toFixed(2));
      this.globalXAILabelsTopProb.push(key)
    });
    // console.log(this.globalXAIDataTopProb);



    this.max2 = this.utilsService.round(Math.ceil(Math.max(...this.globalXAIDataTopProb)));
    // // console.log("Max1",this.max);

    this.globalChartDataTopProb = [{ data: this.globalXAIDataTopProb.slice(this.firstN, this.lastN), barThickness: 20 }];
    this.globalChartLabelsTopProb = this.globalXAILabelsTopProb.slice(this.firstN, this.lastN);
    this.globalLengthTopProb = this.globalXAILabelsTopProb.length;

  }
  getRangeXAI(data) {
    //  // // console.log(data);
    if (data.value == 'top') {
      this.selectedRange = 'Higher';
    } else {
      this.selectedRange = 'Lower'
    }
    if(this.projName == 'Email_Response' || this.projName == 'Purchase_Propensity'){
      this.fetureHeading = `Feature importance for customers with ${this.selectedRange} predicted probability`;
    }else if(this.projName == 'Customer_Lifetime_Value'){
     this.fetureHeading = `Feature importance for customers with ${this.selectedRange} predicted revenue` ;
    }

    this.chartReadyRev = false;
    //  if (this.range == 'top') {
    this.globalXAIDataTopProb = [];
    this.globalXAILabelsTopProb = [];
    this.globalXAILabelsTopRev = [];
    this.globalXAIDataTopRev = [];
    this.globalChartDataTopProb = [];
    if (this.xaiData.model_type == 'probability') {
      const chartDataTopProb = Object.entries(this.xaiData.XAI[data.value])
        .sort(([, v1]: any, [, v2]: any) => v2 - v1)
        .reduce((obj, [k, v]) => ({
          ...obj,
          [k]: v
        }), {});
      //  // // console.log("Hi", chartDataTopProb);
      // const sorted =
      // // // console.log(sorted);

      Object.keys(chartDataTopProb).forEach(key => {
        //   // // console.log(key, chartDataTopProb[key]);
        this.globalXAIDataTopProb.push((chartDataTopProb[key]).toFixed(2));
        this.globalXAILabelsTopProb.push(key)
      });
      // console.log(this.globalXAIDataTopProb);



      this.max2 = this.utilsService.round(Math.ceil(Math.max(...this.globalXAIDataTopProb)));
      // // console.log("Max1",this.max);

      this.globalChartDataTopProb = [{ data: this.globalXAIDataTopProb.slice(this.firstN, this.lastN), barThickness: 10 }];
      this.globalChartLabelsTopProb = this.globalXAILabelsTopProb.slice(this.firstN, this.lastN);
      this.globalLengthTopProb = this.globalXAILabelsTopProb.length;


    }
    else if (this.xaiData.model == 'Purchase_Propensity' || this.xaiData.model == 'Email_Response' || this.xaiData.model == 'Customer_Lifetime_Value' ) {
      this.showPPXAI = true;
      this.showDMXAI = false;
      // console.log(this.xaiData);

      const chartDataTopProb = Object.entries(this.xaiData.XAI[data.value])
        .sort(([, v1]: any, [, v2]: any) => v2 - v1)
        .reduce((obj, [k, v]) => ({
          ...obj,
          [k]: v
        }), {});
      //  // // console.log("Hi", chartDataTopProb);
      // const sorted =
      // // // console.log(sorted);

      Object.keys(chartDataTopProb).forEach(key => {
        //   // // console.log(key, chartDataTopProb[key]);
        this.globalXAIDataTopProb.push((chartDataTopProb[key]).toFixed(2));
        this.globalXAILabelsTopProb.push(key)
      });
      // console.log(this.globalXAIDataTopProb);



      this.max2 = this.utilsService.round(Math.ceil(Math.max(...this.globalXAIDataTopProb)));
      // // console.log("Max1",this.max);

      this.globalChartDataTopProb = [{ data: this.globalXAIDataTopProb.slice(this.firstN, this.lastN), barThickness: 20 }];
      this.globalChartLabelsTopProb = this.globalXAILabelsTopProb.slice(this.firstN, this.lastN);
      this.globalLengthTopProb = this.globalXAILabelsTopProb.length;

    }
    if (this.xaiDataRev) {
      if (this.xaiDataRev.model_type == 'revenue') {
        // console.log(this.xaiDataRev);
        /**
         * Revenue Global XAI
         */
        this.chartReadyRev = true;
        const chartDataTopRev = Object.entries(this.xaiDataRev.XAI[data.value])
          .sort(([, v1]: any, [, v2]: any) => v2 - v1)
          .reduce((obj, [k, v]) => ({
            ...obj,
            [k]: v
          }), {});
        // // // console.log(chartDataTopRev);
        Object.keys(chartDataTopRev).forEach(key => {
          //  // // console.log(key, chartDataRev[key]);
          this.globalXAIDataTopRev.push((chartDataTopRev[key]).toFixed(2));
          this.globalXAILabelsTopRev.push(key)
        });
        this.max3 = this.utilsService.round(Math.ceil(Math.max(...this.globalXAIDataTopRev)));
        // // console.log("Max1",this.max);
        this.globalChartDataTopRev = [{ data: this.globalXAIDataTopRev.slice(this.firstN, this.lastN), barThickness: 10 }];
        this.globalChartLabelsTopRev = this.globalXAILabelsTopRev.slice(this.firstN, this.lastN);
        this.globalLengthTopRev = this.globalXAILabelsTopRev.length;
      }
    }



    //  }

  }

  getSegmentXAI(data) {
    //  // // console.log(data.value);

    this.globalXAIDataSegProb = [];
    this.globalXAILabelsSegProb = [];
    this.globalXAILabelsSegRev = [];
    this.globalXAIDataSegRev = [];
    this.chartReadyRev = false;
    if (this.xaiData.model_type == 'probability') {
      const chartDataSegProb = Object.entries(this.xaiData.XAI[data.value])
        .sort(([, v1]: any, [, v2]: any) => v2 - v1)
        .reduce((obj, [k, v]) => ({
          ...obj,
          [k]: v
        }), {});

      //  // // console.log(chartDataSegProb);
      Object.keys(chartDataSegProb).forEach(key => {
        //   // // console.log(key, chartDataSegProb[key]);
        this.globalXAIDataSegProb.push(chartDataSegProb[key].toFixed(2));
        this.globalXAILabelsSegProb.push(key)
      });
      this.max4 = this.utilsService.round(Math.ceil(Math.max(...this.globalXAIDataSegProb)));
      // // console.log("Max1",this.max);
      this.globalChartDataSegProb = [{ data: this.globalXAIDataSegProb.slice(this.firstN, this.lastN), barThickness: 10 }];
      this.globalChartLabelsSegProb = this.globalXAILabelsSegProb.slice(this.firstN, this.lastN);
      this.globalLengthSegProb = this.globalXAILabelsSegProb.length;
    } else if (this.xaiData.model == 'Purchase_Propensity' || this.xaiData.model == 'Email_Response' || this.xaiData.model == 'Customer_Lifetime_Value') {

      this.showPPXAI = true;
      this.showDMXAI = false;
      const chartDataSegProb = Object.entries(this.xaiData.XAI[data.value])
        .sort(([, v1]: any, [, v2]: any) => v2 - v1)
        .reduce((obj, [k, v]) => ({
          ...obj,
          [k]: v
        }), {});

      //  // // console.log(chartDataSegProb);
      Object.keys(chartDataSegProb).forEach(key => {
        //   // // console.log(key, chartDataSegProb[key]);
        this.globalXAIDataSegProb.push(chartDataSegProb[key].toFixed(2));
        this.globalXAILabelsSegProb.push(key)
      });
      this.max4 = this.utilsService.round(Math.ceil(Math.max(...this.globalXAIDataSegProb)));
      // // console.log("Max1",this.max);
      this.globalChartDataSegProb = [{ data: this.globalXAIDataSegProb.slice(this.firstN, this.lastN), barThickness: 20 }];
      this.globalChartLabelsSegProb = this.globalXAILabelsSegProb.slice(this.firstN, this.lastN);
      this.globalLengthSegProb = this.globalXAILabelsSegProb.length;
    }

    if (this.xaiDataRev) {
      if (this.xaiDataRev.model_type == 'revenue') {
        this.chartReadyRev = true
        /**
             * Revenue Global XAI
             */
        const chartDataSegRev = Object.entries(this.xaiDataRev.XAI[data.value])
          .sort(([, v1]: any, [, v2]: any) => v2 - v1)
          .reduce((obj, [k, v]) => ({
            ...obj,
            [k]: v
          }), {})

        // console.log(chartDataSegRev);
        Object.keys(chartDataSegRev).forEach(key => {
          //  // console.log(key, chartDataRev[key]);
          this.globalXAIDataSegRev.push(chartDataSegRev[key].toFixed(2));
          this.globalXAILabelsSegRev.push(key)
        });
        this.max5 = this.utilsService.round(Math.ceil(Math.max(...this.globalXAIDataSegRev)));
        // console.log("Max1", this.max);
        this.globalChartDataSegRev = [{ data: this.globalXAIDataSegRev.slice(this.firstN, this.lastN), barThickness: 10 }];
        this.globalChartLabelsSegRev = this.globalXAILabelsSegRev.slice(this.firstN, this.lastN);
        this.globalLengthSegRev = this.globalXAILabelsSegRev.length;
      }
    }

  }
  // getLatestExecObj() {
  //   this.mlopsService.getLatestExec({ projectId: this.projectId }).subscribe(response => {
  //     this.latestExec = response.data;
  //   }, err => {
  //     // // console.log('error occurred');
  //   });
  // }

  globalChartColors(dataset) {
    for (let i = 0; i < dataset[0].data.length; i++) {
      if (dataset[0].data[i] >= 0) {
        this.globalColors[0].backgroundColor[i] = 'rgba(242, 123, 80, 1)';
      } else {
        this.globalColors[0].backgroundColor[i] = 'rgba(229,173,152,0.6)';
      }
    }
  }

  showPrevFeatures(event) {
    // console.log(event);
    
    this.trackService.trackingMetrics('nav', '31');
    if (this.model == 'Direct_Mail') {
      this.globalChartData = [{ data: this.globalXAIData.slice(event.first, event.last), barThickness: 10 }];
    } else {
      this.globalChartData = [{ data: this.globalXAIData.slice(event.first, event.last), barThickness: 20 }];
    }
    this.globalChartLabels = this.globalXAILabels.slice(event.first, event.last);
    this.globalChartColors(this.globalChartData);
  }

  showNextFeatures(event) {
    this.trackService.trackingMetrics('nav', '31');
    if (this.model == 'Direct_Mail') {
      this.globalChartData = [{ data: this.globalXAIData.slice(event.first, event.last), barThickness: 10 }];
    } else {
      this.globalChartData = [{ data: this.globalXAIData.slice(event.first, event.last), barThickness: 20 }];
    }
    this.globalChartLabels = this.globalXAILabels.slice(event.first, event.last);
    this.globalChartColors(this.globalChartData);
  }
  showPrevFeaturesRev(event) {
    this.trackService.trackingMetrics('nav', '31');
    if (this.model == 'Direct_Mail') {
      this.globalChartDataRev = [{ data: this.globalXAIDataRev.slice(event.first, event.last), barThickness: 10 }];
    } else {
      this.globalChartDataRev = [{ data: this.globalXAIDataRev.slice(event.first, event.last), barThickness: 10 }];
    }
    //this.globalChartDataRev = [{ data: this.globalXAIDataRev.slice(event.first, event.last), barThickness: 10 }];
    this.globalChartLabelsRev = this.globalXAILabelsRev.slice(event.first, event.last);
    this.globalChartColors(this.globalChartDataRev);
  }

  showNextFeaturesRev(event) {
    this.trackService.trackingMetrics('nav', '31');
    if (this.model == 'Direct_Mail') {
      this.globalChartDataRev = [{ data: this.globalXAIDataRev.slice(event.first, event.last), barThickness: 10 }];
    }else{
      this.globalChartDataRev = [{ data: this.globalXAIDataRev.slice(event.first, event.last), barThickness: 20 }];
    }
    this.globalChartLabelsRev = this.globalXAILabelsRev.slice(event.first, event.last);
    this.globalChartColors(this.globalChartDataRev);
  }
  showPrevFeaturesTopRev(event) {
    this.trackService.trackingMetrics('nav', '31');
    if (this.model == 'Direct_Mail') {
      this.globalChartDataTopRev = [{ data: this.globalXAIDataTopRev.slice(event.first, event.last), barThickness: 10 }];
    }else{
      this.globalChartDataTopRev = [{ data: this.globalXAIDataTopRev.slice(event.first, event.last), barThickness: 20 }];
    }
    this.globalChartLabelsTopRev = this.globalXAILabelsTopRev.slice(event.first, event.last);
    this.globalChartColors(this.globalChartDataTopRev);
  }

  showNextFeaturesTopRev(event) {
    this.trackService.trackingMetrics('nav', '31');
    if (this.model == 'Direct_Mail') {
      this.globalChartDataTopRev = [{ data: this.globalXAIDataTopRev.slice(event.first, event.last), barThickness: 10 }];
    }else{
      this.globalChartDataTopRev = [{ data: this.globalXAIDataTopRev.slice(event.first, event.last), barThickness: 20 }];
    }
    this.globalChartLabelsTopRev = this.globalXAILabelsTopRev.slice(event.first, event.last);
    this.globalChartColors(this.globalChartDataTopRev);
  }
  showPrevFeaturesTopProb(event) {
    this.trackService.trackingMetrics('nav', '31');
    if (this.model == 'Direct_Mail') {
      this.globalChartDataTopProb = [{ data: this.globalXAIDataTopProb.slice(event.first, event.last), barThickness: 10 }];
    }else{
      this.globalChartDataTopProb = [{ data: this.globalXAIDataTopProb.slice(event.first, event.last), barThickness: 20 }];
    }
    this.globalChartLabelsTopProb = this.globalXAILabelsTopProb.slice(event.first, event.last);
    this.globalChartColors(this.globalChartDataTopProb);
  }

  showNextFeaturesTopProb(event) {
    this.trackService.trackingMetrics('nav', '31');
    if (this.model == 'Direct_Mail') {
      this.globalChartDataTopProb = [{ data: this.globalXAIDataTopProb.slice(event.first, event.last), barThickness: 10 }];
    }else{
      this.globalChartDataTopProb = [{ data: this.globalXAIDataTopProb.slice(event.first, event.last), barThickness: 20 }];
    }
    this.globalChartLabelsTopProb = this.globalXAILabelsTopProb.slice(event.first, event.last);
    this.globalChartColors(this.globalChartDataTopProb);
  }
  showPrevFeaturesSegRev(event) {
    this.trackService.trackingMetrics('nav', '31');
    if (this.model == 'Direct_Mail') {
      this.globalChartDataSegRev = [{ data: this.globalXAIDataSegRev.slice(event.first, event.last), barThickness: 10 }];
    }else{
      this.globalChartDataSegRev = [{ data: this.globalXAIDataSegRev.slice(event.first, event.last), barThickness: 20 }];
    }
    this.globalChartLabelsSegRev = this.globalXAILabelsSegRev.slice(event.first, event.last);
    this.globalChartColors(this.globalChartDataSegRev);
  }

  showNextFeaturesSegRev(event) {
    this.trackService.trackingMetrics('nav', '31');
    if (this.model == 'Direct_Mail') {
      this.globalChartDataSegRev = [{ data: this.globalXAIDataSegRev.slice(event.first, event.last), barThickness: 10 }];
    }else{
      this.globalChartDataSegRev = [{ data: this.globalXAIDataSegRev.slice(event.first, event.last), barThickness: 20 }];
    }
    this.globalChartLabelsSegRev = this.globalXAILabelsSegRev.slice(event.first, event.last);
    this.globalChartColors(this.globalChartDataSegRev);
  }
  showPrevFeaturesSegProb(event) {
    this.trackService.trackingMetrics('nav', '31');
    if (this.model == 'Direct_Mail') {
      this.globalChartDataSegProb = [{ data: this.globalXAIDataSegProb.slice(event.first, event.last), barThickness: 10 }];
    }else{
      this.globalChartDataSegProb = [{ data: this.globalXAIDataSegProb.slice(event.first, event.last), barThickness: 20 }];
    }
   
    this.globalChartLabelsSegProb = this.globalXAILabelsSegProb.slice(event.first, event.last);
    this.globalChartColors(this.globalChartDataSegProb);
  }

  showNextFeaturesSegProb(event) {
    this.trackService.trackingMetrics('nav', '31');
    if (this.model == 'Direct_Mail') {
      this.globalChartDataSegProb = [{ data: this.globalXAIDataSegProb.slice(event.first, event.last), barThickness: 10 }];
    }else{
      this.globalChartDataSegProb = [{ data: this.globalXAIDataSegProb.slice(event.first, event.last), barThickness: 20 }];
    }
    this.globalChartLabelsSegProb = this.globalXAILabelsSegProb.slice(event.first, event.last);
    this.globalChartColors(this.globalChartDataSegProb);
  }

  // localFeatureImpPrep() {
  //   if (_isEmpty(this.latestExec)) {
  //     this.mlopsService.getLatestExec({ projectId: this.projectId }).subscribe(response => {
  //       this.latestExec = response.data;
  //       this.localFeatureImp();
  //     }, err => {
  //       // // console.log('error occurred while fetching latestExec');
  //       this.loader = false;
  //     });
  //   } else {
  //     this.localFeatureImp();
  //   }
  // }

  // localFeatureImp() {
  //   try {
  //     const payload = {
  //       // columns: 'null',
  //       exp_output_data_path: this.latestExec.id + '_local_exp.json',
  //       // target: this.latestExec.target,
  //       idx: this.count,
  //       test_file_path: this.latestExec.testFile
  //     };
  //     this.featureChartReady = false;
  //     this.clearFilters();
  //     this.mlopsService.getScatterPlotNew(payload).subscribe(response => {
  //       if (_isEmpty(response.data) || response.data.error) {
  //         this.scatterChartData = [{
  //           pointBackgroundColor: 'white', pointHoverBackgroundColor: '#F27B50',
  //           pointBorderColor: '#F27B50', pointHoverBorderColor: '#F27B50', data: []
  //         }];
  //         this.scatterChartReady = true;
  //         this.chartOptions();
  //         this.loader = false;
  //       } else {
  //         this.scatterData = response.data;
  //         this.loader = false;
  //         // this.xValues = this.scatterData.columns;
  //         // this.yValues = this.scatterData.columns;
  //         // const key = String(Object.keys(this.scatterData)[0].match(/\(([^)]+)\)/)[1].split(',')).replace(/["']/g, '').split(',');
  //         this.loader = false;
  //         // this.xaxis = _trim(key[0]);
  //         // this.yaxis = _trim(key[1]);
  //         // this.oldXaxis = this.xaxis;
  //         // this.oldYaxis = this.yaxis;
  //         this.fetchScatterPoints();
  //       }
  //     }, err => {
  //       this.loader = false;
  //       this.scatterChartData = [{
  //         pointBackgroundColor: 'white', pointHoverBackgroundColor: '#F27B50',
  //         pointBorderColor: '#F27B50', pointHoverBorderColor: '#F27B50', data: []
  //       }];
  //       this.scatterChartReady = true;
  //     });
  //   } catch (error) {
  //     // // console.error(error);
  //     this.loader = false;
  //     this.scatterChartData = [{
  //       pointBackgroundColor: 'white', pointHoverBackgroundColor: '#F27B50',
  //       pointBorderColor: '#F27B50', pointHoverBorderColor: '#F27B50', data: []
  //     }];
  //     this.scatterChartReady = true;
  //   }

  // }

  fetchScatterPoints() {
    this.loader = false;
    // this.selectedkey = Object.keys(this.scatterData)[this.count];
    // this.uniqueTargetValues = [...new Set(this.scatterData[this.selectedkey].map(item => {
    //   return _get(Object.values(item)[0], 'target');
    //  }))].map(Number).sort((a, b) => 0 - (a > b ? -1 : 1));
    // this.targetMin = this.uniqueTargetValues[0];
    // if (this.uniqueTargetValues.length > 4) {
    // this.targetMid1 = this.uniqueTargetValues[Math.round((this.uniqueTargetValues.length - 1) / 2)];
    // }
    // this.targetMax = this.uniqueTargetValues[this.uniqueTargetValues.length - 1];
    // this.colorsGenerated = this.generateScatterPlotColors('rgb(124,132,168)', 'rgb(242,123,80)', this.uniqueTargetValues.length);
    // const combinedArray = [];
    // this.colorLength = this.colorsGenerated.length;
    // for (let a = 0; a < this.uniqueTargetValues.length; a++) {
    //   const object = {target: 0, color: ''};
    //   object.target = this.uniqueTargetValues[a];
    //   object.color = this.colorsGenerated[a];
    //   combinedArray.push(object);
    // }
    // const combinedScatterColor = [];
    // for (const item of combinedArray) {
    //   const scatterColors = this.scatterData[this.selectedkey].filter(o => {
    //     return _get(Object.values(o)[0], 'target') === item.target;
    //    }).map(i => {
    //     return { pointBackgroundColor: item.color, pointHoverBackgroundColor: item.color, pointBorderColor:
    //       item.color, pointHoverBorderColor: item.color };
    //    });
    //   combinedScatterColor.push(scatterColors);
    // }

    // const newSortedArray = [];
    // const targetTooltips = [];
    // for (const item of combinedArray) {
    //   const newSort = this.scatterData[this.selectedkey].filter(o => {
    //     return _get(Object.values(o)[0], 'target') === item.target;
    //    }).map(i => {
    //     const targetTooltip =  _get(Object.values(i)[0], 'target');
    //     targetTooltips.push(targetTooltip);
    //     const obj = {x: 0, y: 0};
    //     obj.x = _get(Object.values(i)[0], 'value')[this.xaxis].raw;
    //     obj.y = _get(Object.values(i)[0], 'value')[this.yaxis].raw;
    //     return obj;
    //    });
    //   newSortedArray.push(newSort);
    // }
    // this.flattened = [].concat(...newSortedArray);
    // this.scatterChartColors = [].concat(...combinedScatterColor);
    // const pointBackgroundColor = this.scatterChartColors.map(c => c.pointBackgroundColor);
    // const pointHoverBackgroundColor = this.scatterChartColors.map(c => c.pointHoverBackgroundColor);
    // const pointBorderColor = this.scatterChartColors.map(c => c.pointBorderColor);
    // const pointHoverBorderColor = this.scatterChartColors.map(c => c.pointHoverBorderColor);
    // this.scatterChartData = [{data: this.flattened, pointBackgroundColor, pointHoverBackgroundColor,
    //    pointBorderColor, pointHoverBorderColor, tooltip: targetTooltips, target: this.latestExec.target}];
    // this.chartOptions();
    // this.scatterChartReady = true;

    this.allTargetValues = this.scatterData[this.count].map(item => {
      return _get(Object.values(item)[0], 'target');
    });
    // // console.log(this.allTargetValues, 'all target valuess');
    this.targets = [...new Set(this.allTargetValues)];
    this.rawData = this.scatterData[this.count].map(item => {
      return Object.values(item)[0];
    });
    // // console.log(this.rawData, 'raw dataaa');
    this.tabeReady = true;
    this.xaiColumns = Object.keys(this.rawData[0].value);
    this.xaiColumns.unshift('target', 'sl');
    this.features = this.scatterData.columns;
    this.xaiSource = this.rawData;
    // // console.log(this.xaiSource);

    this.sl = Array.from({ length: this.rawData.length }, (_, i) => i + 1);
    this.xaiSourceCopy = this.xaiSource;
  }

  isSticky(column: string): boolean {
    return column === 'target' ? true : false;
  }

  getRecord(record) {
    this.featureChartReady = false;
    this.cdRef.detectChanges();
    this.highlightRow = record;
    const allexpRecords = this.rawData.map(item => Object.values(item.value)).map(i => i.map(o => o.exp)).flat(1);
    const values = (Object.values(record.value).map(item => {
      return _get(item, 'exp');
    })).map(o => Number(o.toFixed(2)));
    const labels = Object.keys(record.value);
    const labelValueCombined = labels.map((k, index) => {
      return { label: k, value: values[index] };
    }).sort((a, b) => Math.abs(b.value) - Math.abs(a.value));
    // // // console.log(labelValueCombined);
    this.localFeatureLabels = labelValueCombined.map(i => i.label);
    this.localFeatureData = labelValueCombined.map(i => i.value);
    // console.log(this.localFeatureData);
    
    this.featureMaxValue = this.utilsService.roundFeatureChart(Math.max(...allexpRecords));
    this.featureMinValue = this.utilsService.roundFeatureChart(Math.min(...allexpRecords));
    // // // console.log(this.featureMinValue, this.featureMaxValue);
    this.featureImpChart();
  }

  featureImpChart() {
    this.featureImpData = [{ data: this.localFeatureData.slice(this.firstN, this.lastN), barThickness: 20 }];
    this.featureImpLabels = this.localFeatureLabels.slice(this.firstN, this.lastN);
    this.featuresLength = this.localFeatureLabels.length;
    this.globalChartColors(this.featureImpData);
    this.featureChartReady = true;
  }

  // generateScatterPlotColors(color1, color2, steps) {
  //   const stepFactor = 1 / (steps - 1);
  //   const interpolatedColorArray = [];
  //   color1 = color1.match(/\d+/g).map(Number);
  //   color2 = color2.match(/\d+/g).map(Number);
  //   for (let i = 0; i < steps; i++) {
  //       interpolatedColorArray.push(this.interpolateColor(color1, color2, stepFactor * i));
  //   }
  //   return interpolatedColorArray;
  // }

  // interpolateColor(color1, color2, factor) {
  //   if (arguments.length < 3) {
  //       factor = 0.5;
  //   }
  //   const result = color1.slice();
  //   for (let i = 0; i < 3; i++) {
  //       result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
  //   }
  //   return 'rgb(' + result.toString() + ')';
  // }

  fetchOtherScatterCombinations() {
    this.oldXaxis = this.xaxis;
    this.oldYaxis = this.yaxis;
    const payload = {
      test_file_path: this.latestExec.testFile,
      exp_output_data_path: this.latestExec.id + '_local_exp.json',
      idx: this.count
      // target: this.latestExec.target,
      // columns: [this.xaxis, this.yaxis]
    };
    this.mlopsService.getScatterPlotNew(payload).subscribe(response => {
      if (_isEmpty(response.data) || response.data.error) {
        this.scatterChartData = [{
          pointBackgroundColor: 'white', pointHoverBackgroundColor: '#F27B50',
          pointBorderColor: '#F27B50', pointHoverBorderColor: '#F27B50', data: []
        }];
        this.scatterChartReady = true;
        this.chartOptions();
        this.loader = false;
        this.scatterLoader = false;
      } else {
        this.loader = false;
        this.scatterLoader = false;
        this.scatterData = response.data;
        this.fetchScatterPoints();
      }
    }, err => {
      this.loader = false;
      this.scatterLoader = false;
      this.chartOptions();
      this.scatterChartData = [{
        pointBackgroundColor: 'white', pointHoverBackgroundColor: '#F27B50',
        pointBorderColor: '#F27B50', pointHoverBorderColor: '#F27B50', data: []
      }];
      this.scatterChartReady = true;
      // // console.log('error occurred');
    });
  }

  chartOptions() {
    this.scatterChartOptions = {
      responsive: true,
      legend: {
        display: false
      },
      tooltips: {
        callbacks: {
          afterLabel(tooltipItem, data) {
            if (data.datasets[0].tooltip) {
              const tooltiplabel = data.datasets[0].tooltip;
              const value = data.datasets[0].target + ': ' + tooltiplabel[tooltipItem.index];
              return value;
            }
          }
        }
      },
      scales: {
        xAxes: [{
          gridLines: {
            display: true,
            color: this.gridsColor
          },
          scaleLabel: {
            display: true,
            labelString: this.xaxis ? this.xaxis : 'No Data',
            fontSize: 10,
            fontColor: this.ticksColor,
            fontFamily: '"Montserrat", sans-serif'
          },
          ticks: {
            fontColor: this.ticksColor,
            fontFamily: '"Montserrat", sans-serif'
          }
        }], yAxes: [{
          gridLines: {
            display: true,
            color: this.gridsColor
          },
          scaleLabel: {
            display: true,
            labelString: this.yaxis ? this.yaxis : 'No Data',
            fontSize: 10,
            fontColor: this.ticksColor,
            fontFamily: '"Montserrat", sans-serif'
          },
          ticks: {
            beginAtZero: true,
            maxTicksLimit: 5,
            fontColor: this.ticksColor,
            fontFamily: '"Montserrat", sans-serif'
          }
        }]
      },
    };
  }

  // changexScatterPlot(event) {
  //   this.trackService.trackingMetrics('dropdown', '32');

  //   this.count = 0;
  //   this.xaxis = event;
  //   this.featureChartReady = false;
  //   this.showFeatureImp = false;
  // }

  // changeyScatterPlot(event) {
  //   this.trackService.trackingMetrics('dropdown', '32');

  //   this.count = 0;
  //   this.yaxis = event;
  //   this.featureChartReady = false;
  //   this.showFeatureImp = false;
  // }

  // scatterChartClick(event) {
  //   this.trackService.trackingMetrics(event, '30');

  //   this.showFeatureImp = true;
  //   this.featureChartReady = false;
  //   if (event.active.length > 0) {
  //     const chart = event.active[0]._chart;
  //     const activePoints = chart.getElementAtEvent(event.event);
  //     if (activePoints.length > 0) {
  //       const clickedElementIndex = activePoints[0]._index;
  //       const values = chart.data.datasets[0].data[clickedElementIndex];
  //       const obj = {};
  //       obj[`${this.xaxis}`] = _get(values, 'x');
  //       obj[`${this.yaxis}`] = _get(values, 'y');
  //       const featureImpObject = this.scatterData[this.selectedkey].find(i => _get(Object.values(i)[0],
  // 'value')[this.xaxis].raw === obj[`${this.xaxis}`] && _get(Object.values(i)[0], 'value')[this.yaxis].raw === obj[`${this.yaxis}`]);
  //       const featureImp = [this.scatterData[this.selectedkey].find(i => _get(Object.values(i)[0],
  // 'value')[this.xaxis].raw === obj[`${this.xaxis}`] && _get(Object.values(i)[0], 'value')[this.yaxis].raw === obj[`${this.yaxis}`])];
  //       if (_isEmpty(featureImpObject)) {
  //         this.featureImpData = [{ data: [] }];
  //         this.featureImpLabels = ['No Data'];
  //         this.featureChartReady = true;
  //       } else {
  //       const filterFeatureImp = featureImp.map(item => Object.values(item)[0]);
  //       const featureLabels = [];
  //       const expValues = [];
  //       for (const [key, value] of Object.entries(_get(filterFeatureImp[0], 'value'))) {
  //         featureLabels.push(key);
  //         expValues.push(_get(value, 'exp').toFixed(2));
  //       }
  //       this.localFeatureData = expValues.map(Number);
  //       this.localFeatureLabels = featureLabels;
  //       this.featureMinValue = Math.floor(Math.min(...this.localFeatureData));
  //       this.featureMaxValue = Math.ceil(Math.max(...this.localFeatureData));
  //       this.featureImpData = [{ data: this.localFeatureData.slice(this.firstN, this.lastN), barThickness: 20}];
  //       this.featureImpLabels = this.localFeatureLabels.slice(this.firstN, this.lastN);
  //       this.featuresLength = this.localFeatureLabels.length;
  //       this.globalChartColors(this.featureImpData);
  //       this.featureChartReady = true;
  //     }
  //     }
  //   } else {
  //       this.featureImpData = [{ data: [] }];
  //       this.featureImpLabels = ['No Data'];
  //       this.featureChartReady = true;
  //   }
  // }

  showPrevLocalFeatures(event) {
    this.trackService.trackingMetrics('nav', '31');

    this.featureImpData = [{ data: this.localFeatureData.slice(event.first, event.last), barThickness: 20 }];
    this.featureImpLabels = this.localFeatureLabels.slice(event.first, event.last);
    this.globalChartColors(this.featureImpData);
  }

  showNextLocalFeatures(event) {
    this.trackService.trackingMetrics('nav', '31');

    this.featureImpData = [{ data: this.localFeatureData.slice(event.first, event.last), barThickness: 20 }];
    this.featureImpLabels = this.localFeatureLabels.slice(event.first, event.last);
    this.globalChartColors(this.featureImpData);
  }

  getValueForFeature1(feature1) {
    this.feature1Value = null;
    this.feature1Values = [...new Set(this.xaiSourceCopy.map(item => {
      return item.value[feature1].raw;
    }))].map(i => Number(i)).sort((a, b) => a - b);
    this.value1Ready = false;
  }

  getValueForFeature2(feature2) {
    this.feature2Value = null;
    this.feature2Values = [...new Set(this.xaiSourceCopy.map(item => {
      return item.value[feature2].raw;
    }))].map(i => Number(i)).sort((a, b) => a - b);
    this.value2Ready = false;
  }

  filterXaiTable() {
    let allData = this.rawData;
    if (!_isEmpty(this.feature1) && this.feature1Value !== null) {
      switch (this.operator1) {
        case 'Equals': {
          allData = allData.filter(item => {
            return Number(item.value[this.feature1].raw) === this.feature1Value;
          });
          break;
        }
        case 'Greater than': {
          allData = allData.filter(item => {
            return Number(item.value[this.feature1].raw) > Number(this.feature1Value);
          });
          break;
        }
        case 'Less than': {
          allData = allData.filter(item => {
            return Number(item.value[this.feature1].raw) < Number(this.feature1Value);
          });
          break;
        }
        case 'Not equals': {
          allData = allData.filter(item => {
            return Number(item.value[this.feature1].raw) !== Number(this.feature1Value);
          });
          break;
        }
      }
    }
    if (!_isEmpty(this.feature2) && this.feature2Value !== null) {
      switch (this.operator2) {
        case 'Equals': {
          allData = allData.filter(item => {
            return Number(item.value[this.feature2].raw) === this.feature2Value;
          });
          break;
        }
        case 'Greater than': {
          allData = allData.filter(item => {
            return Number(item.value[this.feature2].raw) > Number(this.feature2Value);
          });
          break;
        }
        case 'Less than': {
          allData = allData.filter(item => {
            return Number(item.value[this.feature2].raw) < Number(this.feature2Value);
          });
          break;
        }
        case 'Not equals': {
          allData = allData.filter(item => {
            return Number(item.value[this.feature2].raw) !== Number(this.feature2Value);
          });
          break;
        }
      }
    }
    if (this.target !== null) {
      allData = allData.filter(item => {
        return item.target === this.target;
      });
    }
    this.xaiSource = allData;
  }

  clearFilters() {
    this.feature1 = null;
    this.feature2 = null;
    this.feature1Value = null;
    this.feature2Value = null;
    this.target = null;
    this.operator1 = this.operators[0];
    this.operator2 = this.operators[0];
    this.xaiSource = this.rawData;
  }

  reload(event) {
    this.trackService.trackingMetrics(event, '33');

    // if (this.xaxis === this.oldXaxis && this.yaxis === this.oldYaxis) {
    this.featureChartReady = false;
    this.clearFilters();
    this.scatterLoader = true;
    this.count = this.count + 1;
    if (this.count === 15) {
      this.count = 0;
    }
    this.fetchOtherScatterCombinations();
    // } else {
    //   this.scatterLoader = true;
    //   this.fetchOtherScatterCombinations();
    // }
  }

  onDone() {
    if (sessionStorage.getItem('tourStartFrom') === 'setup') {
      this.router.navigate(['/setup']);
    } else if (sessionStorage.getItem('tourStartFrom') === 'overview') {
      this.router.navigate(['/overview']);
    }
    //
    sessionStorage.removeItem('tourStartFrom');
  }

  onNextLocalXAI() {
    this.loadDriftEvent.emit('driftLoad');
    // if (sessionStorage.getItem('tourStartFrom') === 'persona') {
    //   // emit an event that will tell to show drift again
    // }
  }
  clearSearch() {
    // this.projectSearchForm.patchValue({
    //   projectName: '',
    // });
  }

  onHoverSearchIcon() {
    this.iconText = 'clear';
  }

  onLeaveSearchIcon() {
    this.iconText = 'search';
  }
}
