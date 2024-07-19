import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WebCamComponent } from './components/web-cam/web-cam.component';
import { WebcamModule } from 'ngx-webcam';
import { SocketIoModule } from 'ngx-socket-io';
import { SessionClosedComponent } from './components/session-closed/session-closed.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { RegisterationComponent } from './components/registeration/registeration.component';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './components/login/login.component';
import { SicknessCallListComponent } from './components/sickness-call-list/sickness-call-list.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';  
import { SicknessListCardComponent } from './components/sickness-list-card/sickness-list-card.component';
import { ReadingSuccessComponent } from './components/reading-success/reading-success.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';


@NgModule({
  declarations: [
    AppComponent,
    WebCamComponent,
    SessionClosedComponent,
    RegisterationComponent,
    LoginComponent,
    SicknessListCardComponent,
    SicknessCallListComponent,
    ReadingSuccessComponent,
  NavBarComponent
  ],
  imports:[
    MatProgressSpinnerModule,
    NgbModule,
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    WebcamModule,
    SocketIoModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
