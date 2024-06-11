import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, delay, of, switchMap } from 'rxjs';
import { environment } from '../../../../environment';
import { User } from '../../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  constructor(private http: HttpClient) { }

  getRoles(filters: RoleFilters): Observable<any> {
    

    let { page, take, nameFilter} = filters;

    !filters.page ? page = 1 : page;
    !filters.take ? take = 10 : take;
    !filters.nameFilter ? nameFilter = '' : nameFilter;
    
    return this.http.get<any>(`${environment.API_URL}/roles?take=${take}&page=${page}&order=DESC&name=${nameFilter}`);
  }
  
  createRole(name: string): Observable<any> {
    const data = {
      name: name
    }

    return this.http.post<any>(`${environment.API_URL}/roles`, data);
  }

  editRole(id: number, role: any): Observable<any> {
    return this.http.put<any>(`${environment.API_URL}/roles/${id}`, role);
  }

  deleteRole(name: string): Observable<any> {
    
    //SIMULATE DELAY
    //return of(null).pipe(
    //  delay(1000),
    //  switchMap(() => this.http.delete<any>(`${environment.API_URL}/roles/${name}`))
    //);

    return this.http.delete<any>(`${environment.API_URL}/roles/${name}`);
  }
}

export interface RoleFilters {
  page?: number,
  take?: number,
  nameFilter?: string;
}
