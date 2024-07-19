import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SessionClosedComponent } from './components/session-closed/session-closed.component';
import { WebCamComponent } from './components/web-cam/web-cam.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterationComponent } from './components/registeration/registeration.component';
import { SicknessCallListComponent } from './components/sickness-call-list/sickness-call-list.component';
import { AuthGuard } from './guards/auth.guard';
import { ReadingSuccessComponent } from './components/reading-success/reading-success.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'register', component: RegisterationComponent },
  { path: 'session', component: WebCamComponent,canActivate:[AuthGuard] },

  { path: 'session-closed', component: SessionClosedComponent,canActivate:[AuthGuard] },
  { path: 'sickness-calls-list', component: SicknessCallListComponent,canActivate:[AuthGuard] },
  { path: 'success', component: ReadingSuccessComponent,canActivate:[AuthGuard] },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
