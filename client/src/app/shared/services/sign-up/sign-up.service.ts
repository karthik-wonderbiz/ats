import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import EmployeeModel from '../../../model/employee-sign-up.model';
import { Observable } from 'rxjs';
import SignUpModel from '../../../model/signup.model';

@Injectable({
  providedIn: 'root'
})
export class SignUpService {

  private APIUrl = "http://192.168.29.242:5000/api/user/signup";
  constructor(private http: HttpClient) {

  }

  saveLoginData(loginData: EmployeeModel): Observable<SignUpModel> {
    const {
      firstName,
      lastName,
      email,
      contactNo,
      password,
      profilePic
    } = loginData
    return this.http.post<SignUpModel>(this.APIUrl,

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
