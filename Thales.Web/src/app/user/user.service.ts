import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { User, Profile } from './user';
import { catchError } from 'rxjs/operators';
import { throwError as observableThrowError, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UserRole } from './user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public rolesNames = { 0: 'Διαχηρειστής', 1: 'Ρυθμιστής', 2: 'Χρήστης' };

  private adminString = 'Διαχηρειστης';
  private userString  = 'Χρηστης';

  private userUrl = environment.api + 'user';

  constructor(private http: HttpClient) { }

  getUserProfile(): Observable<Profile> {
    return this.http.get<Profile>(`${this.userUrl}/profile`)
      .pipe(catchError(this.errorHandler));
  }

  getUser(id: string): Observable<User> {
    return this.http.get<User>(`${this.userUrl}/${id}`)
      .pipe(catchError(this.errorHandler));
  }

  getPagedUsers(page: number, pageSize: number, activated: number,
    role: number, search: string): Observable<any> {
    return this.http.get<any>(`${this.userUrl}/${page}/${pageSize}/${activated}/${role}/${search}`)
      .pipe(catchError(this.errorHandler));
  }

  errorHandler(error: HttpErrorResponse) {
    return observableThrowError(error || 'Server Error');
  }

  insertUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.userUrl}`, user)
      .pipe(catchError(this.errorHandler));
  }

  deleteUser(id: string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.userUrl}/${id}`)
      .pipe(catchError(this.errorHandler));
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.userUrl}`, user)
      .pipe(catchError(this.errorHandler));
  }

  updateUserPassword(password: string) {
    return this.http.put<string>(`${this.userUrl}`, password).pipe(catchError(this.errorHandler));
  }

  //

  getUserRoleNameById(id: number): string {
    if ( id === UserRole.Admin ) {
      return this.adminString;
    } else {
      return this.userString;
    }
  }

}


