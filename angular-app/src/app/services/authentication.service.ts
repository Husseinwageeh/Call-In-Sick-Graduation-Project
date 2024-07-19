import { Injectable } from '@angular/core';
import { AuthenticatedUser } from '../models/AuthenticatedUser';
import { User } from '../models/User';
import { RegisteringUser } from '../models/RegisteringUser';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { ApiResponse } from '../models/ApiResponse';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private authenticatedUser:AuthenticatedUser | undefined
  private baseUrl: string = 'http://localhost:3030/users';
  constructor(private http:HttpClient) { }

  setAuthenticatedUser(authUser:AuthenticatedUser){
    this.authenticatedUser=authUser;
    console.log('auth service')
    console.log(this.authenticatedUser)
    

  }
  getAuthenticatedUser():AuthenticatedUser | undefined{

    if(this.authenticatedUser){
      return this.authenticatedUser;
    }
    const data=this.getUserCachedData();

    if(data){
      return data;
    }
    return undefined;

 
  }

  isLoggedIn():boolean{
   
    if(this.authenticatedUser){
      return true;
    }else{
      //here we should check on localstorage first
       const data=this.getUserCachedData();
       if(data){
        this.authenticatedUser=data;
        return true;
       }
     
      return false;
    }

  }

  public login(email: string, password: string): Observable<ApiResponse<any>> {
    let apiResponse: ApiResponse<any> = {};

    return this.http
      .post<any>(
        `${this.baseUrl}/login`,
        {
          email: email,
          password: password,
        },
        { observe: 'response' }
      )
      .pipe(
        map((data) => {
          apiResponse.data = data;
          this.authenticatedUser=data.body;
          this.setAuthenticatedUser(data.body)
          this.cacheUserCredentials();

          return apiResponse;
        }),

        catchError((error) => {
          if (error instanceof HttpErrorResponse) {
            apiResponse.error = error.error;
          }

          return of(apiResponse);
        })
      );
  }


  private cacheUserCredentials(){
    localStorage.setItem('userData',JSON.stringify(this.authenticatedUser))
  }


  private getUserCachedData():AuthenticatedUser | undefined {
     let result=localStorage.getItem('userData');
    
     if(result){
     return JSON.parse(result);
     }else return undefined;
  }


  public logout(){
    this.authenticatedUser=undefined

    ;
    this.clearCachedData();
    
  }
  private clearCachedData(){
    localStorage.clear();
  }
}
