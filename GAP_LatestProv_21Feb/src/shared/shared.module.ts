import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './layout/header/header.component';
import { MaterialModule } from '../shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { TooltipOnEllipsisDirective } from '../app/tooltip-on-ellipsis.directive';
import { FooterComponent } from './layout/footer/footer.component';
import { CommonHeaderComponent } from './layout/common-header/common-header';
import { CommonFooterComponent } from './layout/common-footer/common-footer';
import { JoyrideModule } from 'ngx-joyride';
import { CommonModalPdfviewerComponent } from './layout/common-modal-pdfviewer/common-modal-pdfviewer.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@NgModule({
  declarations: [HeaderComponent, FooterComponent, TooltipOnEllipsisDirective, CommonHeaderComponent, CommonFooterComponent, CommonModalPdfviewerComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    RouterModule,
    JoyrideModule.forChild(),
    PdfViewerModule 
  ],
  entryComponents: [
    CommonModalPdfviewerComponent
 ],
  exports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    HeaderComponent,
    FooterComponent,
    CommonHeaderComponent,
    CommonFooterComponent,
    TooltipOnEllipsisDirective,
    CommonModalPdfviewerComponent
  ]
})
export class SharedModule { }
