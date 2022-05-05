import { Component, Input, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import cleanDeep from 'clean-deep';
import { get as _get, reduce as _reduce, isEmpty as _isEmpty } from 'lodash';
import { MlopsService } from 'src/app/mlops.service';

@Component({
  selector: 'app-telco',
  templateUrl: './telco.component.html',
  styleUrls: ['./telco.component.scss']
})
export class TelcoComponent implements OnInit {
  loader = false;
  overallChurn = '34.6%';
  prodMixChartReady = false;
  @Input() projId;
  @Input() execId;
  @Input() projName;
  @Input() createdBy;
  // Bar Chart
  public prodMixChartLabels: Label[];
  public prodMixChartData: ChartDataSets[];
  public metricColors: Color[] = [{ backgroundColor: 'rgba(170,177,196,0.6)' }];
  public churnColors: Color[] = [{ backgroundColor: 'rgba(229,173,152,0.6)' }];
  // Pie Chart
  public monthlyRevenueChartLabels = ['Revenue at Risk', 'Secured Revenue'];
  public monthlyRevenueChartData: any;
  pieChartReady = false;
  metrics = ['Payment Mode', 'Tech Support'];
  metricSelected = this.metrics[0];
  // Combo Chart
  public comboChartOptions: ChartOptions;
  public comboChartType: ChartType = 'bar';
  public comboChartLegend = false;
  public tenureAvgChartData: ChartDataSets[];
  public tenureAvgChartLabels: string[];
  highestProduct: string;
  lowestProduct: string;
  metricData: { data: any; barThickness: number; }[];
  metricLabels: any;
  metricChartReady = false;
  comboChartReady = false;
  public mixColors = [
    { backgroundColor: 'rgba(170,177,196,0.6)' },
    {
      borderColor: '#F27B50',
      backgroundColor: 'transparent',
      pointBackgroundColor: 'white'
    }
  ];
  public pieChartColors = [{
    backgroundColor: ['rgba(170,177,196,0.6)', 'rgba(242, 123, 80, 0.6)']
 }];
  ticksColor = 'rgba(130,131,132,255)';
  gridsColor = 'rgba(199,205,207,255)';
  revenues: any[];

  constructor(private mlopsService: MlopsService) { }

  ngOnInit(): void {
    const colors = this.mlopsService.fetchChartColorTheme();
    this.ticksColor = colors.ticksColor;
    this.gridsColor = colors.gridsColor;
    this.fetchComboChartOptions();
    this.fetchTelcoData();
    this.subjectUpdates();
  }

  subjectUpdates() {
    this.mlopsService.themeSubject.subscribe(data => {
      const colors = this.mlopsService.fetchChartColorTheme();
      this.ticksColor = colors.ticksColor;
      this.gridsColor = colors.gridsColor;
      this.fetchComboChartOptions();
    });
  }

  fetchComboChartOptions() {
    this.comboChartOptions = {
      responsive: true,
      // tooltips: {
      //   callbacks: {
      //     label(tooltipItem, data) {
      //       if (data.datasets[1]) {
      //         const tooltiplabel = data.datasets[1];
      //         const value = '$ ' + tooltiplabel.data[tooltipItem.index];
      //         return value;
      //       }
      //     }
      //   },
      // },
      scales: {
        xAxes: [{
          gridLines: {
                display: true,
                drawOnChartArea: false,
                color: this.gridsColor
              },
          ticks: {
            fontSize: 10,
            fontFamily: '"Montserrat", sans-serif',
            fontColor: this.ticksColor,
            callback(label, index, labels) {
              if (typeof label === 'string') {
                let array = label.split(' ');
                const reducer = (array) => {
                      let callAgain;
                      for (let i = 0; i < array.length - 1; i++) {
                        if (array[i].length + array[i + 1].length < 10) {
                          array[i] = array[i].trim() + ' ' + array[i + 1].trim();
                          array[i + 1] = '';
                          callAgain = true;
                        }
                      }
                      if (callAgain === true) {
                        array = cleanDeep(array);
                        return reducer(array);
                      } else {
                        return [...array];
                      }
                    };
                if (array.length === 1) {
                      return [label.slice(0, 10), label.slice(10, 20)];
                    } else {
                      array = reducer(array);
                    }
                return array;
              } else {
                return label;
              }
            }
        }
        }],
        yAxes: [{
          id: 'y-axis-0',
          position: 'left',
          gridLines: {
            display: true,
            drawOnChartArea: false,
            color: this.gridsColor
          },
      ticks: {
        beginAtZero: true,
        maxTicksLimit: 5,
        fontSize: 10,
        fontColor: this.ticksColor,
        fontFamily: '"Montserrat", sans-serif'
    }
        },
        {
          id: 'y-axis-1',
          position: 'right',
          gridLines: {
            display: true,
            drawOnChartArea: true,
            color: this.gridsColor
          },
      ticks: {
        beginAtZero: true,
        maxTicksLimit: 5,
        fontSize: 10,
        fontColor: this.ticksColor,
        fontFamily: '"Montserrat", sans-serif',
        callback(value, index, values) {
              return '$' + value;
        }
    }
        }
      ]
      },
      elements: {
        line: {
          fill: false
        }
    }
    };
  }

  fetchTelcoData() {
    this.loader = true;
    const payload = cleanDeep({
      projectId: this.projId,
      executionId: this.execId,
      projectName: this.projName,
      userType: 'admin'
    });
    this.mlopsService.telcoData(payload).subscribe((res) => {
        this.loader = false;
        this.overallChurn = res.data.metrics.Overall_Churn_Rate.toFixed(2) + '%';
        const productMixData = res.data.metrics.Churners_By_ProductMix;
        this.highestProduct = (productMixData.reduce((prev, current) => (+prev.value > +current.value) ? prev : current)).displaytext;
        this.lowestProduct = (productMixData.reduce((prev, current) => (+prev.value < +current.value) ? prev : current)).displaytext;
        this.prodMixChartLabels = productMixData.map(item => item.displaytext);
        this.prodMixChartData = [{ data: productMixData.map(item => item.value.toFixed(2)), barThickness: 20 }];
        this.prodMixChartReady = true;
        const totalRevenue = res.data.metrics.Revenue_At_Risk + res.data.metrics.Secured_Revenue;
        this.revenues = [res.data.metrics.Revenue_At_Risk.toFixed(2), res.data.metrics.Secured_Revenue.toFixed(2)];
        const revenuepercent = (res.data.metrics.Revenue_At_Risk / totalRevenue ) * 100;
        const securepercent = (res.data.metrics.Secured_Revenue / totalRevenue ) * 100;
        this.monthlyRevenueChartData = [revenuepercent.toFixed(2), securepercent.toFixed(2)];
        this.pieChartReady = true;
        if (this.metricSelected === 'Payment Mode') {
          this.metricData = [{data: res.data.metrics.Churners_By_PaymentMode.map(i => i.value.toFixed(2)), barThickness: 20}];
          this.metricLabels = res.data.metrics.Churners_By_PaymentMode.map(i => i.displaytext);
          this.metricChartReady = true;
        } else if (this.metricSelected === 'Tech Support') {
          this.metricData = [{data: res.data.metrics.Churners_By_TechSupport.map(i => i.value.toFixed(2)), barThickness: 20}];
          this.metricLabels = res.data.metrics.Churners_By_TechSupport.map(i => i.displaytext);
          this.metricChartReady = true;
        }
        this.tenureAvgChartData = [
          { data: res.data.metrics.Tenure_Vs_Customers.map(i => i.value.toFixed(2)), barThickness: 20 },
          { data: res.data.metrics.Tenure_Vs_Average.map(i => i.value.toFixed(2)), type: 'line', yAxisID: 'y-axis-1' }
        ];
        this.tenureAvgChartLabels = res.data.metrics.Tenure_Vs_Average.map(i => i.displaytext);
        this.comboChartReady = true;
      },
        () => {
        this.loader = false;
      }
    );
  }

  changeTelcoMetric(event) {
    this.metricChartReady = false;
    this.metricSelected = event.value;
    this.fetchTelcoData();
  }

}
