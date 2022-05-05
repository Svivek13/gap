import { Component, Input, OnInit } from '@angular/core';
import { ChartDataSets } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { MlopsService } from 'src/app/mlops.service';
import cleanDeep from 'clean-deep';
import { get as _get, reduce as _reduce, isEmpty as _isEmpty } from 'lodash';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-diabetes',
  templateUrl: './diabetes.component.html',
  styleUrls: ['./diabetes.component.scss']
})
export class DiabetesComponent implements OnInit {
  loader = false;
  overallAdmission = '0%';
  @Input() execId;
  @Input() pId;
  @Input() name;
  @Input() createdBy;
  // Gauge chart
  // gaugeType = 'arch';
  readmissionValue = 0;
  nonReadmissionValue = 0;
  gaugeLabel = 'Days';
  // Bar Chart
  public barChartLabels: Label[] = ['1', '2', '3', '4', '5'];
  public barChartData: ChartDataSets[] = [{ data: [23, 50, 41, 10, 32], label: 'No Data', barThickness: 20 }];
  public metricLabels: Label[];
  public metricData: ChartDataSets[];
  buMetrics = ['Age', 'Gender', 'Ethnicity'];
  metricSelected = this.buMetrics[0];
  metricChartReady = false;
  public metricColors: Color[] = [{ backgroundColor: 'rgba(229,173,152,0.6)' }];
  insuranceValue: number;
  treatmentCost: number;
  readmissions: any;
  readmissionCost: any = '$ 0';
  totalReadmissions = '0';

  constructor(private mlopsService: MlopsService, private utilsService: UtilsService) { }

  ngOnInit(): void {
    this.fetchDiabetesData();
  }

  fetchDiabetesData() {
    this.loader = true;
    const payload = cleanDeep({
      projectId: this.pId,
      executionId: this.execId,
      projectName: this.name,
      userType: 'admin'
    });
    this.mlopsService.diabetesData(payload).subscribe((res) => {
        // console.log('diabetes res', res);
        this.loader = false;
        this.overallAdmission = res.data.metrics.overall_admission.toFixed(2) + '%';
        this.totalReadmissions = res.data.metrics.readmissions ? this.utilsService.numberWithCommas(res.data.metrics.readmissions) : '0';
        this.readmissionValue = res.data.metrics.avg_readmission_time ? res.data.metrics.avg_readmission_time.toFixed(2) : 0;
        this.nonReadmissionValue = res.data.metrics.avg_non_readmission_time ? res.data.metrics.avg_non_readmission_time.toFixed(2) : 0;
        this.readmissions = res.data.metrics.readmissions;
        if (this.metricSelected === 'Age') {
          this.metricData = [{data: res.data.metrics.Readmissions_by_Age.map(i => i.value.toFixed(2)), barThickness: 20}];
          this.metricLabels = res.data.metrics.Readmissions_by_Age.map(i => i.displaytext);
          this.metricChartReady = true;
        } else if (this.metricSelected === 'Gender') {
          this.metricData = [{data: res.data.metrics.Readmissions_by_Gender.map(i => i.value.toFixed(2)), barThickness: 20}];
          this.metricLabels = res.data.metrics.Readmissions_by_Gender.map(i => i.displaytext);
          this.metricChartReady = true;
        } else if (this.metricSelected === 'Ethnicity') {
          this.metricData = [{data: res.data.metrics.Readmissions_by_Ethnicity.map(i => i.value.toFixed(2)), barThickness: 20}];
          this.metricLabels = res.data.metrics.Readmissions_by_Ethnicity.map(i => i.displaytext);
          this.metricChartReady = true;
        }
      },
        () => {
        this.loader = false;
      }
    );
  }

  changebuMetric(event) {
    this.metricChartReady = false;
    this.metricSelected = event.value;
    this.fetchDiabetesData();
  }

  getCost() {
    if (Number(this.insuranceValue) >= Number(this.treatmentCost)) {
      this.readmissionCost = '$ ' + this.utilsService.nFormatter((this.readmissions * this.treatmentCost), 2);
    } else if (Number(this.insuranceValue) < Number(this.treatmentCost)) {
      this.readmissionCost = '$ ' + this.utilsService.nFormatter((this.readmissions * this.insuranceValue), 2);
    }
  }

}
