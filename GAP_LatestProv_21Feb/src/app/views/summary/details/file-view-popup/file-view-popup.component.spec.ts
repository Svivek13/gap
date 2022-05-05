import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileViewPopupComponent } from './file-view-popup.component';

describe('FileViewPopupComponent', () => {
  let component: FileViewPopupComponent;
  let fixture: ComponentFixture<FileViewPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileViewPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileViewPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
