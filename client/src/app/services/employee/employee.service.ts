import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { EmployeeInfoModel } from '../../model/EmployeeInfo.model';
import { ConcatName } from '../../utils/genericFunction';
import { EmployeeInfoGetAll } from '../../model/EmployeeInfoGetAll.model';
import EmployeeModel from '../../model/employee-sign-up.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private baseUrl = 'http://192.168.29.242:5000/api/employeedetail';

  constructor(private http: HttpClient) { }

  getAllEmployeeInfo(): Observable<EmployeeInfoGetAll[]> {
    return this.http.get<EmployeeInfoGetAll[]>(this.baseUrl).pipe(
      map(employees =>
        employees.map(employee => ({
          ...employee,
          fullName: ConcatName.concatName(employee.firstName, employee.lastName)
        }))
      ),
      catchError(error => {
        console.error('Error fetching all employee info', error);
        return of([]);
      })
    );
  }

  getEmployeeByUserId(id: string): Observable<EmployeeInfoModel | null> {
    const url = `${this.baseUrl}/user/${id}`;
    return this.http.get<EmployeeInfoModel>(url).pipe(
      map(employee => ({
        ...employee
      })),
      catchError(error => {
        console.error(`Error fetching employee with ID ${id}`, error);
        return of(null);
      })
    );
  }

  updateUserById(id: string, user: EmployeeModel): Observable<EmployeeModel> {
    const {

        firstName,
        lastName,
        profilePic

    } = user;
    console.log({

        firstName,
        lastName,
        profilePic

    })
    const url = `${this.baseUrl}/${id}`;
    return this.http.put<EmployeeModel>(url, {

        id,
        firstName,
        lastName,
        profilePic

    });
  }


}
