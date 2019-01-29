import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError as observableThrowError } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({
    providedIn: 'root'
})
export class LayoutService {
    private userUrl = environment.api + 'user';

    constructor(private http: HttpClient) { }

    errorHandler(error: HttpErrorResponse) {
        return observableThrowError(error || 'Server Error');
    }
}
