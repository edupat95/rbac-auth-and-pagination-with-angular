import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpBackend } from '@angular/common/http';
import { LoginRequest } from './loginRequest';
import { environment } from '../../environment';
import { EMPTY, Observable, catchError, firstValueFrom, tap } from 'rxjs';
import { LoginResponse } from '../models/login.model';
@Injectable({
  providedIn: 'root',
})

export class AuthService {

  // SE UTILIZO HttpBackend para evitar que el interceptor de errores se ejecute en el login
  private http: HttpClient; 
  
  constructor(handler: HttpBackend) {
    this.http = new HttpClient(handler);
  }
  
  login(data: LoginRequest): Observable<LoginResponse> {
    const loginData = { email: data.email, password: data.password };

    return this.http.post<LoginResponse>(`${environment.API_URL}/auth/login` , loginData, {
      params: new HttpParams().set('skipErrorInterceptor', 'true')
    });
  }

  logout(): boolean{
    localStorage.removeItem('token');
    localStorage.clear();
    return false;
  }

 
}
