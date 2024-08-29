import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import ChangePassword from '../../model/change-password.model';
import { Observable } from 'rxjs';
import EmployeeModel from '../../model/employee-sign-up.model';

@Injectable({
  providedIn: 'root'
})
export class ChangePasswordService {

  private baseUrl = 'http://192.168.29.242:5000/api/user';

  constructor(private http: HttpClient) { }

  updatePasswordById(id: string, user: ChangePassword): Observable<ChangePassword> {
    const {

        email,
        oldPassword,
        newPassword

    } = user;
    console.log({

      email,
      oldPassword,
      newPassword

    })
    const url = `${this.baseUrl}/${id}`;
    return this.http.put<ChangePassword>(url, {

        id,
        email,
        oldPassword,
        newPassword

    });
  }

}
