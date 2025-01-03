// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Ensure HttpClient is imported
import { Observable } from 'rxjs';

interface Page {
  id: number;
  roleId: number;
  roleName: string;
  pageId: number;
  pageTitle: string;
  isActive: boolean;
}

interface LoginResponse {
  id: number;
  email: string;
  password: string;
  roleId: number;
  pageList: Page[];
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loginUrl = 'http://localhost:5147/api/user/log-in';

  constructor(private http: HttpClient) {} // HttpClient should be injected here

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.loginUrl, { email, password });
  }
}
