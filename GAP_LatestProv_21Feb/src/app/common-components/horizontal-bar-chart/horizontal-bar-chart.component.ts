import { Component, EventEmitter, Injectable, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { MlopsService } from 'src/app/mlops.service';
import cleanDeep from 'clean-deep';
import { Chart } from 'chart.js';

interface ExtendedChartDataSets extends ChartDataSets {
  tooltip?: any;
}

@Component({
  selector: 'app-horizontal-bar-chart',
  templateUrl: './horizontal-bar-chart.component.html',
  styleUrls: ['./horizontal-bar-chart.component.scss']
})

export class HorizontalBarChartComponent implements OnInit {

  @ViewChild(BaseChartDirective) public featureChart: BaseChartDirective;
  @ViewChild(BaseChartDirective) public chart: BaseChartDirective;
  @Input() xLabel: string;
  @Input() yLabel: string;
  @Input() chartName: string;
  @Input() localFeatureMin: any;
  @Input() localFeatureMax: any;
  public horBarChartOptions: ChartOptions;
  public featureImpOptions: ChartOptions;
  public horBarChartType: ChartType = 'horizontalBar';
  public horBarChartLegend = false;
  public horBarChartPlugins = [];
  @Input() datasets: ExtendedChartDataSets[];
  @Input() labels: string[];
  @Input() colors: any[];
  @Output() chartClickEvent = new EventEmitter<any>();
  @Output() chartYAxisLabelClickEvent = new EventEmitter<any>();
  @Input() drift: boolean;
  @Input() max: any;
  ticksColor = 'rgba(130,131,132,255)';
  gridsColor = 'rgba(199,205,207,255)';
  completeness:boolean = false;
  constructor(private mlopsService: MlopsService) { }

  ngOnInit(): void {
    const colors = this.mlopsService.fetchChartColorTheme();
    this.ticksColor = colors.ticksColor;
    this.gridsColor = colors.gridsColor;
    this.horBarChartOptionsMethod(this.chartName);
    this.subjectUpdates();
  }

  subjectUpdates() {
    this.mlopsService.themeSubject.subscribe(data => {
      const colors = this.mlopsService.fetchChartColorTheme();
      this.ticksColor = colors.ticksColor;
      this.gridsColor = colors.gridsColor;
      this.horBarChartOptionsMethod(this.chartName);
    });
  }

  horBarChartOptionsMethod(chartName) {
    if (chartName === 'drift') {
      this.horBarChartOptions = {
        responsive: true,
        tooltips: {
          intersect: false,
          mode: 'index'
        },
        scales: {
          xAxes: [
            {
              gridLines: {
                display: true,
                drawOnChartArea: false,
                color: this.gridsColor
              },
              ticks: {
                beginAtZero: true,
                min: 0,
                max: 100,
                maxTicksLimit: 3,
                fontFamily: '"Montserrat", sans-serif',
                fontColor: this.ticksColor,
                callback(value) {
                  return value + '%';
                }
              }
            },
          ],
          yAxes: [
            {

              gridLines: {
                display: true,
                drawOnChartArea: false,
                color: this.gridsColor
              },
              ticks: {
                fontFamily: '"Montserrat", sans-serif',
                // fontStyle: 'bold',
                fontColor: this.ticksColor,
                fontSize: 10,
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
                      if (label.length <= 10) {
                        return label;
                      } else {
                        return [label.slice(0, 10), label.slice(10, 20)];
                      }
                    } else {
                      array = reducer(array);
                      let length = 0;
                      array = array.map(item => {
                        if (length + item.length > 10 && length < 10) {
                          const sliceVal = length + item.length - 10;
                          length += item.length;
                          return item.slice(0, -1 * sliceVal) + '..';
                        } else if (length + item.length > 10 && length > 10) {
                          length += item.length;
                          return '';
                        } else {
                          length += item.length;
                          return item;
                        }
                      });
                      array = cleanDeep(array);
                    }
                    // console.log('label array see: ', array);
                    return array;
                  } else {
                    return label;
                  }
                }
              }
            }
          ],
        }
      };
    } else if (chartName === 'xai') {
      this.horBarChartOptions = {
        datasets: {
          bar: {
            categoryPercentage: 1,
            barPercentage: 0.5
            
           
          }
        },
        responsive: true,
        tooltips: {
          callbacks: {
            afterLabel(tooltipItem, data) {
              if (data.datasets[0].tooltip) {
                const tooltiplabel = data.datasets[0].tooltip;
                const value = 'Customers: ' + tooltiplabel[tooltipItem.index];
                return value;
              }
            }
          }
        },
        scales: {
          xAxes: [
            {
              gridLines: {
                display: true,
                drawOnChartArea: true,
                color: this.gridsColor
              },
              scaleLabel: {
                display: true,
                labelString: 'Importance Value ',
                fontColor: this.ticksColor,
                fontSize: 10,
                fontFamily: '"Montserrat", sans-serif'
              },
              ticks: {
                beginAtZero: true,
                max: this.max,
                fontColor: this.ticksColor,
                fontFamily: '"Montserrat", sans-serif'
              },
            },
          ],
          yAxes: [
            {
              // barPercentage: 0.9,
              // categoryPercentage: 1,
              gridLines: {
                display: true,
                drawOnChartArea: false,
                drawBorder: true,
                color: this.gridsColor
              },
              scaleLabel: {
                display: true,
                labelString: "Features",
                fontColor: this.ticksColor,
                fontSize: 10,
                fontFamily: '"Montserrat", sans-serif'
              },
              ticks: {
                fontFamily: '"Montserrat", sans-serif',
                fontColor: this.ticksColor,
                // fontStyle: 'bold',
                fontSize: 10,
                callback(label, index, labels) {
                  if (typeof label === 'string') {
                    let array = label.split(' ');
                    const chunksize = 16;
                    const reducer = (array) => {
                      let callAgain;
                      const chunksize = 16;
                      for (let i = 0; i < array.length - 1; i++) {
                        if (array[i].length + array[i + 1].length < chunksize) {
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
                      if (label.length <= chunksize) {
                        return label;
                      } else {
                        return [label.slice(0, chunksize), label.slice(chunksize, chunksize * 2)];
                      }
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
        },
      };
    } else if (chartName === 'completeness') {
      this.completeness = true;
      this.horBarChartOptions = {
        datasets: {
          bar: {
            categoryPercentage: 1,
            barPercentage: 0.5
            
           
          }
        },
        responsive: true,
        tooltips: {
          bodySpacing:2,
         // height: "120px",
          callbacks: {
            afterLabel(tooltipItem, data) {
             // console.log(tooltipItem,data,"Tooltip",data.datasets[0].tooltip[tooltipItem.index]);
          //     var multistringText = [tooltipItem.yLabel];
          //     multistringText.push('Another Item');
          //     multistringText.push(tooltipItem.index+1);
          //     multistringText.push('One more Item');
          //  return multistringText;
              if (data.datasets[0].tooltip) {
                const tooltiplabel = data.datasets[0].tooltip;
                var multistringText = ["List of Attributes"];
                for (const [key, value] of Object.entries(tooltiplabel[tooltipItem.index])) {
                  multistringText.push(` - ${key}`);
                }
                // for(let key of tooltiplabel[tooltipItem.index]){
                //   multistringText.push(`${key}:${tooltiplabel[tooltipItem.index][key]}`)
                // }
                  //multistringText.push(JSON.stringify(tooltiplabel[tooltipItem.index]));
               // const value = 'List of Attributes: ' + JSON.stringify(tooltiplabel[tooltipItem.index]);
                return multistringText;
              }
            }
          }
        },
        scales: {
          xAxes: [
            {
              gridLines: {
                display: true,
                drawOnChartArea: true,
                color: this.gridsColor
              },
              scaleLabel: {
                display: true,
                labelString: this.xLabel,
                fontColor: this.ticksColor,
                fontSize: 10,
                fontFamily: '"Montserrat", sans-serif'
              },
              ticks: {
                beginAtZero: true,
                max: this.max,
                fontColor: this.ticksColor,
                fontFamily: '"Montserrat", sans-serif'
              },
            },
          ],
          yAxes: [
            {
              // barPercentage: 0.9,
              // categoryPercentage: 1,
              gridLines: {
                display: true,
                drawOnChartArea: false,
                drawBorder: true,
                color: this.gridsColor
              },
              scaleLabel: {
                display: true,
                labelString: this.yLabel,
                fontColor: this.ticksColor,
                fontSize: 10,
                fontFamily: '"Montserrat", sans-serif'
              },
              ticks: {
                fontFamily: '"Montserrat", sans-serif',
                fontColor: this.ticksColor,
                // fontStyle: 'bold',
                fontSize: 10,
                callback(label, index, labels) {
                  //console.log(label);
                  
                  if (typeof label === 'string') {
                    let array = label.split(' ');
                    const chunksize = 16;
                    const reducer = (array) => {
                     // console.log(array);
                      let callAgain;
                      const chunksize = 16;
                      for (let i = 0; i < array.length - 1; i++) {
                        if (array[i].length + array[i + 1].length < chunksize) {
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
                      if (label.length <= chunksize) {
                        return label;
                      } else {
                        return [label.slice(0, chunksize), label.slice(chunksize, chunksize * 2)];
                      }
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
        },
      };
    }
     else if (chartName === 'featureImpChart') {
      this.horBarChartOptions = {
        responsive: true,
        scales: {
          xAxes: [
            {
              gridLines: {
                drawBorder: true,
                display: true,
                color: this.gridsColor,
                zeroLineColor: this.gridsColor
              },
              ticks: {
                beginAtZero: true,
                min: this.localFeatureMin,
                max: this.localFeatureMax,
                maxTicksLimit: 10,
                fontFamily: '"Montserrat", sans-serif',
                fontColor: this.ticksColor
              },
            },
          ],
          yAxes: [
            {
              // barPercentage: 0.9,
              // categoryPercentage: 1,
              gridLines: {
                drawBorder: true,
                display: false,
                color: this.gridsColor,
                zeroLineColor: this.gridsColor
              },
              ticks: {
                fontFamily: '"Montserrat", sans-serif',
                // fontStyle: 'bold',
                fontSize: 10,
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
                      if (label.length <= 10) {
                        return label;
                      } else {
                        return [label.slice(0, 10), label.slice(10, 20)];
                      }
                    } else {
                      array = reducer(array);
                    }
                    return array;
                  } else {
                    return label;
                  }
                }
              }
            }
          ],
        },
      };
    } else if (chartName === 'bank') {
      this.horBarChartOptions = {
        responsive: true,
        tooltips: {
          callbacks: {
            afterLabel(tooltipItem, data) {
              if (data.datasets[0].tooltip) {
                const tooltiplabel = data.datasets[0].tooltip;
                const value = 'Customers: ' + tooltiplabel[tooltipItem.index];
                return value;
              }
            }
          }
        },
        scales: {
          xAxes: [
            {
              gridLines: {
                display: true,
                drawOnChartArea: true,
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
                beginAtZero: true,
                fontFamily: '"Montserrat", sans-serif',
                fontColor: this.ticksColor,
              },
            },
          ],
          yAxes: [
            {
              // barPercentage: 0.9,
              // categoryPercentage: 1,
              gridLines: {
                display: true,
                drawOnChartArea: false,
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
                fontFamily: '"Montserrat", sans-serif',
                // fontStyle: 'bold',
                fontSize: 10,
                fontColor: this.ticksColor,
                callback(label, index, labels) {
                  if (typeof label === 'string') {
                    const first15 = label.slice(0, 15);
                    const last15 = label.slice(15, 30);
                    return [first15, last15];
                  } else {
                    return label;
                  }
                }
              },
            },
          ],
        },
      };
    }
  }

  chartClickFunction(event) {
    this.chartClickEvent.emit(event);

    // this case is true when you click on y axis label
    if (event.active.length === 0) {
      const mousePoint = Chart.helpers.getRelativePosition(event.event, this.chart.chart);
      // console.log(typeof(this.chart.chart));
      const chart: any = this.chart.chart;
      const clickY = chart.scales['y-axis-0'].getValueForPixel(mousePoint.y);
      // console.log(clickY);
      // console.log(this.labels[clickY]);
      const labelFound = this.labels[clickY];
      const obj = {
        _index: clickY,
        _model: {
          _label: labelFound
        }
      };
      this.chartYAxisLabelClickEvent.emit(obj);
    }

  }

}
