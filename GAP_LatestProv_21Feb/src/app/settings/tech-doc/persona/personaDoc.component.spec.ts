import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonaDocComponent } from './personaDoc.component';

describe('PersonaDocComponent', () => {
  let component: PersonaDocComponent;
  let fixture: ComponentFixture<PersonaDocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonaDocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonaDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
