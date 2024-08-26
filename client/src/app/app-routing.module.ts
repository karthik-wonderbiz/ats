import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { authGuard } from './guards/auth.guard';
import { HomeComponent } from './components/home/home.component';
import { DetectComponent } from './components/detect/detect.component';
import { EnrolComponent } from './components/enrol/enrol.component';
import { EnrolmentComponent } from './components/enrolment/enrolment.component';

const routes: Routes = [

  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'sign-up', component: SignUpComponent },
  
  {
    path: 'enrolment', component: EnrolmentComponent,
    children: [
      { path: '', redirectTo: '/enrolment/home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'detect', component: DetectComponent },
      { path: 'enrol', component: EnrolComponent },
    ]
  },

  {
    path: 'admin',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./modules/admin/admin.module').then((m) => m.AdminModule),
  },

  {
    path: 'user',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./modules/user/user.module').then((m) => m.UserModule),
  },

  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
