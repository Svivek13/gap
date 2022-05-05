import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreprocessedComponent } from './preprocessed.component';

describe('PreprocessedComponent', () => {
  let component: PreprocessedComponent;
  let fixture: ComponentFixture<PreprocessedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreprocessedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreprocessedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
