import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import EmployeeModel from '../model/employee-sign-up.model';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private storageKey = 'employeeData';

  constructor() {}

  saveEmployeeData(employee: EmployeeModel): Observable<boolean> {
    localStorage.setItem(this.storageKey, JSON.stringify(employee));
    return of(true);
  }

  getEmployeeData(): Observable<EmployeeModel | null> {
    const data = localStorage.getItem(this.storageKey);
    if (data) {
      return of(JSON.parse(data));
    }
    return of(null);
  }
}
