import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router, RouterStateSnapshot } from '@angular/router';
import { JoyrideService } from 'ngx-joyride';
import { MlopsService } from './mlops.service';
import { find as _find, isEmpty as _isEmpty, get as _get } from 'lodash';
import { filter } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  title = 'mlops-app';

  constructor(
    private readonly joyrideService: JoyrideService,
    private mlopsService: MlopsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title) {
  }

  ngOnInit() {
    this.subjectsUpdate();
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
    ).subscribe(() => {
      const rt = this.getChild(this.activatedRoute);
      rt.data.subscribe(data => {
        // console.log(data);
        this.titleService.setTitle(data.title); });
    });
  }

  getChild(activatedRoute: ActivatedRoute) {
    if (activatedRoute.firstChild) {
      return this.getChild(activatedRoute.firstChild);
    } else {
      return activatedRoute;
    }

  }

  subjectsUpdate() {
    this.mlopsService.tourSubject.subscribe(
      data => {
        // console.log(data);
        this.tourDecision(data);
      }
    );
  }
  tourDecision(screen) {
    if (screen === 'setup') {
      this.tourStartFromSetup();
      sessionStorage.setItem('tourStartFrom', 'setup');
    } else if (screen === 'overview') {
      this.tourStartFromOverview();
      sessionStorage.setItem('tourStartFrom', 'overview');
    } else if (screen === 'persona') {
      this.tourStartFromPersona();
      sessionStorage.setItem('tourStartFrom', 'persona');
    }
  }
  tourStartFromSetup() {
    this.joyrideService.startTour(
      {
        steps: [
          'step18@setup', 'step1@setup', 'step2', 'step3', 'step4', 'step5', 'step6@setup',
          'step16@overview', 'step17', 'step19', 'step20', 'step21@overview',
          'step10', 'step11', 'step12', 'step14', 'step15',
          'step22', 'step23', 'step24', 'step25', 'step26'
        ], // Your steps order
        showPrevButton: true,
        stepDefaultPosition: 'right', // top, bottom
        themeColor: '#697071'
      }
    );
  }
  tourStartFromOverview() {
    this.joyrideService.startTour(
      {
        steps: [
          'step16@overview', 'step17', 'step19', 'step20', 'step21@overview',
          'step10', 'step11', 'step12', 'step14', 'step18',  'step15',
          'step22', 'step23', 'step24', 'step25', 'step26',
        ],
        showPrevButton: true,
        stepDefaultPosition: 'right', // top, bottom
        themeColor: '#697071'
      }
    );
  }
  tourStartFromPersona() {
    this.joyrideService.startTour(
      {
        steps: [
          'step10', 'step11', 'step12', 'step14', 'step18', 'step15',
          'step22', 'step23', 'step24', 'step25', 'step26',
        ],
        showPrevButton: true,
        stepDefaultPosition: 'right', // top, bottom
        themeColor: '#697071'
      }
    );
  }
}
