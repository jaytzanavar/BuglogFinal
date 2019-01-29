import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { AuthInterceptor } from './auth.interceptor';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [

  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    AuthService,
    AuthGuard
  ]
})
export class AuthModule { }
