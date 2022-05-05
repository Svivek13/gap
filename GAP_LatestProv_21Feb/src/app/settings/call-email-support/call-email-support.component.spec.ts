import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallEmailSupportComponent } from './call-email-support.component';

describe('CallEmailSupportComponent', () => {
  let component: CallEmailSupportComponent;
  let fixture: ComponentFixture<CallEmailSupportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallEmailSupportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallEmailSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
