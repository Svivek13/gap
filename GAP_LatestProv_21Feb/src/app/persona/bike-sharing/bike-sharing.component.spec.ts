import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BikeSharingComponent } from './bike-sharing.component';

describe('BikeSharingComponent', () => {
  let component: BikeSharingComponent;
  let fixture: ComponentFixture<BikeSharingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BikeSharingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BikeSharingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
