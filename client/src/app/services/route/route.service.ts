import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Page } from '../../model/employee-login.model';

@Injectable({
  providedIn: 'root'
})
export class RouteService {

  constructor(private http: HttpClient) {
  }
  getRoutes(): Observable<Page[]> {
    return this.http.get<Page[]>('http://192.168.29.242:5000/api/accesspage');
  }
}
