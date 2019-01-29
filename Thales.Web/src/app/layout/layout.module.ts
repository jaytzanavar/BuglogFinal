import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { NavbarComponent } from './navbar/navbar.component';
import { PasswordComponent } from './password/password.component';

import { AuthGuard } from '../auth/auth.guard';
import { HomeComponent } from './home/home.component';

import { HomeAdminComponent } from './home/home-admin/home-admin.component';
import { HomeUserComponent } from './home/home-user/home-user.component';


const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'retrivepass', component: PasswordComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [
    NavbarComponent,
    LoginComponent, RegisterComponent,
    PasswordComponent,
    HomeComponent, HomeUserComponent, HomeAdminComponent
  ],

  exports: [
    NavbarComponent
  ]
})
export class LayoutModule { }
