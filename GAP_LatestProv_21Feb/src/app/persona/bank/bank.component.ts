import { Component, Input, OnInit } from '@angular/core';
import { ChartDataSets } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { MlopsService } from 'src/app/mlops.service';
import cleanDeep from 'clean-deep';
import { get as _get, reduce as _reduce, isEmpty as _isEmpty } from 'lodash';

@Component({
  selector: 'app-bank',
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.scss']
})
export class BankComponent implements OnInit {
  loader = false;
  overallAdmission = '0%';
  @Input() execId;
  @Input() projId;
  @Input() projName;
  @Input() createdBy;
  // Bar Chart
  public arceBarChartLabels: Label[];
  public arceBarChartData: ChartDataSets[];
  arceChartReady: boolean;

  public metricLabels: Label[];
  public metricData: ChartDataSets[];
  horChartReady = false;
  public metricColors: Color[] = [{ backgroundColor: 'rgba(229,173,152,0.6)' }];
  insuranceValue: any;
  treatmentCost: any;
  readmissions: any;
  readmissionCost: any = '$ 0';

  // line chart
  lineChartLabels: any;
  lineChartData: any;

  // horizontal bar chart
  public arpcHorBarChartData: ChartDataSets[];
  public arpcHorBarChartLabels: string[];
  public arpcHorBarChartColors: Color[] = [{ backgroundColor: 'rgba(170,177,196,0.6)' }];
  arpcHorChartReady: boolean;

  public acHorBarChartData: ChartDataSets[];
  public acHorBarChartLabels: string[];
  public acHorBarChartColors: Color[] = [{ backgroundColor: 'rgba(170,177,196,0.6)' }];
  acHorChartReady: boolean;
  tdAdoptionRate: any;
  lineChartReady: boolean;


  constructor(private mlopsService: MlopsService) { }

  ngOnInit(): void {
    this.fetchBankData();
    // console.log(this.createdBy);
  }

  fetchBankData() {
    const payload = cleanDeep({
      projectId: this.projId,
      executionId: this.execId,
      projectName: this.projName,
      userType: 'admin'
    });
    this.loader = true;
    this.mlopsService.bankData(payload).subscribe((res) => {
        // console.log('bank res', res);
        const metrics = res.data.metrics;
        // console.log('bank metrics: ', metrics);
        this.refreshVars(metrics);
        this.loader = false;
      },
        () => {
        this.loader = false;
      }
    );
  }

  refreshVars(metrics: any) {
    this.tdAdoptionRate = metrics.TD_Adoption_Rate ? (metrics.TD_Adoption_Rate * 100).toFixed(2) + '%' : '0%';

    const AdoptionRate_Vs_PreviousCampaign = metrics.AdoptionRate_Vs_PreviousCampaign;
    this.arpcHorBarChartData = [
      {
        data: AdoptionRate_Vs_PreviousCampaign.map(item => (item.value * 100).toFixed(2)),
        barThickness: 20,
        tooltip: AdoptionRate_Vs_PreviousCampaign.map(item => item.customers)
      },
    ];
    this.arpcHorBarChartLabels = AdoptionRate_Vs_PreviousCampaign.map(item => item.displaytext);
    this.arpcHorChartReady = true;

    const Adoptions_Vs_Contacts = metrics.Adoptions_Vs_Contacts;
    this.acHorBarChartData = [
      {
        data: Adoptions_Vs_Contacts.map(item => item.value),
        barThickness: 20,
      },
    ];
    this.acHorBarChartLabels = Adoptions_Vs_Contacts.map(item => item.displaytext);
    this.acHorChartReady = true;

    const AdoptionRate_Vs_CurrentEngagement = metrics.AdoptionRate_Vs_CurrentEngagement;
    this.arceBarChartData = [
      {
        data: AdoptionRate_Vs_CurrentEngagement.map(item => (item.value * 100).toFixed(2)),
        barThickness: 20,
        tooltip: AdoptionRate_Vs_CurrentEngagement.map(item => item.customers)
      },
    ];
    this.arceBarChartLabels = AdoptionRate_Vs_CurrentEngagement.map(item => item.displaytext);
    this.arceChartReady = true;

    const Adoptions_Vs_Days = metrics.Adoptions_Vs_Days;
    this.lineChartData = [
      {
        data: Adoptions_Vs_Days.map(item => item.value),
        borderWidth: 1.5,
        lineTension: 0
      }
    ];
    this.lineChartLabels = Adoptions_Vs_Days.map(item => item.displaytext);
    this.lineChartReady = true;

  }

}
