import { Component, Input, OnInit } from '@angular/core';
import { ChartDataSets } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { MlopsService } from 'src/app/mlops.service';
import cleanDeep from 'clean-deep';
import { get as _get, reduce as _reduce, isEmpty as _isEmpty } from 'lodash';

@Component({
  selector: 'app-blurred',
  templateUrl: './blurred.component.html',
  styleUrls: ['./blurred.component.scss']
})
export class BlurredComponent implements OnInit {
  loader = false;
  overallAdmission = '0%';
  @Input() execId;
  @Input() pId;
  @Input() name;
  @Input() createdBy;
  // Gauge chart
  gaugeType = 'arch';
  gaugeValue = 0;
  gaugeAppendText = '%';
  // Bar Chart
  public barChartLabels: Label[] = ['1', '2', '3', '4', '5'];
  public barChartData: ChartDataSets[] = [{ data: [23, 50, 41, 10, 32], label: 'No Data', barThickness: 20 }];
  public metricLabels: Label[];
  public metricData: ChartDataSets[];
  buMetrics = ['First', 'Second', 'Third'];
  metricSelected = this.buMetrics[0];
  horChartReady = false;
  public metricColors: Color[] = [{ backgroundColor: '#e6beb3' }];
  insuranceValue: any;
  treatmentCost: any;
  readmissions: any;
  readmissionCost: any = '$ 0';

  // line chart
  lineChartLabels = ['1', '2', '3', '4', '5'];
  lineChartData = [{ data: [10, 30, 90, 40, 55], borderWidth: 1.5, lineTension: 0 },
   { data: [40, 10, 30, 70, 23], borderWidth: 1.5, lineTension: 0 }];

  // horizontal bar chart
  public horBarChartData: ChartDataSets[];
  public horBarChartLabels: string[];
  public horBarChartColors: Color[] = [{ backgroundColor: '#e6beb3' }];

  constructor(private mlopsService: MlopsService) { }

  ngOnInit(): void {
    // this.fetchBankData();
    // console.log(this.createdBy);
  }

  // fetchBankData() {

  //   const latestFeatures = {
  //     'State Bottle Cost_B': 0.6699745059013367,
  //     'State Bottle Cost_C': 0.6699745059013367,
  //     'State Bottle Cost_D': 0.6699745059013367,
  //     'State Bottle Cost_E': 0.6699745059013367,
  //     'State Bottle Retail': 0.8322656154632568,
  //     Sale: 0.6304230690002441,
  //   };

  //   const features = Object.values(latestFeatures).map(Number);
  //   this.horBarChartData = [
  //     {
  //       data: features.map((x) => (x * 100).toFixed(2)),
  //       barThickness: 20,
  //     },
  //   ];
  //   this.horBarChartLabels = Object.keys(latestFeatures);

  //   this.horChartReady = true;
  //   console.log('chart data: ', this.horBarChartData);
  //   console.log('chart labels: ', this.horBarChartLabels);
  //   console.log('chart colors: ', this.horBarChartColors);

  //   // this.loader = true;
  //   const payload = cleanDeep({
  //     projectId: this.pId,
  //     executionId: '6049d87262b3125900edf4fc',
  //     projectName: this.name,
  //     userType: 'admin'
  //   });
  //   // this.mlopsService.bankData(payload).subscribe((res) => {
  //   //     console.log('bank res', res);
  //   //     this.loader = false;
  //   //   },
  //   //     () => {
  //   //     this.loader = false;
  //   //   }
  //   // );
  // }

  // changebuMetric(event) {
  //   this.metricSelected = event.value;
  //   this.fetchBankData();
  // }

}
