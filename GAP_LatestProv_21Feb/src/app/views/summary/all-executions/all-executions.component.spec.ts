import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllExecutionsComponent } from './all-executions.component';

describe('AllExecutionsComponent', () => {
  let component: AllExecutionsComponent;
  let fixture: ComponentFixture<AllExecutionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllExecutionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllExecutionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
