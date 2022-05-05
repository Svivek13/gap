import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriftFeatureComponent } from './drift-feature.component';

describe('DriftFeatureComponent', () => {
  let component: DriftFeatureComponent;
  let fixture: ComponentFixture<DriftFeatureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriftFeatureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriftFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
