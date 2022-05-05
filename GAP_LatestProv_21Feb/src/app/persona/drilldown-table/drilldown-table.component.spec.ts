import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrilldownTableComponent } from './drilldown-table.component';

describe('DrilldownTableComponent', () => {
  let component: DrilldownTableComponent;
  let fixture: ComponentFixture<DrilldownTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrilldownTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrilldownTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
