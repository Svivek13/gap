import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExplainabilityComponent } from './explainability.component';

describe('ExplainabilityComponent', () => {
  let component: ExplainabilityComponent;
  let fixture: ComponentFixture<ExplainabilityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExplainabilityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExplainabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
