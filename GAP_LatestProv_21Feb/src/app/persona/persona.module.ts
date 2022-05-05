import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonaRoutingModule } from './persona-routing.module';
import { PersonaComponent } from './persona.component';
import { SharedModule } from '../../shared/shared.module';
import { DiabetesComponent } from './diabetes/diabetes.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MaterialModule } from 'src/shared/material.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { TelcoComponent } from './telco/telco.component';
import { BankComponent } from './bank/bank.component';
import { BlurredComponent } from './blurred/blurred.component';
import { DataEngineerComponent } from './data-engineer/data-engineer.component';
import { DrilldownTableComponent } from './drilldown-table/drilldown-table.component';

@NgModule({
  declarations: [ DrilldownTableComponent],
  imports: [
    CommonModule,
    PersonaRoutingModule,
    SharedModule,
    // MatAutocompleteModule,
    // FormsModule,
    // ReactiveFormsModule
  ],
  exports: [
    // MatAutocompleteModule,
    // FormsModule,
    // ReactiveFormsModule
  ],
  entryComponents :[DrilldownTableComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PersonaModule { }
