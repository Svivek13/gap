import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewTestComponent } from './overview-test.component';

describe('OverviewTestComponent', () => {
  let component: OverviewTestComponent;
  let fixture: ComponentFixture<OverviewTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverviewTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverviewTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
