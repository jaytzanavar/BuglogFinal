import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { Routes, RouterModule } from '@angular/router';
import { ListApplicationComponent } from './application-list/application-list.component';
import { EditApplicationComponent } from './application-details/application-details.component';

const routes: Routes = [

  { path: 'application'    , component: ListApplicationComponent },
  { path: 'application/new', component: EditApplicationComponent },
  { path: 'application/:id', component: EditApplicationComponent },
];

@NgModule({
  imports: [
    SharedModule, RouterModule.forChild(routes)
  ],
  declarations: [ListApplicationComponent, EditApplicationComponent]
})
export class GroupsModule { }
