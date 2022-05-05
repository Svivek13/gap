import { Component, ViewChild, ViewChildren, QueryList, ChangeDetectorRef, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MlopsService } from 'src/app/mlops.service';
import { map } from 'd3-array';
import { Router } from '@angular/router';
import { ThemeService } from 'src/app/theme/theme.service';
import { TrackService } from 'src/app/track/track.service';
import { FormControl, FormGroup } from '@angular/forms';
import { tourDetails } from 'src/shared/tour';

@Component({
  selector: 'app-overview-test',
  templateUrl: './overview-test.component.html',
  styleUrls: ['./overview-test.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class OverviewTestComponent implements OnInit {
  @ViewChild('outerSort', { static: true }) sort: MatSort;
  @ViewChildren('innerSort') innerSort: QueryList<MatSort>;
  @ViewChildren('innerTables') innerTables: QueryList<MatTable<Address>>;

  dataSource: MatTableDataSource<User>;
  usersData: User[] = [];
  columnsToDisplay = ['Name', 'Triggered_By', 'Job_status', 'Overall_drift', 'Overall_DQ', 'Accuracy', 'Duration', 'View', 'Graph'];
  innerDisplayedColumns = ['Name', 'Triggered_By', 'Job_status', 'Overall_drift', 'Overall_DQ', 'Accuracy', 'Duration', 'View', 'Graph'];
  expandedElement: User | null;
  brand: boolean = false;
  startDate: any;
  endDate: any;
  driftPercentage: number;
  filtersForm: FormGroup;
  driftGT30 = 0;
  dataTill: any;
  projectType: any = 'both';
  isRefreshing: boolean;
  driftCount: any = 0;
  xaiCount: any = 0;
  darkTheme: boolean;
  tours: any;
  options = ['More than 10%', 'More than 20%', 'More than 30%'];
  projectTypes: any = []
  driftBy = [
    {
      show: 'Select drift percentage',
      value: 0
    },
    {
      show: 'More than 10%',
      value: 10
    },
    {
      show: 'More than 20%',
      value: 20
    },
    {
      show: 'More than 30%',
      value: 30
    },
  ];
  loader: boolean;

  constructor(private cd: ChangeDetectorRef, private mlopsService: MlopsService, private router: Router, private themeService: ThemeService,
    private trackService: TrackService,) {
    this.filtersForm = new FormGroup({
      projectName: new FormControl(''),
      projectType: new FormControl(''),
      startDate: new FormControl(''),
      endDate: new FormControl(''),
      driftBy: new FormControl(this.driftBy[0].value),
    });
  }

  ngOnInit(): void {
    this.tours = tourDetails;
    this.getCockpitDetail();
  }
  toggleRow(element: User) {
    element.child && (element.child as MatTableDataSource<Address>).data.length ? (this.expandedElement = this.expandedElement === element ? null : element) : null;
    this.cd.detectChanges();
    this.innerTables.forEach((table, index) => (table.dataSource as MatTableDataSource<Address>).sort = this.innerSort.toArray()[index]);
  }


  getCockpitDetail() {
    this.brand = false;
    this.loader = true;
    const obj = {}
    USERS = [];
    this.mlopsService.getCockpitData(obj)
      .subscribe(res => {
        console.log(res);
        this.brand = true;
        const data = res.data;
        const childData = [];
        let subChild = [];
        const displayArr = []
        data.map(data => {
          this.loader = false;
          if (data.dependent_on == 'None') {
            displayArr.push(data.Name)
          }
        })
        const result = displayArr.map(word => word.replace('_', ' '));
        console.log(result);

        data.map(data => {
          if (data.dependent_on == 'None') {
            this.projectTypes.push({ show: (data.Name).replace('_', ' '), value: data.Name })
            // this.projectTypes.push({ show: data.dependent_on, value: data.dependent_on })
          }

        })
        //  this.projectTypes = [...new Set(this.projectTypes)]
        console.log(this.projectTypes[0].value);
        this.mlopsService.setModelDropwdown(this.projectTypes);
        this.filtersForm.patchValue({
          projectName: this.projectTypes[0].value
        })
        // console.log(this.projectTypes);

        data.map(data => {
          if (data.dependent_on == 'None') {
            USERS.push(data);
          }
          if (data.dependent_on != 'None') {
            childData.push(data)
          }
        })
        console.log(childData);



        //  subChild = []
        USERS.map(d => {
          subChild = []
          childData.map(data => {
           
            //  console.log(data.dependent_on, d.Name);
            if (d.Name == data.dependent_on) {
              console.log(d.Name, data.dependent_on);
              subChild.push(data);
              console.log(subChild);

            }
          })
          if(subChild.length > 0 ){
            d['child'] = subChild;
          }
         


        })
        console.log(USERS);

        USERS.forEach(user => {
          // console.log(user);

          if (user.child && Array.isArray(user.child) && user.child.length) {
            this.usersData = [...this.usersData, { ...user, child: new MatTableDataSource(user.child) }];
          } else {
            this.usersData = [...this.usersData, user];
          }
        });
        this.dataSource = new MatTableDataSource(this.usersData);
        this.dataSource.sort = this.sort;
        console.log(this.usersData);

      })
  }

  getDrilldwonDataView(col, model, brand, cardType, location, modelType) {
    const obj = {
      model: model.replace('_', ' '),
      brand: brand,
      card_type: cardType,
      location: location,
      model_type: modelType
    }
    console.log(model);

    sessionStorage.setItem(model, 'projectName');
    this.mlopsService.setDashbordInput(obj);
    if (col == 'View') {
      this.router.navigate(['/persona']);
    }
    sessionStorage.setItem(JSON.stringify(obj), 'objCockpit');
  }
  goTo(column, model) {
    console.log(column, model);
    sessionStorage.setItem('projectName',model);
    if (column == 'Graph') {
      this.router.navigate(['/overview']);
    } else if (column == 'View') {
      this.router.navigate(['/persona']);
    }
  }
  getBrand() {

  }
  clearFiltersForm(event) {
    this.trackService.trackingMetrics(event, '18');

    this.filtersForm.reset();
    this.filtersForm.patchValue({
      // driftBy: this.driftBy[0].value,
      // errorBy: this.errorBy[0].value,
      projectType: this.projectTypes[0].value
    });
    this.startDate = undefined;
    this.endDate = undefined;
    // this.projectTyped = undefined;
    this.driftPercentage = undefined;
    this.projectType = '';
    // this.fetchProjects(undefined, undefined, undefined, undefined, 'both');
    this.driftGT30 = 0;
    this.dataTill = undefined;
  }
}

export interface User {
  _id: string;
  Name: string;
  Triggered_By: string;
  Job_status: string;
  Overall_drift: string;
  Overall_DQ: string;
  Accuracy: string;
  Duration: string;
  View: string;
  Graph: string;
  child?: Address[] | MatTableDataSource<Address>;
}

export interface Address {

  Name: string;
  Triggered_By: string;
  Job_status: string;
  Overall_drift: string;
  Overall_DQ: string;
  Accuracy: string;
  Duration: string;
  View: string;
  Graph: string;
  dependent_on: string;
}

export interface UserDataSource {
  name: string;
  email: string;
  phone: string;
  child?: MatTableDataSource<Address>;
}let USERS: User[] = [

];

