import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import EmployeeModel from '../../../model/employee-sign-up.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignUpService {

  private APIUrl = "http://192.168.29.46:5000/api/user/signup";
  constructor(private http: HttpClient) {

  }

  saveLoginData(loginData: EmployeeModel): Observable<EmployeeModel> {
    const {
      firstName,
      lastName,
      email,
      contactNo,
      password,
      profilePic
    } = loginData
    return this.http.post<EmployeeModel>(this.APIUrl,

      {
        firstName,
        lastName,
        email,
        contactNo,
        password,
        profilePic
      }
    );
  }

}
