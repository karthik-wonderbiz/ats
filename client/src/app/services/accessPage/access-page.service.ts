import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AccessPageModel } from '../../model/AccessPageModel';
import { Observable, map, catchError, of } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AccessPageService {
  private urlMain = 'http://192.168.29.242:5000/api/accesspage';

  constructor(private http: HttpClient) {}

  getAccessPageDetailsByRoleId(id: string): Observable<AccessPageModel[]> {
    const getUrl = `${this.urlMain}/role/${id}`;
    return this.http.get<AccessPageModel[]>(`${getUrl}`);
  }

  updatePageDetails(pageAccessData: { id: number; roleId: number; pageId: number; isActive: number; }[]): Observable<AccessPageModel[]> {
    const putUrl = `${this.urlMain}/multiple`;
    return this.http.put<AccessPageModel[]>(putUrl, pageAccessData).pipe(
      catchError((error) => {
        console.error('Error updating page details', error);
        return of([]);
      })
    );
  }  

  addNewPage(newPageData: { roleId: number, pageId: string }): Observable<AccessPageModel[]> {
    const url = `http://192.168.29.242:5000/api/accesspage`;
    return this.http.post<AccessPageModel[]>(url, newPageData).pipe(
      catchError((error) => {
        console.error('Error adding new page', error);
        return of([]);
      })
    );
  }
  
  getAllPages(): Observable<AccessPageModel[]> {
    const getAllUrl = `http://192.168.29.242:5000/api/page`;
    return this.http.get<AccessPageModel[]>(getAllUrl).pipe(
      catchError((error) => {
        console.error('Error fetching all pages', error);
        return of([]);
      })
    );
  }

  getAllRoles(): Observable<AccessPageModel[]> {
    const getAllRolesUrl = `http://192.168.29.242:5000/api/role`;
    return this.http.get<AccessPageModel[]>(getAllRolesUrl).pipe(
      catchError((error) => {
        console.error('Error fetching all roles', error);
        return of([]);
      })
    );
  }

  deletePage(id: number): Observable<AccessPageModel[]> {
    const deleteUrl = `http://192.168.29.242:5000/api/accesspage/${id}`;
    return this.http.delete<AccessPageModel[]>(deleteUrl).pipe(
      catchError((error) => {
        console.error('Error deleting page', error);
        return of([]);
      })
    );
  }
}
