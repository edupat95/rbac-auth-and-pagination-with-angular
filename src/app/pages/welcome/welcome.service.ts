import { Injectable } from '@angular/core';
//IMPORT environment
import { environment } from '../../../environment';
import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Profile, ProfileAdapter } from '../../models/profile.model';
@Injectable({
  providedIn: 'root'
})
export class WelcomeService {

  constructor(private http: HttpClient) { }

  getProfile(): Observable<any> {
    return this.http.get<any>(`${environment.API_URL}/users/user/profile`);
  }
}
