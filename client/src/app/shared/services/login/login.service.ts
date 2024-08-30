import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginModel, Page } from '../../../model/employee-login.model';
import EmployeeModel from '../../../model/employee-sign-up.model';



@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private baseUrl = 'http://192.168.29.242:5000/api';

  constructor(private http: HttpClient) { }

  Login(loginData: EmployeeModel): Observable<LoginModel> {
    const {
      email,
      password,

    } = loginData
    console.log("Login service:", loginData)
    return this.http.post<LoginModel>(this.baseUrl + "/user/log-in",
      {
        email,
        password,
      }
    );
  }

  getRoutes(roleId: number): Observable<Page[]> {
    return this.http.get<Page[]>(this.baseUrl + '/accesspage/role/' + roleId);
  }

}
