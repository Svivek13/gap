import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuardService as AuthGuard } from './auth/auth-guard.service';
// import { InsightsComponent } from './insights/insights.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SetupComponent } from './setup/setup.component';
import { SummaryComponent } from './views/summary/summary.component';
import { DqmComponent } from './persona/dqm/dqm.component';
import { OverviewComponent } from './views/overview/overview.component';
import { ErrorComponent } from './views/error/error.component';
import { SettingsComponent } from './settings/settings.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { OverviewTestComponent } from './views/overview/overview-test/overview-test.component';
import { CockpitComponent } from './views/overview/cockpit/cockpit.component';
// import { DriftComponent } from './views/drift/drift.component';


const routes: Routes = [
  { path: '', redirectTo: '/help', pathMatch: 'full', canActivate: [AuthGuard] },
  // empty pe login page not setup
  { path: 'login', component: LoginComponent, data : { title: 'Login - MLWorks'} },
  { path: 'error', component: ErrorComponent},
  { path: 'setup', component: SetupComponent, canActivate: [AuthGuard], data : { title: 'Setup - MLWorks'} },
  { path: 'help', component: SettingsComponent, canActivate: [AuthGuard], data : { title: 'Help - MLWorks'} },
  // { path: 'insights', component: InsightsComponent, canActivate: [AuthGuard] },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'summary', component: SummaryComponent, canActivate: [AuthGuard], data : { title: 'Summary - MLWorks'} },
  // { path: 'drift', component: DriftComponent, canActivate: [AuthGuard] },
  { path: 'dqm', component: DqmComponent, canActivate: [AuthGuard], data : { title: 'Data Quality Management - MLWorks'} },
  { path: 'overview', component: OverviewComponent, canActivate: [AuthGuard], data : { title: 'Overview - MLWorks'} },
  { path: 'overviewTest', component: OverviewTestComponent, canActivate: [AuthGuard], data : { title: 'Overview -test'} },
  { path: 'cockpit', component: CockpitComponent, canActivate: [AuthGuard], data : { title: 'Cockpit - MLWorks'} },
  // { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomeModule) },
  { path: 'persona', data : { title: 'Persona - MLWorks'}, loadChildren: () => import('./persona/persona.module').then(m => m.PersonaModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true, enableTracing: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
