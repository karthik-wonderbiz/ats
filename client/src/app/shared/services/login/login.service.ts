import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import LoginModel from '../../../model/employee-login.model';



@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private loginApiUrl = 'http://192.168.29.46:5000/api/user/log-in';

  constructor(private http: HttpClient) { }

  Login(loginData: LoginModel): Observable<LoginModel> {
    const {
      email,
      password,

    } = loginData
    return this.http.post<LoginModel>(this.loginApiUrl,
      {
        email,
        password,
      }
    );
  }

}
