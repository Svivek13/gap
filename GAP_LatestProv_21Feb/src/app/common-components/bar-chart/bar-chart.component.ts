import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective, Color, Label } from 'ng2-charts';
import { Subject } from 'rxjs';
import { MlopsService } from 'src/app/mlops.service';
import { UtilsService } from 'src/app/services/utils.service';
import cleanDeep from 'clean-deep';
interface ExtendedChartDataSets extends ChartDataSets {
  tooltip?: any;
}

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnInit {

  @ViewChild(BaseChartDirective) public chart: BaseChartDirective;
  @Input() xLabel: string;
  @Input() yLabel: string;
  public barChartOptions: ChartOptions;
  public barChartType: ChartType = 'bar';
  @Input() barChartLegend: boolean;
  public barChartPlugins = [];
  @Input() barChartColors: Color[];
  @Input() yAxisRep: string;
  @Input() barChartLabels: Label[];
  @Input() barChartData: ExtendedChartDataSets[];
  ticksColor = 'rgba(130,131,132,255)';
  gridsColor = 'rgba(199,205,207,255)';

  constructor(private mlopsService: MlopsService) { }

  ngOnInit(): void {
    const colors = this.mlopsService.fetchChartColorTheme();
    this.ticksColor = colors.ticksColor;
    this.gridsColor = colors.gridsColor;
    this.subjectUpdates();
    this.barChartOptionsMethod({ yAxisRep: this.yAxisRep });
  }

  subjectUpdates() {
    this.mlopsService.themeSubject.subscribe(data => {
      const colors = this.mlopsService.fetchChartColorTheme();
      this.ticksColor = colors.ticksColor;
      this.gridsColor = colors.gridsColor;
      this.barChartOptionsMethod({ yAxisRep: this.yAxisRep });
    });
  }

  barChartOptionsMethod({ yAxisRep }) {
    // console.log(yAxisRep, 'check');
    this.barChartOptions = {
      responsive: true,
      tooltips: {
        callbacks: {
          afterLabel(tooltipItem, data) {
            if (data.datasets[0].tooltip) {
              const tooltiplabel = data.datasets[0].tooltip;
              const value = 'Week: ' + tooltiplabel[tooltipItem.index];
              return value;
            }
          }
        },
      },
      scales: {
        xAxes: [
          {
            gridLines: {
              display: true,
              drawOnChartArea: false,
              color: this.gridsColor
            },
            scaleLabel: {
              display: true,
              labelString: this.xLabel,
              fontSize: 10,
              fontFamily: '"Montserrat", sans-serif',
              fontColor: this.ticksColor
            },
            time: {
              unit: "week",
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
                  // console.log('label array see: ', array);
                  return array;
                } else {
                  return label;
                }
              }
            },
          },
        ],
        yAxes: [
          {
            gridLines: {
              display: true,
              color: this.gridsColor
            },
            scaleLabel: {
              display: true,
              labelString: this.yLabel,
              fontSize: 10,
              fontFamily: '"Montserrat", sans-serif',
              fontColor: this.ticksColor
            },
            ticks: {
              beginAtZero: false,
              // stepSize: 20 ,
              maxTicksLimit: 5,
              fontSize: 10,
              fontFamily: '"Montserrat", sans-serif',
              fontColor: this.ticksColor,
              callback(value, index, values, yAxisReps= yAxisRep) {
                if (parseInt(value, 10) >= 1000) {
                  value = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                  if (yAxisReps === 'percentage'){
                    return value + '%';
                  }
                  return value;
                } else  {
                  // console.log('check', yAxisReps);
                  if (yAxisReps === 'percentage'){
                    return value + '%';
                  }
                  return value;
                }
              },
            },
          },
        ],
      },
    };
  }

}
