import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UnknownFaces } from '../../model/UnknownFacesModel';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class FacesService {
  private BASE_URI = 'http://192.168.29.207:8000/get-unknown-faces';
  constructor(private http: HttpClient) {}

  getUnknownFaces(): Observable<UnknownFaces> {
    return this.http.get<UnknownFaces>(this.BASE_URI);
  }
}
