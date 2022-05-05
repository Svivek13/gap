import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MlopsService } from 'src/app/mlops.service';
import { MappingComponent } from 'src/app/setup/mapping/mapping.component';
import { ThemeService } from 'src/app/theme/theme.service';
import { get as _get, isEmpty as _isEmpty, has as _has } from 'lodash';
import { SetupComponent } from 'src/app/setup/setup.component';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss'],
  providers: [SetupComponent]
})
export class ProgressBarComponent implements OnInit {

  @Input() value: number;
  @Input() name: string;
  @Input() targetVariables: any;
  @Input() topTenRecords: any;
  @Input() fileSelected: any;
  object: any;
  @Input() fileName: string;
  @Input() dxCase: any;

  constructor(public dialog: MatDialog, private mlopsService: MlopsService, private setupComp: SetupComponent,
              private themeService: ThemeService) { }

  ngOnInit(): void {
    // console.log('this is for ', this.name);
  }

  popupFunction() {
    const active = this.themeService.getActiveTheme();
    let panelClass;
    if (active.name === 'light') {
      panelClass = 'custom-dialog-class';
    } else {
      panelClass = 'dark-dialog-class';
    }

    const dialogRef = this.dialog.open(MappingComponent, {
      maxHeight: '90vh',
      minHeight: '40vh',
      data: { data: {target: this.targetVariables, topTenRecords: this.topTenRecords, object: this.object, dxCase: this.dxCase} },
      panelClass
    });
    dialogRef.afterClosed().subscribe(() => {
      this.mlopsService.targetSubject.next(this.mlopsService.testObject);
    });
  }

  popupOpen(name) {
    if (name === 'trainingFile') {
    this.object = 'trainingFile';
    } else {
      this.object = this.mlopsService.testObject;
    }
    this.popupFunction();
  }

}
