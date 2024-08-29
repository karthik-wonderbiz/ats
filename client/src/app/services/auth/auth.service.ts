// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { tap } from 'rxjs/operators';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   private currentUser: any;

//   constructor(private http: HttpClient) {}

//   // Method to perform the login
//   login(credentials: { email: string, password: string }): Observable<any> {
//     return this.http.post<any>('http://192.168.29.242:5000/api/user/log-in', credentials) // Replace 'API_ENDPOINT/login' with your actual login endpoint
//       .pipe(
//         tap(user => this.setCurrentUser(user)) // Store the user information upon successful login
//       );
//   }

//   // Method to set the current user and store it in localStorage
//   setCurrentUser(user: any): void {
//     this.currentUser = user;
//     localStorage.setItem('user', JSON.stringify(user));
//   }

//   // Method to get the current user from the stored data
//   getCurrentUser(): any {
//     if (!this.currentUser) {
//       const storedUser = localStorage.getItem('user');
//       if (storedUser) {
//         this.currentUser = JSON.parse(storedUser);
//       }
//     }
//     return this.currentUser;
//   }

//   // Method to log out the user
//   logout(): void {
//     this.currentUser = null;
//     localStorage.removeItem('user');
//     // Optionally, redirect to login page or other actions on logout
//   }

//   // Method to check if the user is logged in
//   isLoggedIn(): boolean {
//     return !!this.getCurrentUser();
//   }
// }
