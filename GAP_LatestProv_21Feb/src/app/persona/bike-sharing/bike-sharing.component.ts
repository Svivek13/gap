import { Component, Input, OnInit } from '@angular/core';
import cleanDeep from 'clean-deep';
import { get as _get, reduce as _reduce, isEmpty as _isEmpty } from 'lodash';
import { MlopsService } from 'src/app/mlops.service';

@Component({
  selector: 'app-bike-sharing',
  templateUrl: './bike-sharing.component.html',
  styleUrls: ['./bike-sharing.component.scss']
})
export class BikeSharingComponent implements OnInit {
  loader = false;
  seasonChartLabels: any;
  seasonChartData: any;
  public typeofDayChartData: any;
  public typeofDayChartLabels: any;
  public weatherTypeChartData: any;
  public weatherTypeChartLabels: any;
  weatherChartReady = false;
  seasonChartReady = false;
  vals = [1, 2, 3];
  @Input() execId;
  @Input() projId;
  @Input() projName;
  @Input() createdBy;
  overallBookings = 0;
  typeofDayChartReady = false;
  public weatherColors = [{ backgroundColor: 'rgba(170,177,196,0.6)' }];
  public dayColors = [{ backgroundColor: 'rgba(229,173,152,0.6)' }];

  constructor(private mlopsService: MlopsService) { }

  ngOnInit(): void {
    this.fetchBikeData();
  }

  fetchBikeData() {
    this.loader = true;
    const payload = cleanDeep({
      projectId: this.projId,
      executionId: this.execId,
      projectName: this.projName,
      userType: 'admin'
    });
    this.mlopsService.bikeSharingData(payload).subscribe((res) => {
        // console.log('bike sharing res', res);
        this.loader = false;
        this.overallBookings = res.data.metrics.Total_Bookings ? res.data.metrics.Total_Bookings.toFixed(2) : 'NA';
        this.typeofDayChartLabels = res.data.metrics.Rentals_Vs_Day.map(i => i.displaytext);
        this.typeofDayChartData = [{ data: res.data.metrics.Rentals_Vs_Day.map(i => i.value), barThickness: 20 }];
        this.typeofDayChartReady = true;
        this.weatherTypeChartLabels = res.data.metrics.WeatherType_Vs_Bookings.map(i => i.displaytext);
        this.weatherTypeChartData = [{ data: res.data.metrics.WeatherType_Vs_Bookings.map(i => i.value), barThickness: 20 }];
        this.weatherChartReady = true;
        this.seasonChartData = [{ data: res.data.metrics.Rentals_Vs_Season.map(i => i.value), borderWidth: 1.5, lineTension: 0 }];
        this.seasonChartLabels = res.data.metrics.Rentals_Vs_Season.map(i => i.displaytext);
        this.seasonChartReady = true;
      },
        () => {
        this.loader = false;
      }
    );
  }

}
