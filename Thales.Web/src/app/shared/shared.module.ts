import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';

import { LoaderService } from './loader.service';
import { NotifyService } from './notify.service';
import { PaginationService } from './pagination.service';
import { UtilityService } from './utility.service';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    NgbModule.forRoot(),
    HttpClientModule,
    AngularMultiSelectModule
  ],
  declarations: [],
  providers: [
    LoaderService,
    NotifyService,
    UtilityService,
    PaginationService
  ],
  exports: [
    CommonModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    HttpClientModule,
    AngularMultiSelectModule
  ],

})
export class SharedModule { }
