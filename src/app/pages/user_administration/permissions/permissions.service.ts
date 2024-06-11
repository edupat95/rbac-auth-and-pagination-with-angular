import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment';
import { RoleFilters } from '../roles/roles.service';
import { Role, rolesToString } from '../../../models/role.model';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {

  constructor(private http: HttpClient) { }

  getPermissions(userFilters: PermissionFilters): Observable<any> {

    let { page, take, nameFilter } = userFilters;

    !userFilters.page ? page = 1 : page;
    !userFilters.take ? take = 10 : take;
    !userFilters.nameFilter ? nameFilter = '' : nameFilter;
    
    //SIMULATE DELAY
    //return of(null).pipe(
    //  delay(2000),
    //  // Utilizamos switchMap para realizar la petición HTTP después de esperar
    //  switchMap(() => this.http.get<any>(`${environment.API_URL}/users?take=${take}&page=${page}&order=DESC&email=${emailFilter}&username=${usernameFilter}&state=${stateFilter}`))
    //);
    //console.log(`${environment.API_URL}/users?page=${page}&take=${take}&order=DESC&email=${emailFilter}&username=${usernameFilter}&state=${stateFilter}`);
    
    return this.http.get<any>(`${environment.API_URL}/permissions?take=${take}&page=${page}&order=DESC&name=${nameFilter}`);
  }

  updatePermission(id: number, name: string, roles: Role[]): Observable<any> {
      
      const data = {
        name: name,
        roles: roles
      };
      console.log("Data to send: ", JSON.stringify(data));
      return this.http.patch<any>(`${environment.API_URL}/permissions/${id}`, data);
    }

  deletePermission(id: number): Observable<any> {
    return this.http.delete<any>(`${environment.API_URL}/permissions/${id}`);
  }

  createPermission(name: string, roles: Role[]): Observable<any> {

    const data = {
      name: name,
      roles: roles
    };

    console.log("Data to send: ", JSON.stringify(data));
    return this.http.post<any>(`${environment.API_URL}/permissions`, data );
  }

  generateItems(startIndex: number, amount: number) {
    const items = Array.from({ length: amount }).map(
      (_, index) => `Item ${startIndex + index + 1}`
    );

    return items;
  }


  getRoles(filters: RoleFilters): Observable<any> {

    let { page, take, nameFilter} = filters;

    !filters.page ? page = 1 : page;
    !filters.take ? take = 10 : take;
    !filters.nameFilter ? nameFilter = '' : nameFilter;
    
    return this.http.get<any>(`${environment.API_URL}/roles?take=${take}&page=${page}&order=ASC&name=${nameFilter}`);
  }
}

export interface PermissionFilters {
  page?: number;
  nameFilter?: string;
  take?: number;
}