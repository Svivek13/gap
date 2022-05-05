import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XaiBiasComponent } from './xai-bias.component';

describe('XaiBiasComponent', () => {
  let component: XaiBiasComponent;
  let fixture: ComponentFixture<XaiBiasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XaiBiasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XaiBiasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
