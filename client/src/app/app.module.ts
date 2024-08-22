import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BaseChartDirective } from 'ng2-charts';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

import { FullCalendarModule } from '@fullcalendar/angular';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';

import { DataService } from './services/data.service';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToastrModule } from 'ngx-toastr';
import { NavComponent } from './components/nav/nav.component';
import { HomeComponent } from './components/home/home.component';
import { EnrolComponent } from './components/enrol/enrol.component';
import { DetectComponent } from './components/detect/detect.component';
import { MyBtnComponent } from './components/my-btn/my-btn.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ToastComponent } from './components/toast/toast.component';
import { WebcamComponent } from './components/webcam/webcam.component';
import { ProfileListComponent } from './components/profile-list/profile-list.component';
import { EnrolmentComponent } from './components/enrolment/enrolment.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignUpComponent,
    NotFoundComponent,
    NavComponent,
    HomeComponent,
    EnrolComponent,
    DetectComponent,
    MyBtnComponent,
    ProfileComponent,
    ToastComponent,
    WebcamComponent,
    ProfileListComponent,
    EnrolmentComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    FormsModule,
    CommonModule,
    BaseChartDirective,
    FullCalendarModule,
    HttpClientModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(),
  ],
  providers: [provideCharts(withDefaultRegisterables()), provideHttpClient(), DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
