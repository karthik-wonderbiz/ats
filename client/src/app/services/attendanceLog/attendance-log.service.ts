import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { AttendanceLogModel } from '../../model/AttendanceLog.model';
import { ActivityRecordModel } from '../../model/ActivityRecord.model';
import { ConcatName, TimeFormatter } from '../../utils/genericFunction';

@Injectable({
  providedIn: 'root'
})
export class AttendanceLogService {
  private urlMain = "http://192.168.29.242:5000/api/attendanceLog";

  constructor(private http: HttpClient) { }

  getTodayAttendanceLogStatus(startDate: string): Observable<AttendanceLogModel[]> {
    const statusUrl = `${this.urlMain}/status?Date=${startDate}`;
    return this.http.get<AttendanceLogModel[]>(statusUrl).pipe(
      map(logs =>
        logs.map(log => ({
          ...log,
          fullName: ConcatName.concatName(log.firstName, log.lastName)
        }))
      ),
      catchError(error => {
        console.error('Error fetching today\'s attendance logs', error);
        return of([]);
      })
    );
  }

  getSummaryAttendance(startDate: string, endDate: string): Observable<any> {
    const attUrl = `${this.urlMain}/summary?startDate=${startDate}&endDate=${endDate}`
    return this.http.get<AttendanceLogModel>(attUrl).pipe(
      map(data => data),
      catchError(error => {
        console.error('Error fetching summary', error);
        return of([]);
      })
    );
  }

  getAllAttendanceLogs(startDate: string, id: number): Observable<AttendanceLogModel[]> {
    let url;
    if (id > 0) {
      console.log("fiffiif")
      url = `${this.urlMain}/user/${id}?startDate=${startDate}`
    } else {
      console.log("00000000000000000")
      url = `${this.urlMain}?startDate=${startDate}`
    }
    console.log("services", id)
    // const url = id > 0 ? `${this.urlMain}/user/${id}?startDate=${startDate}` : `${this.urlMain}?startDate=${startDate}`;
    return this.http.get<AttendanceLogModel[]>(url).pipe(
      map(logs =>
        logs.map(log => ({
          ...log,
          fullName: ConcatName.concatName(log.firstName, log.lastName)
        }))
      ),
      catchError(error => {
        console.error('Error fetching attendance logs', error);
        return of([]);
      })
    );
  }

  getAllAttendanceLogsInOut(startDate: string, currentType: string): Observable<AttendanceLogModel[]> {
    // const url = id? `${this.urlMain}/user/${id}?startDate=${startDate}`: `${this.urlMain}?startDate=${startDate}`;
    const url = `${this.urlMain}/current-status?date=${startDate}&type=${currentType}`;
    return this.http.get<AttendanceLogModel[]>(url).pipe(
      map(logs =>
        logs.map(log => ({
          ...log,
          fullName: ConcatName.concatName(log.firstName, log.lastName)
        }))
      ),
      catchError(error => {
        console.error('Error fetching attendance logs by type', error);
        return of([]);
      })
    );
  }

  getAllEmployeesHours(startDate: string, endDate: string, reportType: string): Observable<AttendanceLogModel[]> {
    const attUrl = `${this.urlMain}/totalhours?startDate=${startDate}&endDate=${endDate}&reportType=${reportType}`;
    return this.http.get<AttendanceLogModel[]>(attUrl).pipe(
      map(employees =>
        employees.map(employee => ({
          ...employee,
          fullName: ConcatName.concatName(employee.firstName, employee.lastName)
        }))
      ),
      catchError(error => {
        console.error('Error fetching all employee hours', error);
        return of([]);
      })
    );
  }

  getAllEmployeesInHours(reportType: string): Observable<AttendanceLogModel[]> {
    const attUrl = `${this.urlMain}/total-hours/in?reportType=${reportType}`;
    return this.http.get<AttendanceLogModel[]>(attUrl).pipe(
      map(employees =>
        employees.map(employee => ({
          ...employee,
          fullName: ConcatName.concatName(employee.firstName, employee.lastName)
        }))
      ),
      catchError(error => {
        console.error('Error fetching all employee hours', error);
        return of([]);
      })
    );
  }

  getAllEmployeesOutHours(reportType: string): Observable<AttendanceLogModel[]> {
    const attUrl = `${this.urlMain}/total-hours/out?reportType=${reportType}`;
    return this.http.get<AttendanceLogModel[]>(attUrl).pipe(
      map(employees =>
        employees.map(employee => ({
          ...employee,
          fullName: ConcatName.concatName(employee.firstName, employee.lastName)
        }))
      ),
      catchError(error => {
        console.error('Error fetching all employee hours', error);
        return of([]);
      })
    );
  }

  getMisEntriesByUserId(userdId: string, date: string): Observable<AttendanceLogModel[]> {
    const attUrl = `${this.urlMain}/misentry?userId=${userdId}&date=${date}`;
    return this.http.get<AttendanceLogModel[]>(attUrl).pipe(
      map(employees =>
        employees.map(employee => ({
          ...employee,
          fullName: ConcatName.concatName(employee.firstName, employee.lastName)
        }))
      ),
      catchError(error => {
        console.error('Error fetching all employee hours', error);
        return of([]);
      })
    );
  }

  getMisEntriesList(date: string, userId: string): Observable<AttendanceLogModel[]> {
    const url = `${this.urlMain}/misentry/summary?date=${date}&userId=${userId}`;
    return this.http.get<AttendanceLogModel[]>(url).pipe(
      map(employees =>
        employees.map(employee => ({
          ...employee,
          fullName: ConcatName.concatName(employee.firstName, employee.lastName)
        }))
      ),
      catchError(error => {
        console.error('Error fetching all employee hours', error);
        return of([]);
      })
    );
  }

  getActivityRecordsInByUserId(userdId: string, startDate: string, endDate: string): Observable<ActivityRecordModel[]> {
    const attUrl = `${this.urlMain}/activity-record/in?userId=${userdId}&startDate=${startDate}&endDate=${endDate}`;
    return this.http.get<ActivityRecordModel[]>(attUrl).pipe(
      catchError(error => {
        console.error('Error fetching in activity records', error);
        return of([]);
      })
    );
  }

  getActivityRecordsOutByUserId(userdId: string, startDate: string, endDate: string): Observable<ActivityRecordModel[]> {
    const attUrl = `${this.urlMain}/activity-record/out?userId=${userdId}&startDate=${startDate}&endDate=${endDate}`;
    return this.http.get<ActivityRecordModel[]>(attUrl).pipe(
      catchError(error => {
        console.error('Error fetching out activity records', error);
        return of([]);
      })
    );
  }
}
