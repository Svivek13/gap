import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { BaseChartDirective, Color, Label } from 'ng2-charts';

import 'chartjs-plugin-annotation';
import 'chartjs-plugin-zoom';

import cleanDeep from 'clean-deep';
import { MlopsService } from 'src/app/mlops.service';
declare var $: any;

interface ExtendedChartDataSets extends ChartDataSets {
  tooltip?: any;
}

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit {

  @ViewChild(BaseChartDirective) public chart: BaseChartDirective;
  @Input() lineChartData: ExtendedChartDataSets[];
  @Input() lineChartLabels: Label[];
  @Input() driftTrend: boolean;
  @Input() buTemps: boolean;
  @Input() recentExec: boolean;
  @Input() xLabel: string;
  @Input() yLabel: string;
  public buLineChartOptions: (ChartOptions & { annotation: any });
  public lineChartColors: Color[];
  // public lineChartType = 'line';
  public lineChartPlugins = [];
  label: any;
  ticksColor = 'rgba(130,131,132,255)';
  gridsColor = 'rgba(199,205,207,255)';
  @Output() lineChartClickEvent = new EventEmitter<any>();
  @Input() lineChartName: string;
  
  public driftLineChartOptions: ChartOptions;

  constructor(private mlopsService: MlopsService) {

   }


  ngOnInit(): void {
    const colors = this.mlopsService.fetchChartColorTheme();
    this.ticksColor = colors.ticksColor;
    this.gridsColor = colors.gridsColor;
    this.lineChartOptions();
    this.subjectUpdates();
  }

  subjectUpdates() {
    this.mlopsService.themeSubject.subscribe(data => {
      const colors = this.mlopsService.fetchChartColorTheme();
      this.ticksColor = colors.ticksColor;
      this.gridsColor = colors.gridsColor;
      this.lineChartOptions();
    });
  }

  lineChartOptions() {
    if (this.lineChartName === 'driftTrend') {
      this.driftLineChartOptions = {
        responsive: true,
        legend: {
          display: false
        },
        tooltips: {
          mode: 'x-axis',
          // usePointStyle: true,
          callbacks: {
            // labelPointStyle: (context) => {
            //     return {
            //         pointStyle: 'circle',
            //         rotation: 0
            //     };
            // },
            title(tooltipItem, data) {
              const tooltiplabel = data.datasets[0].tooltip;
              const value = 'Time: ' + tooltiplabel[tooltipItem[0].index];
              return value;
            },
            label(tooltipItem, data) {
              const tooltiplabel = data.datasets[0].data;
              const value = tooltiplabel[tooltipItem.index];
              return value + '%';
            }
          }
        },
        scales: {
          xAxes: [{
            gridLines: {
              display: true,
              drawOnChartArea: false,
              color: this.gridsColor
            },
            scaleLabel: {
              display: true,
              labelString: 'Execution Date',
              fontSize: 10,
              fontFamily: '"Montserrat", sans-serif',
              fontColor: this.ticksColor
            },
            ticks: {
              fontSize: 10,
              fontFamily: '"Montserrat", sans-serif',
              fontColor: this.ticksColor
            }
          }],
          yAxes: [{
            gridLines: {
              display: true,
              color: this.gridsColor
            },
            scaleLabel: {
              display: true,
              labelString: 'Drift (in %)',
              fontSize: 10,
              fontFamily: '"Montserrat", sans-serif',
              fontColor: this.ticksColor
            },
            ticks: {
              beginAtZero: true,
              min: 0,
              max: 100,
              stepSize: 20,
              fontSize: 10,
              fontFamily: '"Montserrat", sans-serif',
              fontColor: this.ticksColor,
              callback(value) {
                return value + '%';
              }
            }
          }]
        }
      };
      this.lineChartColors = [
        {
          borderColor: '#F27B50',
          backgroundColor: 'transparent',
          pointBackgroundColor: 'white'
        },
        {
          borderColor: 'grey',
          backgroundColor: 'transparent',
          pointBackgroundColor: 'white'
        }
      ];
    } else if (this.lineChartName === 'buTemps') {
      this.driftLineChartOptions = {
        responsive: true,
        legend: {
          display: false
        },
        tooltips: {
          mode: 'x-axis'
        },
        scales: {
          xAxes: [{
            gridLines: {
              display: true,
              drawOnChartArea: false,
              color: this.gridsColor
            },
            scaleLabel: {
              display: true,
              labelString: this.xLabel,
              fontSize: 10,
              fontColor: this.ticksColor,
              fontFamily: '"Montserrat", sans-serif'
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
            }
          }],
          yAxes: [{
            gridLines: {
              display: true,
              color: this.gridsColor
            },
            scaleLabel: {
              display: true,
              labelString: this.yLabel,
              fontSize: 10,
              fontColor: this.ticksColor,
              fontFamily: '"Montserrat", sans-serif'
            },
            ticks: {
              beginAtZero: true,
              maxTicksLimit: 5,
              fontSize: 10,
              fontFamily: '"Montserrat", sans-serif',
              fontColor: this.ticksColor,
              callback(value, index, values) {
                if (parseInt(value, 10) >= 1000) {
                  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                } else {
                  return value;
                }
              }
            }
          }]
        }
      };
      this.lineChartColors = [
        {
          borderColor: '#F27B50',
          backgroundColor: 'transparent',
          pointBackgroundColor: 'white'
        },
        {
          borderColor: 'grey',
          backgroundColor: 'transparent',
          pointBackgroundColor: 'white'
        }
      ];
    } else if (this.lineChartName === 'densityTrend') {
      this.driftLineChartOptions = {
        responsive: true,
        tooltips: {
          mode: 'x-axis'
        },
        legend: {
          labels: {
            fontColor: this.ticksColor,
            fontFamily: '"Montserrat", sans-serif'
          }
        },

        scales: {
          xAxes: [
            {
              type: 'linear',

              position: 'bottom',
              gridLines: {
                display: true,
                drawOnChartArea: false,
                color: this.gridsColor
              },
              scaleLabel: {
                display: true,
                labelString: this.xLabel,
                fontSize: 10,
                fontColor: this.ticksColor,
                fontFamily: '"Montserrat", sans-serif'
              },
              ticks: {
                fontSize: 10,
                fontFamily: '"Montserrat", sans-serif',
                fontColor: this.ticksColor,
              }, options: {
              

                plugins: {
                  zoom: {
                    pan: {
                      enabled: true,
                      mode: 'x'
                    },
                    zoom: {
                      enabled: true,
                      mode: 'x'
                    }
                  }
                }
              },
              // plugins: {
              //   zoom: {
              //     pan: {
              //       enabled: true,
              //       mode: 'xy'
              //     },
              //     zoom: {
              //       enabled: true,
              //       mode: 'xy'
              //     }
              //   }
              // }
            }
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
                fontColor: this.ticksColor,
                fontFamily: '"Montserrat", sans-serif'
              },
              ticks: {
                beginAtZero: true,
                fontSize: 10,
                maxTicksLimit: 5,
                fontFamily: '"Montserrat", sans-serif',
                fontColor: this.ticksColor,
                callback(value) {
                  return value + '%';
                }
              }
            }
          ]
        }
      };
      this.lineChartColors = [
        {
          borderColor: '#F27B50',
          backgroundColor: 'rgba(242, 123, 80, 0.3)'
        },
        {
          borderColor: 'green',
          backgroundColor: 'rgba(0,128,0,0.3)'
        }
      ];
    }
  }

  onChartClick(event) {
    this.lineChartClickEvent.emit(event);
  }


}
