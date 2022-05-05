import { BrowserModule, HAMMER_GESTURE_CONFIG, Title } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, ErrorHandler } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
// import {FormsModule, ReactiveFormsModule} from '@angular/forms';
// import { MaterialModule } from 'src/shared/material.module';
// import {FlexLayoutModule} from '@angular/flex-layout';
import { SharedModule } from '../shared/shared.module';
import { MlopsService } from './mlops.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TitleCasePipe } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { ChartsModule } from 'ng2-charts';
import { DatePipe } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SetupComponent } from './setup/setup.component';
import { MappingComponent } from './setup/mapping/mapping.component';
import { SummaryComponent } from './views/summary/summary.component';
import { OverviewComponent } from './views/overview/overview.component';
import { AllExecutionsComponent } from './views/summary/all-executions/all-executions.component';
// import { TooltipOnEllipsisDirective } from '../app/tooltip-on-ellipsis.directive';
import { InterceptorService } from './services/interceptor.service';
import { AddExecutionComponent } from './views/summary/add-execution/add-execution.component';
import { DetailsComponent } from './views/summary/details/details.component';
import { FileViewPopupComponent } from './views/summary/details/file-view-popup/file-view-popup.component';
import { PersonaComponent } from './persona/persona.component';
import { DriftComponent } from './persona/drift/drift.component';
import { RecentExecComponent } from './views/summary/recent-exec/recent-exec.component';
import { ExplainabilityComponent } from './persona/explainability/explainability.component';
import { ErrorComponent } from './views/error/error.component';
import { ErrorService } from './services/error.service';
import { NgxGaugeModule } from 'ngx-gauge';
import { JoyrideModule } from 'ngx-joyride';
import { ThemeModule } from './theme/theme.module';
import { darkTheme } from './theme/dark-theme';
import { lightTheme } from './theme/light-theme';
import { ProvenanceGraphComponent } from './views/overview/provenance-graph/provenance-graph.component';
import { PersonaModule } from './persona/persona.module';
import { DiabetesComponent } from './persona/diabetes/diabetes.component';
import { TelcoComponent } from './persona/telco/telco.component';
import { BikeSharingComponent } from './persona/bike-sharing/bike-sharing.component';
import { BankComponent } from './persona/bank/bank.component';
import { CallEmailSupportComponent } from './settings/call-email-support/call-email-support.component';
import { FaqComponent } from './settings/faq/faq.component';
import { SettingsComponent } from './settings/settings.component';
import { BarChartComponent } from './common-components/bar-chart/bar-chart.component';
import { LineChartComponent } from './common-components/line-chart/line-chart.component';
import { PieChartComponent } from './common-components/pie-chart/pie-chart.component';
import { HorizontalBarChartComponent } from './common-components/horizontal-bar-chart/horizontal-bar-chart.component';
import { BlurredComponent } from './persona/blurred/blurred.component';
import { InviteComponent } from './settings/invite/invite.component';
import { DataEngineerComponent } from './persona/data-engineer/data-engineer.component';
import { ChartPaginatorComponent } from './common-components/chart-paginator/chart-paginator.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { MatSelectCountryModule } from '@angular-material-extensions/select-country';
import { TrackDirective } from './track/track.directive';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { TechDocComponent } from './settings/tech-doc/tech-doc.component';
import { XaiComponent } from './settings/tech-doc/xai/xai.component';
import { ModelComponent } from './settings/tech-doc/model/model.component';
import { TdDriftComponent } from './settings/tech-doc/td-drift/td-drift.component';
import { ScrollToTopComponent } from './settings/scroll-to-top/scroll-to-top.component';
import { WelcomeComponent } from './settings/welcome/welcome.component';
import { DropdownComponent } from './common-components/dropdown/dropdown.component';
import { ButtonComponent } from './common-components/button/button.component';
import { PreprocessedComponent } from './settings/tech-doc/preprocessed/preprocessed.component';
import { ExplorerComponent } from './persona/explorer/explorer.component';
import { LogComponent } from './persona/log/log.component';
import { XaiBiasComponent } from './persona/xai-bias/xai-bias.component';
import { ProgressBarComponent } from './common-components/progress-bar/progress-bar.component';
import { ProvenanceComponent } from './settings/tech-doc/provenance/provenance.component';
import { PersonaDocComponent } from './settings/tech-doc/persona/personaDoc.component';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { ManagehttpService } from './services/managehttp.service';
import { MatrixComponent } from './persona/explainability/matrix/matrix.component';
import { DqmComponent } from './persona/dqm/dqm.component';
import { DriftFeatureComponent } from './persona/drift-feature/drift-feature.component';
import * as Hammer from 'hammerjs';
import { OverviewTestComponent } from './views/overview/overview-test/overview-test.component';
import { CockpitComponent } from './views/overview/cockpit/cockpit.component';

@NgModule({
  declarations: [
    AppComponent,
    // MlGraphComponent,
    LoginComponent,
    SignUpComponent,
    SetupComponent,
    DropdownComponent,
    ButtonComponent,
    ProgressBarComponent,
    MappingComponent,
    SummaryComponent,
    OverviewComponent,
    DriftComponent,
    ExplainabilityComponent,
    DiabetesComponent,
    TelcoComponent,
    BikeSharingComponent,
    DataEngineerComponent,
    LineChartComponent,
    BarChartComponent,
    AllExecutionsComponent,
    AddExecutionComponent,
    DetailsComponent,
    FileViewPopupComponent,
    PersonaComponent,
    RecentExecComponent,
    ErrorComponent,
    HorizontalBarChartComponent,
    ProvenanceGraphComponent,
    PieChartComponent,
    BankComponent,
    SettingsComponent,
    CallEmailSupportComponent,
    FaqComponent,
    BlurredComponent,
    InviteComponent,
    ChartPaginatorComponent,
    ForgotPasswordComponent,
    TrackDirective,
    TechDocComponent,
    XaiComponent,
    ModelComponent,
    TdDriftComponent,
    ScrollToTopComponent,
    WelcomeComponent,
    PreprocessedComponent,
    ExplorerComponent,
    LogComponent,
    XaiBiasComponent,
    ProvenanceComponent,
    PersonaDocComponent,
    MatrixComponent,
    DqmComponent,
    DriftFeatureComponent,
    OverviewTestComponent,
    CockpitComponent
    // TooltipOnEllipsisDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    // PersonaModule,
    // FormsModule,
    // ReactiveFormsModule,
    BrowserAnimationsModule,
    // MaterialModule,
    MatSelectCountryModule.forRoot('en'),
    HttpClientModule,
    // FlexLayoutModule,
    ChartsModule,
    NgSelectModule,
    NgxGaugeModule,
    ThemeModule.forRoot({
      themes: [lightTheme, darkTheme],
      active: 'dark'
    }),
    JoyrideModule.forRoot(),
    PdfViewerModule,
    YouTubePlayerModule
  ],
  exports: [ ExplainabilityComponent ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    Title,
    MlopsService,
    TitleCasePipe,
    DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ManagehttpService,
      multi: true
    },
    {
      provide: ErrorHandler,
      useClass: ErrorService
    }
  ],
  entryComponents: [AddExecutionComponent, MappingComponent, FileViewPopupComponent, ProvenanceGraphComponent,DriftFeatureComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
