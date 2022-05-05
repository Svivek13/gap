import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DqmComponent } from './dqm.component';

describe('DqmComponent', () => {
  let component: DqmComponent;
  let fixture: ComponentFixture<DqmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DqmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DqmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
