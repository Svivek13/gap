import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentExecComponent } from './recent-exec.component';

describe('RecentExecComponent', () => {
  let component: RecentExecComponent;
  let fixture: ComponentFixture<RecentExecComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecentExecComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentExecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
