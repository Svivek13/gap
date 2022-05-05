import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartPaginatorComponent } from './chart-paginator.component';

describe('ChartPaginatorComponent', () => {
  let component: ChartPaginatorComponent;
  let fixture: ComponentFixture<ChartPaginatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartPaginatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartPaginatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
