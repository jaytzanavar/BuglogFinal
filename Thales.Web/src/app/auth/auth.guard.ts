import { Injectable } from '@angular/core';
import { CanActivate} from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }
  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
      if (!this.authService.isAuthanticated) {
        this.authService.loggedIn = false;
        this.router.navigate(['/login']);
        return false;
      }
      return true;
  }
}
