import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, delay, of, switchMap } from 'rxjs';
import { environment } from '../../../../environment';
import { User } from '../../../models/user.model';
import { Role } from '../../../models/role.model';
import { RoleFilters } from '../roles/roles.service';

@Injectable({
  providedIn: 'root'
})

export class UsersService {

  constructor(private http: HttpClient) { }

 
  getUsers(userFilters: UserFilters): Observable<any> {

    let { page, take, emailFilter, usernameFilter, stateFilter  } = userFilters;

    !userFilters.page ? page = 1 : page;
    !userFilters.take ? take = 10 : take;
    !userFilters.emailFilter ? emailFilter = '' : emailFilter;
    !userFilters.usernameFilter ? usernameFilter = '' : usernameFilter;
    !userFilters.stateFilter ? stateFilter = 2 : stateFilter;
    
    //SIMULATE DELAY
    //return of(null).pipe(
    //  delay(2000),
    //  // Utilizamos switchMap para realizar la petición HTTP después de esperar
    //  switchMap(() => this.http.get<any>(`${environment.API_URL}/users?take=${take}&page=${page}&order=DESC&email=${emailFilter}&username=${usernameFilter}&state=${stateFilter}`))
    //);
    //console.log(`${environment.API_URL}/users?page=${page}&take=${take}&order=DESC&email=${emailFilter}&username=${usernameFilter}&state=${stateFilter}`);
    
    return this.http.get<any>(`${environment.API_URL}/users?take=${take}&page=${page}&order=DESC&email=${emailFilter}&username=${usernameFilter}&state=${stateFilter}`);
  }

  createUser(username: string, email: string, password: string): Observable<any> {
    
    const data: any = {
      username: username,
      email: email,
      password: password
    };

    //SIMULATE DELAY
    return of(null).pipe(
      delay(1000),
      switchMap(() => this.http.post<any>(`${environment.API_URL}/users`, data))
    )
    
    //return this.http.post<any>(`${environment.API_URL}/users`, data);
  }

  updateUser(user: User, password?: String): Observable<any> {
    //El backend espera que los roles sean un arreglo de strings, no de objetos
    const rolesNameArray: Array<string> = user.roles.map((role: Role) => role.name);
    let data;
    
    if(password){
      data = {
        username: user.username,
        email: user.email,
        roles: rolesNameArray,
        password: password
      }
    } else {
      data = {
        username: user.username,
        email: user.email,
        roles: rolesNameArray
      }
    }

    const res =  this.http.patch<any>(`${environment.API_URL}/users/${user.id}`, data);

    console.log(res);

    return res;
  }

  deleteUser(userId: number): Observable<any> {
    return this.http.delete<any>(`${environment.API_URL}/users/${userId}`);
  }

  enableUser(userId: number): Observable<any> {
    return this.http.get<any>(`${environment.API_URL}/users/enable/${userId}`);
  }

  hasReachedEnd(element: HTMLElement) {
    return element.offsetHeight + element.scrollTop >= element.scrollHeight;
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

export interface UserFilters {
  page?: number;
  take?: number;
  emailFilter?: string;
  usernameFilter?: string;
  stateFilter?: number;
}
