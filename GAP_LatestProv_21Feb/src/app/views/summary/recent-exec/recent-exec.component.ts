import { Component, HostListener, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MlopsService } from 'src/app/mlops.service';
import cleanDeep from 'clean-deep';
import { get as _get, reduce as _reduce, isEmpty as _isEmpty, has as _has } from 'lodash';
import { UtilsService } from 'src/app/services/utils.service';
import { SummaryService } from '../summary.service';
import { ActivatedRoute } from '@angular/router';
import { ChartDataSets } from 'chart.js';

@Component({
  selector: 'app-recent-exec',
  templateUrl: './recent-exec.component.html',
  styleUrls: ['./recent-exec.component.scss'],
})
export class RecentExecComponent implements OnInit, OnChanges {
  public driftTrendData: any;
  public driftTrendLabels: any;
  loader: boolean;
  overallDrift = '0%';
  driftChartReady = false;
  driftAvailable: boolean;
  errorMsg: string;
  globalChartData: ChartDataSets[];
  globalChartLabels: any;
  public globalColors: any[] = [{ backgroundColor: [] }];
  @Input() projectId: any;
  @Input() execId: any;
  @Input() execType: any;
  @Input() projName: string;
  xaiChartReady = false;
  xaiHolder = false;
  driftHolder = false;
  firstN = 0;
  lastN: number;
  globalLength: any;
  globalXAIData: any;
  globalXAILabels: any;
  max: number;
  ifXaiChartReady: boolean;

  constructor(private mlopsService: MlopsService, private utilsService: UtilsService,
              private summaryService: SummaryService, private activatedRoute: ActivatedRoute) {
                this.execType = this.activatedRoute.snapshot.paramMap.get('type');
              }

  ngOnInit(): void {
    // this code was for saving calls to fetch drift and xai when you come back to recent tab from other tabs while on same screen
    // to do that optimisation later
    // save driftData and xaiData in summaryService, check if those exist when you come back to this tab, if exist, don't make api call(s)
    // if (this.summaryService.driftData && this.summaryService.xaiData) {
      // this.fetchSavedDriftData();
      // this.fetchSavedXaiData();
    // }

    if (this.execType === 'Drift, Explainability' || (this.execType.includes('drift') && this.execType.includes('explainability') )) {
      this.fetchDriftData(this.projectId, this.execId);
      this.globalExplainability();
      this.xaiHolder = true;
      this.driftHolder = true;
    } else if (this.execType === 'Explainability' || this.execType.includes('explainability')) {
      this.globalExplainability();
      this.xaiHolder = true;
      this.driftHolder = false;
    } else if (this.execType === 'Drift' || this.execType.includes('drift')) {
      this.fetchDriftData(this.projectId, this.execId);
      this.xaiHolder = false;
      this.driftHolder = true;
    }
  }

  // necessary atleast for project search case
  ngOnChanges(changes: SimpleChanges) {
    // console.log('changes in recent exec here: ', changes);
    if (_has(changes, 'execId')) {
      // console.log(changes);
      if (this.execType === 'Drift, Explainability' || (this.execType.includes('drift') && this.execType.includes('explainability') )) {
        this.fetchDriftData(this.projectId, this.execId);
        this.globalExplainability();
        this.xaiHolder = true;
        this.driftHolder = true;
      } else if (this.execType === 'Explainability' || this.execType.includes('explainability')) {
        this.globalExplainability();
        this.xaiHolder = true;
        this.driftHolder = false;
      } else if (this.execType === 'Drift' || this.execType.includes('drift')) {
        this.fetchDriftData(this.projectId, this.execId);
        this.xaiHolder = false;
        this.driftHolder = true;
      }
    }

    // this.doSomething(changes.desc.currentValue);
    // You can also use desc.previousValue and
    // desc.firstChange for comparing old and new values

  }

  // fetchSavedDriftData() {
  //   const data = this.summaryService.driftData;
  //   this.driftAvailable = true;
  //   this.overallDrift = (data.latestDrift * 100).toFixed(2) + '%';
  //   const driftTrendData = data.driftTrend
  //     .map((item) => item.driftValue)
  //     .map((x) => (x * 100).toFixed(2));
  //   const index = driftTrendData.findIndex((val) => {
  //     return val > 15;
  //   });
  //   const driftTrendtooltips = (data.driftTrend.map((i) => i.dateTime)).map((element) =>
  //         this.utilsService.formatDateTime(element));
  //   this.driftTrendLabels = Array.from({length: 20}, (_, i) => i + 1);
  //   this.driftTrendData = [
  //     { data: driftTrendData, borderWidth: 1.5, lineTension: 0, tooltip: driftTrendtooltips }];
  //   this.driftChartReady = true;
  // }

  fetchDriftData(projectId, execId) {
    this.loader = true;
    const payload = cleanDeep({
      projectId,
      execId,
    });
    this.mlopsService.driftData(payload).subscribe((res) => {
        // console.log('drift res', res);
        this.loader = false;
        if (_isEmpty(res.data.driftTrend)) {
          this.driftAvailable = false;
          this.errorMsg = 'No Successful Runs';
          this.driftTrendLabels = ['No Data'];
          this.driftTrendData = [
            { data: [], borderWidth: 1.5, lineTension: 0 },
          ];
          this.driftChartReady = true;
        } else {
          this.summaryService.driftData = res.data;
          this.driftAvailable = true;
          this.overallDrift = (res.data.latestDrift * 100).toFixed(2) + '%';
          const driftTrendData = res.data.driftTrend
            .map((item) => item.driftValue)
            .map((x) => (x * 100).toFixed(2));
          const index = driftTrendData.findIndex((val) => {
            return val > 15;
          });
          const driftTrendtooltips = (res.data.driftTrend.map((i) => i.dateTime)).map((element) =>
          this.utilsService.formatDateTime(element));
          this.driftTrendLabels = Array.from({length: 20}, (_, i) => i + 1);
          this.driftTrendData = [
            { data: driftTrendData, borderWidth: 1.5, lineTension: 0, tooltip: driftTrendtooltips }];
          this.driftChartReady = true;
        }
      },
      (err) => {
        this.loader = false;
      }
    );
  }

  globalExplainability() {
    this.mlopsService.getGlobalXai({ projectId: this.projectId }).subscribe(response => {
      if (_isEmpty(response.data)) {
        this.globalChartData = [{ data: []}];
        this.globalChartLabels = ['No Data'];
        this.ifXaiChartReady = false;
      } else {
      this.lastN = this.firstN + 5;
      const chartData = response.data.global_exp;
      this.globalXAIData = chartData.map(item => item.value.toFixed(2) * 100);
      this.globalXAILabels = chartData.map(item => item.label);
      this.max = this.utilsService.roundup(Math.ceil(Math.max(...this.globalXAIData)));
      this.globalChartData = [{ data: this.globalXAIData.slice(this.firstN, this.lastN), barThickness: 20}];
      this.globalChartLabels = this.globalXAILabels.slice(this.firstN, this.lastN);
      this.globalLength = this.globalXAILabels.length;
      this.globalChartColors();
      this.ifXaiChartReady = true;
    }
      this.xaiChartReady = true;
    }, err => {
      this.loader = false;
      console.log('error occurred');
    });
  }

  globalChartColors() {
    for (let i = 0; i < this.globalChartData[0].data.length; i++) {
      if (this.globalChartData[0].data[i] >= 0) {
        this.globalColors[0].backgroundColor[i] = 'rgba(170,177,196,255)';
      } else {
        this.globalColors[0].backgroundColor[i] = 'rgba(229,173,152,255)';
      }
    }
  }

  showPrevFeatures(event) {
    this.globalChartData = [{ data: this.globalXAIData.slice(event.first, event.last), barThickness: 20}];
    this.globalChartLabels = this.globalXAILabels.slice(event.first, event.last);
    this.globalChartColors();
  }

  showNextFeatures(event) {
    this.globalChartData = [{ data: this.globalXAIData.slice(event.first, event.last), barThickness: 20}];
    this.globalChartLabels = this.globalXAILabels.slice(event.first, event.last);
    this.globalChartColors();
  }

}
