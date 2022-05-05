import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlurredComponent } from './blurred.component';

describe('BlurredComponent', () => {
  let component: BlurredComponent;
  let fixture: ComponentFixture<BlurredComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlurredComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlurredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
