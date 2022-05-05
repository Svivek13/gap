import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DriftComponent } from '../drift/drift.component';
import { MlopsService } from 'src/app/mlops.service';
import { map, startWith } from 'rxjs/operators';
import { get as _get, reduce as _reduce, isEmpty as _isEmpty, has as _has } from 'lodash';
import { ThemeService } from 'src/app/theme/theme.service';
import cleanDeep from 'clean-deep';
import { HorizontalBarChartComponent } from 'src/app/common-components/horizontal-bar-chart/horizontal-bar-chart.component';
import { UtilsService } from 'src/app/services/utils.service';
import * as moment from 'moment';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-drift-feature',
  templateUrl: './drift-feature.component.html',
  styleUrls: ['./drift-feature.component.scss']
})

export class DriftFeatureComponent implements OnInit {
  obj: any;
  horBarChartReady: boolean;
  horBarChartData: any
  horBarChartLabels: any;
  horBarChartColors: any
  featuresLength: any;
  horBarChartDataRev: any;
  horBarChartLabelsRev: any;
  featureErrorMsg: string;
  // horBarChartColorsRev: this.horBarChartColorsRev,
  featuresLengthRev: any;
  driftAvailable: boolean;
  driftAvailable2: boolean;
  public featureTrendData: any;
  featureTrendLabels: any;
  featureName: any;
  densityChartReady: boolean = false;
  densityChartReady1: boolean = false;
  densityTrendData: any;
  densityTrendDataRev: any;
  densityTrendDataSegment: any;
  driftFeaturesData: any;
  driftFeaturesLabels: any = [];
  chartReady: boolean = false;
  chartReady1: boolean = false;
  barClickedIndex: any;
  test: any;
  train: any;
  testCardRev: any;
  trainCardRev: any;
  driftProbability: boolean;
  featureTrendObj: any;
  featureNameRev: string;
  driftFeaturesDataRev: any;
  driftFeaturesLabelsRev: any;
  driftRevenue: any;
  brand: any;
  card: any;
  featureDataRev: any;
  featureData: any;
  featureLabel: any;
  featureLabelRev: any;
  model: any;
  location: any;
  modelSearchForm: FormGroup;
  @ViewChild(HorizontalBarChartComponent) chart;
  horBarChartReady1: boolean;
  public featureTrendDataRev: any;
  featureTrendLabelsRev: any;
  segmentList: any;
  densityChartReadySegment: boolean;
  segmentFilteredOption: Observable<string[]>;
  densityChartReady1Segment: boolean;
  densityTrendDataRevSegment: { data: any; label: string; pointRadius: number; }[];
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private drift: DriftComponent, private themeService: ThemeService, private mlopsService: MlopsService, private utilsService: UtilsService, private formBuilder: FormBuilder,) {
    this.obj = data
    this.modelSearchForm = this.formBuilder.group({
      segment: new FormControl(''),
    });
  }


  ngOnInit(): void {
    console.log(this.obj);

    this.model = this.obj.data.model;
    this.location = this.obj.data.location;
    this.card = this.obj.data.card;
    this.brand = this.obj.data.brand;
    this.horBarChartReady = this.obj.data.horBarChartReady;
    this.horBarChartReady1 = this.obj.data.horBarChartReady1;
    this.horBarChartData = this.obj.data.horBarChartData
    this.horBarChartLabels = this.obj.data.horBarChartLabels
    this.horBarChartColors = this.obj.data.horBarChartColors;
    this.featuresLength = this.obj.data.featuresLength;
    this.horBarChartDataRev = this.obj.data.horBarChartDataRev;
    this.horBarChartLabelsRev = this.obj.data.horBarChartLabelsRev;
    // horBarChartColorsRev: this.horBarChartColorsRev,
    this.featuresLengthRev = this.obj.data.featuresLengthRev;
    this.featureTrendDataRev = this.obj.data.featureTrendDataRev;
    this.driftAvailable = this.obj.data.driftAvailable;
    this.driftAvailable2 = this.obj.data.driftAvailable2;
    this.chartReady = this.obj.data.chartReady;
    this.chartReady1 = this.obj.data.chartReady1;
    this.featureTrendData = this.obj.data.featureTrendData;
    this.featureTrendLabels = this.obj.data.featureTrendLabels;
    this.featureTrendLabelsRev = this.obj.data.featureTrendLabelsRev;
    this.featureName = this.obj.data.featureName;
    this.featureLabel = this.obj.data.featureLabel;
    // this.densityChartReady = this.obj.data.densityChartReady;
    // this.densityTrendData = this.obj.data.densityTrendData;
    // this.densityTrendDataRev = this.obj.data.densityTrendDataRev;
    this.driftFeaturesData = this.obj.data.driftFeaturesData;
    this.driftFeaturesLabels = this.obj.data.driftFeaturesLabels;
    this.driftProbability = this.obj.data.driftProbability;
    this.driftFeaturesDataRev = this.obj.data.driftFeaturesDataRev;
    this.driftFeaturesLabelsRev = this.obj.data.driftFeaturesLabelsRev;
    this.driftRevenue = this.obj.data.driftRevenue;
    this.featureNameRev = this.obj.data.featureNameRev;
    // this.densityChartReady1 = this.obj.data.densityChartReady1;
    this.featureTrendObj = this.obj.data.featureTrendObj;
    this.featureData = this.obj.data.sortFeatureData;
    this.featureDataRev = this.obj.data.sortFeatureDataRev;
    this.featureLabelRev = this.obj.data.featureLabelRev;
    if (this.model == 'Direct_Mail') {
      if (this.driftProbability) {
        this.getSegmentFilter();
        this.fetchTestTrainDataCoreCardProb();
        setTimeout(() => { this.fetchSegmentTestTrainGraph() }, 3000)

      } else if (this.driftRevenue) {
        this.getSegmentFilter();
        this.fetchtesttrainDataCoreCardRev();
        setTimeout(() => { this.fetchSegmentTestTrainGraphRev() }, 3000)
      }
    } else {
      this.fetchTestTrainDataGraph();
    }
  }
  private _filterSegment(name: string): any {
    const filterValue = name.toLowerCase();
    return this.segmentList.filter(
      (option) => option.toLowerCase().indexOf(filterValue) >= 0
    );
  }
  getSegmentFilter() {
    const obj = { model: "Segment_Wise_DM", brand: this.brand }
    this.mlopsService.segementFilter(obj)
      .subscribe((res) => {
        this.segmentList = res.data;
        this.modelSearchForm.patchValue({
          segment: this.segmentList[0]
        });
      
        this.segmentFilteredOption = this.modelSearchForm.get('segment')
          .valueChanges.pipe(
            startWith(''),
            map(value => typeof value === 'string' ? value : value.value),
            map((name) => {
              return name ? this._filterSegment(name) : this.segmentList.slice();
            }),
            map((name) => this._filterSegment(name))
          );
      })

  }
  displayFnSegment(subject) {
    return subject ? subject : undefined;
  }
  showNextFeatures(event) {
   
    this.horBarChartData = [
      {
        data: this.driftFeaturesData.slice(event.first, event.last),
        barThickness: 15,
      },
    ];
    this.horBarChartLabels = this.driftFeaturesLabels.slice(
      event.first,
      event.last
    );
    this.featuresColors();
  }
  showPrevFeatures(event) {
   
    this.horBarChartData = [
      {
        data: this.driftFeaturesData.slice(event.first, event.last),
        barThickness: 15,
      },
    ];
    this.horBarChartLabels = this.driftFeaturesLabels.slice(
      event.first,
      event.last
    );
    this.featuresColors();
  }
  showPrevFeaturesRev(event) {
    // this.trackService.trackingMetrics('nav', '31');
    this.horBarChartDataRev = [
      {
        data: this.driftFeaturesDataRev.slice(event.first, event.last),
        barThickness: 15,
      },
    ];
    this.horBarChartLabelsRev = this.driftFeaturesLabelsRev.slice(
      event.first,
      event.last
    );
    this.featuresColorsRev();
  }

  showNextFeaturesRev(event) {
    //  this.trackService.trackingMetrics('nav', '31');
    this.horBarChartDataRev = [
      {
        data: this.driftFeaturesDataRev.slice(event.first, event.last),
        barThickness: 15,
      },
    ];
    this.horBarChartLabelsRev = this.driftFeaturesLabelsRev.slice(
      event.first,
      event.last
    );
    this.featuresColorsRev();
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




  getFeatureTrendForYAxisLabel(event) {
    console.log(event);

    if (this.driftProbability) {
      this.featuresColors();
      // this.trackService.trackingMetrics(event, '28');
      console.log(event);

      this.barClickedIndex = event._index;
      this.changeBarColorClicked(this.barClickedIndex);
      this.chart.chart.update();
      this.featureName = event._model._label;

      // const featureData = _reduce(
      //   this.featureTrendObj,
      //   (acc, item) => {
      //     const featuredValue = _get(
      //       item,
      //       `featureDetails.${this.featureName}`
      //     );
      //     acc.push(featuredValue);
      //     return acc;
      //   },
      //   []
      // );
      const featureTrendTooltips = this.featureLabel[this.featureName]
      // const featureTrendTooltips = this.featureTrendObj
      //   .map((i) => i.dateTime)
      //   .map((element) => this.utilsService.formatDateTime(element));
      this.featureTrendData = [
        {
          data: [((this.featureData[this.featureName]) * 100).toFixed(2)],
          borderWidth: 1.5,
          lineTension: 0,
          tooltip: [(moment.utc(featureTrendTooltips).format('MM/DD/YYYY'))],
        },
      ];
      this.featureTrendLabels = this.featureTrendLabels;
      this.densityChartReady = false;
      this.fetchTestTrainData();
    }
    else if (this.driftRevenue) {
      this.featuresColorsRev();
      //  this.trackService.trackingMetrics(event, '28');

      this.barClickedIndex = event._index;
      this.changeBarColorClicked(this.barClickedIndex);
      this.chart.chart.update();
      this.featureNameRev = event._model._label;

      // const featureData = _reduce(
      //   this.featureTrendObj,
      //   (acc, item) => {
      //     const featuredValue = _get(
      //       item,
      //       `featureDetails.${this.featureNameRev}`
      //     );
      //     acc.push(featuredValue);
      //     return acc;
      //   },
      //   []
      // );
      const featureTrendTooltips = this.featureLabelRev[this.featureNameRev]
      // const featureTrendTooltips = this.featureTrendObj
      //   .map((i) => i.dateTime)
      //   .map((element) => this.utilsService.formatDateTime(element));
      console.log(this.featureTrendDataRev);

      this.featureTrendDataRev = [
        {
          data: [((this.featureDataRev[this.featureNameRev]) * 100).toFixed(2)],
          borderWidth: 1.5,
          lineTension: 0,
          tooltip: [(moment.utc(featureTrendTooltips).format('MM/DD/YYYY'))],
        },
      ];

      this.featureTrendLabelsRev = this.featureTrendLabelsRev;
      this.densityChartReady1 = false;
      this.fetchTestTrainData();
    }

  }
  fetchTestTrainData() {
   
    if (this.model == 'Direct_Mail') {
      if (this.driftProbability) {
        this.fetchTestTrainDataCoreCardProb();
        this.fetchSegmentTestTrainGraph();
      } else if (this.driftRevenue) {
        this.fetchtesttrainDataCoreCardRev();
        this.fetchSegmentTestTrainGraphRev();
      }
    } else {
      this.fetchTestTrainDataGraph();
    }

  }
  getFeatureTrend(event) {
    console.log("inside Feature Trend");
    
    // this.trackService.trackingMetrics(event, '28');
    if (this.driftProbability) {
      this.featuresColors();
      if (event.active.length > 0) {
        this.barClickedIndex = event.active[0]._index;
        this.changeBarColorClicked(this.barClickedIndex);
        this.chart.chart.update();
        this.featureName = event.active[0]._model.label;
      
        // const featureData = _reduce(
        //   this.featureTrendObj,
        //   (acc, item) => {
        //     const featuredValue = _get(
        //       item,
        //       `featureDetails.${this.featureName}`
        //     );
        //     acc.push(featuredValue);
        //     return acc;
        //   },
        //   []
        // );
        const featureTrendTooltips = this.featureLabel[this.featureName]
        // const featureTrendTooltips = this.featureTrendObj
        //   .map((i) => i.dateTime)
        //   .map((element) => this.utilsService.formatDateTime(element));
        this.featureTrendData = [
          {
            data: [((this.featureData[this.featureName]) * 100).toFixed(2)],
            borderWidth: 1.5,
            lineTension: 0,
            tooltip: [(moment.utc(featureTrendTooltips).format('MM/DD/YYYY'))],
          },
        ];
        this.featureTrendLabels = this.featureTrendLabels;
        this.densityChartReady = false;
        // this.fetchTestTrainData();
      }
      // if (this.model == 'Direct_Mail') {
      //   this.fetchTestTrainDataCoreCardProb();
      //   this.fetchSegmentTestTrainGraph();
      // } else {
      //   this.fetchTestTrainDataGraph();
      //   this.fetchSegmentTestTrainGraphRev();
      // }
      this.fetchTestTrainData();

    } else if (this.driftRevenue) {
      this.featuresColorsRev();
      if (event.active.length > 0) {
        this.barClickedIndex = event.active[0]._index;
        this.changeBarColorClicked(this.barClickedIndex);
        this.chart.chart.update();
        this.featureNameRev = event.active[0]._model.label;
        // const featureData = _reduce(
        //   this.featureTrendObj,
        //   (acc, item) => {
        //     const featuredValue = _get(
        //       item,
        //       `featureDetails.${this.featureNameRev}`
        //     );
        //     acc.push(featuredValue);
        //     return acc;
        //   },
        //   []
        // );
        const featureTrendTooltips = this.featureLabelRev[this.featureNameRev];
        // const featureTrendTooltips = this.featureTrendObj
        //   .map((i) => i.dateTime)
        //   .map((element) => this.utilsService.formatDateTime(element));
        this.featureTrendDataRev = [
          {
            data: [((this.featureDataRev[this.featureNameRev]) * 100).toFixed(2)],
            borderWidth: 1.5,
            lineTension: 0,
            tooltip: [(moment.utc(featureTrendTooltips).format('MM/DD/YYYY'))],
          },
        ];
        this.featureTrendLabels = this.featureTrendLabels;
        this.densityChartReady1 = false;

        // this.fetchTestTrainData();
      }
     // this.fetchtesttrainDataCoreCardRev();
     this.fetchTestTrainData();

    }


  }

  fetchtesttrainDataCoreCardRev() {
    this.densityChartReady1 = false;
    this.densityChartReady = false;
    const object = cleanDeep({
      model:this.model,
      brand: this.brand,
      card_type: this.card,
      model_type: "revenue",
    });
   
    if (!_isEmpty(object)) {
      this.mlopsService.testDensity(object)
        .subscribe((res) => {
          if (res.data) {
            this.testCardRev = res.data[0][this.featureNameRev];
            this.mlopsService
              .trainDensity(object)
              .subscribe((res) => {
                if (res.data) {

                  this.trainCardRev = res.data[0][this.featureNameRev];
                  if (this.testCardRev) {
                    const trainCardRevData = this.trainCardRev.x.map((item, index) => {
                      return {
                        x: item.toFixed(2),
                        y: (this.trainCardRev.y[index]).toFixed(2),
                      };
                    });

                    const testCardRevData = this.testCardRev.x.map((item, index) => {
                      return {
                        x: item.toFixed(2),
                        y: (this.testCardRev.y[index]).toFixed(2),
                      };
                    });

                    this.densityTrendDataRev = [
                      { data: testCardRevData, label: 'Test Data', pointRadius: 0 },
                      { data: trainCardRevData, label: 'Train Data', pointRadius: 0 },
                    ];

                    this.densityChartReady1 = true;
                  }
                }
              });

          }
        })

    }



  }

  fetchTestTrainDataCoreCardProb() {
    this.densityChartReady = false;
    this.densityChartReady1 = false;
    const object = cleanDeep({
      model:this.model,
      brand: this.brand,
      card_type: this.card,
      model_type: "probability",

    });

    if (!_isEmpty(object)) {
      this.mlopsService.testDensity(object)
        .subscribe((res) => {
          if (res.data) {
            this.test = res.data[0][this.featureName];
            this.mlopsService
              .trainDensity(object)
              .subscribe((res) => {
                if (res.data) {

                  this.train = res.data[0][this.featureName];
                  if (this.test) {
                    const trainData = this.train.x.map((item, index) => {
                      return {
                        x: item.toFixed(2),
                        y: (this.train.y[index]).toFixed(2),
                      };
                    });

                    const testData = this.test.x.map((item, index) => {
                      return {
                        x: item.toFixed(2),
                        y: (this.test.y[index]).toFixed(2),
                      };
                    });

                    this.densityTrendData = [
                      { data: testData, label: 'Test Data', pointRadius: 0 },
                      { data: trainData, label: 'Train Data', pointRadius: 0 },
                    ];

                    this.densityChartReady = true;
                  }
                }
              });
          }
        })
    }


  }
  fetchTestTrainDataGraph() {
    this.densityChartReady = false;
    this.densityChartReady1 = false;
    const object = cleanDeep({
      model: this.model,
      location: this.location,
      brand: this.brand,

    });
    if (!_isEmpty(object)) {
      this.mlopsService.testDensity(object)
        .subscribe((res) => {
          if (res.data) {
            this.test = res.data[0][this.featureName];
            this.mlopsService
              .trainDensity(object)
              .subscribe((res) => {
                if (res.data) {

                  this.train = res.data[0][this.featureName];
                  if (this.test) {
                    const trainData = this.train.x.map((item, index) => {
                      return {
                        x: item.toFixed(2),
                        y: (this.train.y[index]).toFixed(2),
                      };
                    });

                    const testData = this.test.x.map((item, index) => {
                      return {
                        x: item.toFixed(2),
                        y: (this.test.y[index]).toFixed(2),
                      };
                    });

                    this.densityTrendData = [
                      { data: testData, label: 'Test Data', pointRadius: 0 },
                      { data: trainData, label: 'Train Data', pointRadius: 0 },
                    ];

                    this.densityChartReady = true;
                  }
                }
              });
          }
        })
    }
  }

  fetchSegmentTestTrainGraph() {

    this.densityChartReadySegment = false;
    this.densityChartReady1Segment = false;
    const object = cleanDeep({
      model: "Segment_Wise_DM",
      brand: this.brand,
      card_type: this.card,
      model_type: "probability",
      segment: this.modelSearchForm.value.segment

    });
    if (!_isEmpty(object)) {
      this.mlopsService.testSegmentDensity(object)
        .subscribe((res) => {
          if (res.data) {
            this.test = res.data[0][this.featureName];
            this.mlopsService
              .trainSegmentDensity(object)
              .subscribe((res) => {
                if (res.data) {

                  this.train = res.data[0][this.featureName];
                  if (this.test) {
                    const trainData = this.train.x.map((item, index) => {
                      return {
                        x: item.toFixed(2),
                        y: (this.train.y[index]).toFixed(2),
                      };
                    });

                    const testData = this.test.x.map((item, index) => {
                      return {
                        x: item.toFixed(2),
                        y: (this.test.y[index]).toFixed(2),
                      };
                    });

                    this.densityTrendDataSegment = [
                      { data: testData, label: 'Test Data', pointRadius: 0 },
                      { data: trainData, label: 'Train Data', pointRadius: 0 },
                    ];

                    this.densityChartReadySegment = true;
                  }
                }
              });
          }
        })
    }
  }
  fetchSegmentTestTrainGraphRev() {
    this.densityChartReadySegment = false;
    this.densityChartReady1Segment = false;
    const object = cleanDeep({
      model: "Segment_Wise_DM",
      brand: this.brand,
      card_type: this.card,
      model_type: "revenue",
      segment: this.modelSearchForm.value.segment

    });
    if (!_isEmpty(object)) {
      this.mlopsService.testSegmentDensity(object)
        .subscribe((res) => {
          if (res.data) {
            this.test = res.data[0][this.featureNameRev];
            
            this.mlopsService
              .trainSegmentDensity(object)
              .subscribe((res) => {
                if (res.data) {
                  
                  this.train = res.data[0][this.featureNameRev];
                  if (this.test) {
                    
                    const trainData = this.train.x.map((item, index) => {
                      return {
                        x: item.toFixed(2),
                        y: (this.train.y[index]).toFixed(2),
                      };
                    });

                    const testData = this.test.x.map((item, index) => {
                      return {
                        x: item.toFixed(2),
                        y: (this.test.y[index]).toFixed(2),
                      };
                    });

                    this.densityTrendDataRevSegment = [
                      { data: testData, label: 'Test Data', pointRadius: 0 },
                      { data: trainData, label: 'Train Data', pointRadius: 0 },
                    ];
                    
                    this.densityChartReady1Segment = true;
                  }
                }
              });
          }
        })
    }
  }

  selectSegmentWiseDensity() {
    if (this.driftProbability) {
      this.fetchSegmentTestTrainGraph();

    } else if (this.driftRevenue) {
      this.fetchSegmentTestTrainGraphRev();
    }
  }
}
