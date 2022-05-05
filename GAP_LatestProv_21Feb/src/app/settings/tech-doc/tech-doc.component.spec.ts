import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TechDocComponent } from './tech-doc.component';

describe('TechDocComponent', () => {
  let component: TechDocComponent;
  let fixture: ComponentFixture<TechDocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TechDocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TechDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
