import { Component, Input, OnInit } from '@angular/core';
import { ChartType, ChartOptions } from 'chart.js';
import { SingleDataSet, Label, Color } from 'ng2-charts';
import { MlopsService } from 'src/app/mlops.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnInit {
  ticksColor = 'rgba(130,131,132,255)';
  public pieChartOptions: ChartOptions;
  @Input() pieChartLabels: Label[];
  @Input() pieChartData: SingleDataSet;
  @Input() pieChartColors: Color[];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];
  @Input() revenues: any;

  constructor(private mlopsService: MlopsService, private utilsService: UtilsService) { }

  ngOnInit(): void {
    const colors = this.mlopsService.fetchChartColorTheme();
    this.ticksColor = colors.ticksColor;
    this.pieChartOptionsMethod({ revenues: this.revenues });
    this.subjectUpdates();
  }

  subjectUpdates() {
    this.mlopsService.themeSubject.subscribe(data => {
      const colors = this.mlopsService.fetchChartColorTheme();
      this.ticksColor = colors.ticksColor;
      this.pieChartOptionsMethod({ revenues: this.revenues });
    });
  }

  pieChartOptionsMethod({ revenues }) {
    this.pieChartOptions = {
      responsive: true,
      tooltips: {
        mode: 'x-axis',
        callbacks: {
        label(tooltipItem, data, revenuesTooltip = revenues) {
          const tooltiplabel = revenuesTooltip;
          const value = '$' + tooltiplabel[tooltipItem.index].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          return value;
        }
      }
        },
      legend: {
        labels: {
          fontSize: 10,
          fontColor: this.ticksColor,
          fontFamily: '"Montserrat", sans-serif',
          usePointStyle: true
        }
      },
      elements: {
        arc: {
            borderWidth: 0
        }
    }
    };
  }

}
