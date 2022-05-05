import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TdDriftComponent } from './td-drift.component';

describe('TdDriftComponent', () => {
  let component: TdDriftComponent;
  let fixture: ComponentFixture<TdDriftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TdDriftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TdDriftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
