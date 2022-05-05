import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddExecutionComponent } from './add-execution.component';

describe('AddExecutionComponent', () => {
  let component: AddExecutionComponent;
  let fixture: ComponentFixture<AddExecutionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddExecutionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddExecutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
