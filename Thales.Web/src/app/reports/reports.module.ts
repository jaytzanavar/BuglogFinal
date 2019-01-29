import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { Routes, RouterModule } from '@angular/router';

import { ReportsListComponent } from './reports-list/reports-list.component';
import { ReportDetailsComponent } from './report-details/report-details.component';

import { AuthGuard } from '../auth/auth.guard';

const routes: Routes = [
  { path: 'reports', component: ReportsListComponent, canActivate: [AuthGuard] },
  { path: 'report/:id', component: ReportDetailsComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    ReportsListComponent,
    ReportDetailsComponent
  ]
})
export class ReportsModule { }
