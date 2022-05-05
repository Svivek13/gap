import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonModalPdfviewerComponent } from './common-modal-pdfviewer.component';

describe('CommonModalPdfviewerComponent', () => {
  let component: CommonModalPdfviewerComponent;
  let fixture: ComponentFixture<CommonModalPdfviewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonModalPdfviewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonModalPdfviewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
