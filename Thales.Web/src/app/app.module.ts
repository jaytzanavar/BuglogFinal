import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NotifierModule } from 'angular-notifier';
import { SharedModule } from './shared/shared.module';
import { LayoutModule } from './layout/layout.module';
import { ReportsModule } from './reports/reports.module';
import { GroupsModule } from './application/application.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChartistModule } from 'ng-chartist';
import { SelectDropDownModule } from 'ngx-select-dropdown';



@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NotifierModule,
    LayoutModule,
    SharedModule,
    AuthModule,
    ReportsModule,
    GroupsModule,
    UserModule,
    ChartistModule,
    SelectDropDownModule
  ],
  providers: [

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
