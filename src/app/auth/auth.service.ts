import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpBackend } from '@angular/common/http';
import { LoginRequest } from './loginRequest';
import { environment } from '../../environment';
import { Observable, catchError, tap } from 'rxjs';
import { LoginResponse } from '../models/login.model';
/*
import { HttpClient, ..., HttpBackend } from '@angular/common/http';

@Injectable()
export class TestService {

  private httpClient: HttpClient;

  constructor( handler: HttpBackend) { 
     this.httpClient = new HttpClient(handler);
  }
*/

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
    
    //probando hello world
    this.http.get<string>(`${environment.API_URL}/auth/hello`, {
      params: new HttpParams().set('skipErrorInterceptor', 'true')
    }).pipe(
      catchError((error) => {
        console.error('Error en hello world', error);
        return error;
      }
    )).subscribe(data => {
      console.log('Data', data);
    });
    //fin de prueba

    return this.http.post<LoginResponse>(`${environment.API_URL}/auth/login` , loginData, {
      params: new HttpParams().set('skipErrorInterceptor', 'true')
    });
  }

  logout(): boolean{
    localStorage.removeItem('token');
    localStorage.clear();
    return false;
  }

  canSeeModuleUserAdministration(): boolean {
    const userRoles = localStorage.getItem('roles');
    if(!userRoles){
      return false;
    }
    const userRolesArray = JSON.parse(userRoles) as string[];
    const allowedRoles = [
      'ADMIN', 
      'GENERAL-MANAGER'
    ];
    if(
      userRolesArray.some(role => allowedRoles.includes(role))){
      return true;
    } else {
      return false;
    }
  }

  canSeeModuleProductsAdministration(): boolean {
    const userRoles = localStorage.getItem('roles');
    if(!userRoles){
      return false;
    }
    const userRolesArray = JSON.parse(userRoles) as string[];
    const allowedRoles = [
      'ADMIN', 
      'GENERAL-MANAGER',
      'STOCK-MANAGER'
    ];

    if(
      userRolesArray.some(role => allowedRoles.includes(role))){
      return true;
    } else {
      return false;
    }
  }

  canSeeModuleSalesBox(): boolean {
    const userRoles = localStorage.getItem('roles');
    if(!userRoles){
      return false;
    }
    const userRolesArray = JSON.parse(userRoles) as string[];
    const allowedRoles = [
      'ADMIN', 
      'GENERAL-MANAGER',
      'SALES-MANAGER',
      'SELLER'
    ];
    if(
      userRolesArray.some(role => allowedRoles.includes(role))){
      return true;
    } else {
      return false;
    }
  } 
}
