import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError as observableThrowError, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Report } from './report';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private reportUrl = environment.api + 'report';

  constructor(private http: HttpClient) { }

  insertReport(report: Report): Observable<Report> {
    return this.http.post<Report>(`${this.reportUrl}`, report)
      .pipe(catchError(this.errorHandler));
  }

  updateReport(report: Report): Observable<Report> {
    return this.http.put<Report>(`${this.reportUrl}`, report)
      .pipe(catchError(this.errorHandler));
  }

  deleteReport(id: string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.reportUrl}/${id}`)
      .pipe(catchError(this.errorHandler));
  }

  getReport(id: string): Observable<Report> {
    return this.http.get<Report>(`${this.reportUrl}/report/${id}`)
      .pipe(catchError(this.errorHandler));
  }

  getImage(id: string): Observable<any> {
    return this.http.get<any>(`${this.reportUrl}/${id}`)
      .pipe(catchError(this.errorHandler));
  }

  getPagedReports(page: number, pageSize: number, priority: number,
    type: number, order: string, search: string): Observable<any> {
      return this.http.get<any>(`${this.reportUrl}/reports/${page}/${pageSize}/${priority}/${type}/${order}/${search}`)
      .pipe(catchError(this.errorHandler));
  }

  makeFileRequest(url: string, files: File[]) {
    return Observable.create(observer => {
      const token = localStorage.getItem('thalesToken');
      const formData: FormData = new FormData();
      const xhr: XMLHttpRequest = new XMLHttpRequest();
      for (let i = 0; i < files.length; i++) {
        formData.append('file', files[i], files[i].name);
      }
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            return observer.next(xhr.response);
          } else {
            return observer.error(xhr.response);
          }
        }
      };
      xhr.upload.onprogress = event => { };
      xhr.open('POST', url, true);
      xhr.setRequestHeader('Authorization', 'Bearer ' + token);
      xhr.send(formData);
    });
  }

  errorHandler(error: HttpErrorResponse) {
    return observableThrowError(error || 'Server Error');
  }
}
