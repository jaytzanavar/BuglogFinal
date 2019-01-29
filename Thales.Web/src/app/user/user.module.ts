import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { Routes, RouterModule } from '@angular/router';

import { UserListComponent } from './user-list/user-list.component';
import { UserDetailsComponent } from './user-details/user-details.component';

import { AuthGuard } from '../auth/auth.guard';
import { UserProfileComponent } from './user-profile/user-profile.component';

const routes: Routes = [
  { path: 'users', component: UserListComponent, canActivate: [AuthGuard] },
  { path: 'user/profile', component: UserProfileComponent },
  { path: 'user/:id', component: UserDetailsComponent }

];


@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [UserListComponent, UserDetailsComponent, UserProfileComponent]
})

export class UserModule { }
