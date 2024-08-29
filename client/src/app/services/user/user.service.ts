import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { UserModel } from '../../model/User.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://192.168.29.242:5000/api/user';

  constructor(private http: HttpClient) { }

  getUserById(userId: string): Observable<UserModel | null> {
    const url = `${this.baseUrl}/${userId}`;
    return this.http.get<UserModel>(url).pipe(
      map(user => user),
      catchError(error => {
        console.error(`Error fetching user with ID ${userId}`, error);
        return of(null);
      })
    );
  }

  deleteUserById(userId: string): Observable<UserModel | null>{
    const url = `${this.baseUrl}/${userId}`;
    return this.http.delete<UserModel>(url).pipe(
      catchError(error => {
        console.error(`Error deleting user with ID ${userId}`, error);
        return of(null);
      })
    );
  }
}
