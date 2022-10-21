import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from './user.model';

interface AuthResponse {
  username: string;
 jwtAuthToken: string;
  serverCurrentTime: number;
 tokenExpirationTime: number;
 role:string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  user = new BehaviorSubject<User | null>(null);
  timeout = new Subject<boolean>();
  private tokenExirationTimer: any;

  constructor(private http: HttpClient, private router: Router) {}

  login(inputFields: { username: string; password: string }) {
    console.log(inputFields);
    return this.http
      .post<AuthResponse>('http://localhost:8081/api/v1.0/tweets/login',inputFields)
      .pipe(
        catchError(this.handleError),
        tap((response) => {
          this.handleAuthentication(
             response['username'],
            response['jwtAuthToken'],
             response['serverCurrentTime'],
            response['tokenExpirationTime'],
            response['role']
          );
        })
      );

  }

  forgot(inputFields: { userName: string; password: string }) {
    return this.http
      .post<AuthResponse>('http://localhost:8081/api/v1.0/tweets/'+inputFields.userName+'/forgot',inputFields);

  }

  register(inputFields: { userName: string; password: string; firstName: string; lastName: string;
    emailId: string; contactNo: string;  }){
      return this.http
      .post<AuthResponse>('http://localhost:8081/api/v1.0/tweets/register',inputFields);

  }

  getAllUsers(){
    return this.http
      .get<any>('http://localhost:8081/api/v1.0/tweets/users/all');
  }

  autoLogin() {
    const user = localStorage.getItem('userData');
    if (!user) return;

    const parsedUser: {
      username: string;
      _token: string;
      serverCurrentTime: number;
      _tokenExpirationTime: number;
      role:string;
    } = JSON.parse(user);
    const loadedUser = new User(
       parsedUser.username,
      parsedUser._token,
       parsedUser.serverCurrentTime,
      parsedUser._tokenExpirationTime,
      parsedUser.role
    );

    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expirationDuration =
        loadedUser.tokenExpirationTime - new Date().getTime();
        console.log(this.tokenExirationTimer);

      //this.autoLogout(expirationDuration);
    }
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['./auth']);
    this.removeUser();

    if (this.tokenExirationTimer) {
      clearTimeout(this.tokenExirationTimer);
    }
    this.tokenExirationTimer = null;
  }

  /*autoLogout(expirationDuration: number) {
    this.tokenExirationTimer = setTimeout(() => {
      this.timeout.next(true);
      this.logout();
    }, expirationDuration);
  }*/

  private handleError(errorResponse: HttpErrorResponse) {
    let errorMessage = 'Invalid Username or Password';

    if (!errorResponse.error || !errorResponse.error.error) {
      return throwError(errorMessage);
    }

    if (errorResponse.error.message) {
      if (errorResponse.error.message === 'No value present')
        errorMessage = 'Invalid Username';
      else errorMessage = 'Invalid Username or Password';
    }
    return throwError(errorMessage);
  }

  private handleAuthentication(
     username: string,
    token: string,
   serverCurrentTime: number,
    tokenExpirationTime: number,
    role:string
  ) {
    const user = new User(
       username,
      token,
       serverCurrentTime,
      tokenExpirationTime,
      role
    );
    this.storeUser(user);
    //this.autoLogout(tokenExpirationTime);
    this.user.next(user);
  }

  private storeUser(user: User) {
    localStorage.setItem('username', user.username);
    localStorage.setItem('token',user.token);
    localStorage.setItem('role',user.role);
    console.log(localStorage.getItem('username'));
    console.log(localStorage.getItem('token'))
    console.log(localStorage.getItem('role'));
  }

  private removeUser() {
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  }
  
  
}
