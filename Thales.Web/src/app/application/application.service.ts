import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Application } from './application';
import { catchError } from 'rxjs/operators';
import { throwError as observableThrowError, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private applicationUrl = environment.api + 'application';

  constructor(private http: HttpClient) { }

  insertApplication(application: Application): Observable<Application> {
    return this.http.post<Application>(`${this.applicationUrl}/insert`, application)
      .pipe(catchError(this.errorHandler));
  }

  getApplication(id: string): Observable<Application> {
    return this.http.get<Application>(`${this.applicationUrl}/${id}`)
      .pipe(catchError(this.errorHandler));
  }

  getApplications(): Observable<Array<Application>> {
    return this.http.get<any>(`${this.applicationUrl}/all`)
      .pipe(catchError(this.errorHandler));
  }

  deleteApplication(id: string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.applicationUrl}/${id}`)
      .pipe(catchError(this.errorHandler));
  }

  updateApplication(app: Application): Observable<Application> {
    return this.http.put<Application>(`${this.applicationUrl}/update/${app.id}`, app).
      pipe(catchError(this.errorHandler));
  }

  errorHandler(error: HttpErrorResponse) {
    return observableThrowError(error || 'Server Error');
  }

}
