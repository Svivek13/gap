import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JoyrideService } from 'ngx-joyride';
import { MlopsService } from 'src/app/mlops.service';
import { ThemeService } from 'src/app/theme/theme.service';
import { TrackService } from 'src/app/track/track.service';
import { tourDetails } from '../../tour';

@Component({
  selector: 'app-common-header',
  templateUrl: './common-header.html',
  styleUrls: ['./common-header.scss']
})
export class CommonHeaderComponent implements OnInit {
  loggedInUsername: string;
  tours: any;

  constructor(private router: Router,
              private mlopsService: MlopsService,
              private themeService: ThemeService,
              private readonly joyrideService: JoyrideService,
              private trackService: TrackService) { }

  ngOnInit(): void {
    this.tours = tourDetails;
    this.loggedInUsername = this.mlopsService.loggedInUsername ? this.mlopsService.loggedInUsername
     : localStorage.getItem('username') ? localStorage.getItem('username') : 'User';

    this.showNewUserTour();
  }

  showNewUserTour() {
    const href = window.location.href;
    const tourDone = localStorage.getItem('tourDone');
    if (href.includes('setup') && tourDone !== 'y') {
      this.checkUserOldOrNew();
    }
  }

  private checkUserOldOrNew() {
    this.mlopsService.checkUserOldOrNew().subscribe(response => {
      if (response.data.newUser === 'y') {
        // new user case
        this.mlopsService.tourSubject.next('setup');
        localStorage.setItem('tourDone', 'y');
      }
    }, err => {
      console.log('error occurred');
    });
  }

  logOut() {
    sessionStorage.clear();
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  navigateToSettings(event) {
    this.trackService.trackingMetrics(event, '15');
  }

  gotoOverview(event) {
    this.trackService.trackingMetrics(event, '1');
  }

  gotoPersona(event) {
    console.log("HIIIII");
    
    this.trackService.trackingMetrics(event, '12');
  }
  gotoOverviewTest(event){
    console.log("Hello");
    this.trackService.trackingMetrics(event, '13');
  }

  gotoSummary(event) {
    this.trackService.trackingMetrics(event, '13');
  }
  // gotoDqm(event) {
  //   this.trackService.trackingMetrics(event, '55');
  // }


  toggleTheme(event) {
    this.trackService.trackingMetrics(event, '16');
    const active = this.themeService.getActiveTheme() ;
    if (active.name === 'light') {
      this.themeService.setTheme('dark');
      this.mlopsService.themeSubject.next('dark');
    } else {
      this.themeService.setTheme('light');
      this.mlopsService.themeSubject.next('light');
    }
  }

  tourStart(event) {
    this.trackService.trackingMetrics(event, '14');
    // console.log('current url: ', this.router.url);
    const url = this.router.url;
    if (url.includes('setup') || url.includes('help')) {
      this.mlopsService.tourSubject.next('setup');
    } else if (url.includes('overview')) {
      this.mlopsService.tourSubject.next('overview');
    } else if (url.includes('persona')) {
      this.mlopsService.tourSubject.next('persona');
    }
  }

  onDone() {
    sessionStorage.removeItem('tourStartFrom'); // clear only tourStartFrom
  }

  logoutPrompt(event) {
    this.trackService.trackingMetrics(event, '17');
  }

}
