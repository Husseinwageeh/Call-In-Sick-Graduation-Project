import { Injectable } from '@angular/core';
import { RegisteringUser } from '../models/RegisteringUser';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpResponse,
} from '@angular/common/http';
import { Observable, catchError, map, of, retry, throwError } from 'rxjs';
import { logingInUser } from '../models/logingInUser';
import { AuthenticatedUser } from '../models/AuthenticatedUser';
import { response } from 'express';
import { ApiResponse } from '../models/ApiResponse';
import { AuthenticationService } from './authentication.service';
@Injectable({
  providedIn: 'root',
})
export class RegistrationService {
  private registeringUser!: RegisteringUser;
  private baseUrl: string = 'http://localhost:3030/users';
  private AuthunticatedUser!: AuthenticatedUser;

  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService
  ) {}

  public setRegisteringUser(user: RegisteringUser) {
    this.registeringUser = user;
  }

  public register(): Observable<ApiResponse<any>> {
    const apiResponse: ApiResponse<any> = {};
    return this.http
      .post<any>(`${this.baseUrl}/upload`, this.registeringUser.formData, {
        observe: 'response',
      })
      .pipe(
        map((data) => {
          apiResponse.data = data;
          return apiResponse;
        }),
        catchError((error) => {
          apiResponse.error = error.error;
          return of(apiResponse);
        })
      );
  }
}
