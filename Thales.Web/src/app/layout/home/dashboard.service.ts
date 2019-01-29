import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError as observableThrowError, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })

export class DashboardService {

    private dashboardUrl = environment.api + "dashboard";

    constructor( private http: HttpClient ){
    }

    errorHandler(error: HttpErrorResponse) {
        return observableThrowError(error || 'Server Error');
    }

    getTimelineData(): Observable<JSON> {
        return this.http.get<JSON>(`${this.dashboardUrl}`).pipe(catchError(this.errorHandler));
    }

}