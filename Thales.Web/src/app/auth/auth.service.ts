import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { throwError as observableThrowError, Observable, BehaviorSubject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../environments/environment';
import { User } from '../../app/user/user';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  jwt = new JwtHelperService();
  private userUrl = environment.api + 'user';
  private authUrl = environment.api + 'auth/token';

  public userRole = 'guest';

  constructor(private router: Router, private http: HttpClient) {
    this.initAuthorization();
  }

  private loggedInSubject$ = new BehaviorSubject<boolean>(false);
  loggedIn$ = this.loggedInSubject$.asObservable();
  private userInSubject$ = new BehaviorSubject<User>(new User());
  user$ = this.userInSubject$.asObservable();
  get loggedIn(): boolean { return this.loggedInSubject$.getValue(); }
  set loggedIn(value: boolean) { this.loggedInSubject$.next(value); }

  get user(): User { return this.userInSubject$.getValue(); }
  set user(value: User) { this.userInSubject$.next(value); }
  register(user: User) {
    return this.http.post<any>(`${this.userUrl}/register`, user)
      .pipe(catchError(this.errorHandler));
  }

  validate(user: string) {
    // password retrieve
    return this.http.post<any>(`${this.userUrl}/register`, user)
      .pipe(catchError(this.errorHandler));
  }

  getToken() { return localStorage.getItem('thalesToken'); }

  get isAuthanticated(): boolean { return !this.jwt.isTokenExpired(this.getToken()); }

  login(username: string, password: string): Observable<boolean> {
    const body: any = { Username: username, Password: password };
    return this.http.post(this.authUrl, body)
      .pipe(map((data: any) => {
        const token = data['token'];
        if (token) {
          localStorage.setItem('thalesToken', token);
          this.initializeUser(token);
          this.loggedIn = true;
          return true;
        } else {
          return false;
        }
      }));
  }

  getTokenClaims( token?: string, key?: string ): any {
    let jwtData: string;
    if ( typeof token === 'string' ) {
      jwtData = token.split('.')[1];
    } else {
      jwtData = this.getToken().split('.')[1];
    }
    const decodedJwtJsonData = window.atob(jwtData);
    const decodedJwtData = JSON.parse(decodedJwtJsonData);
    if( typeof key !== 'undefined' ) {
      return decodedJwtData[ key ];
    }
    return decodedJwtData;
  }

  initAuthorization(): boolean {
    this.loggedIn = this.isAuthanticated;
    if (this.loggedIn) {
      this.initializeUser(this.getToken());
      return true;
    } else {
      localStorage.removeItem('token');
      return false;
    }
  }

  initializeUser(token: any) {
    if (!token) { return; }
    const info = this.jwt.decodeToken(token);
    this.user.id = info.Id;
    this.user.name = info.Name;
    this.user.lastname = info.Lastname;
    this.user.username = info.Username;
    this.user.role = info.Role;
  }

  logout() {
    localStorage.removeItem('thalesToken');
    this.loggedIn = false;
    this.router.navigate(['/login']);
  }

  // Common method for http errors handler
  errorHandler(error: HttpErrorResponse) {
    return observableThrowError(error || 'Server Error');
  }
}
