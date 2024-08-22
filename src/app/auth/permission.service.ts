import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, EMPTY, firstValueFrom, Observable } from 'rxjs';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  constructor(private http: HttpClient) { }

  permission(permission: string): Observable<string[]> {
    
    //console.log('Url: ' + `${environment.API_URL}/permissions/${permission}`);
    
    return this.http.get<string[]>(
      `${environment.API_URL}/permissions/${permission}`
    );
  }

  async has_permission(permission: string): Promise<boolean> {
    try {
      const permissionRoles: string[] = await firstValueFrom(
        this.permission(permission).pipe(
          catchError((error: string) => {
            console.log(error);
            return EMPTY;
          })
        )
      );
      
      const userRoles = localStorage.getItem('roles');
      if (!userRoles) {
        return false;
      }
      
      const userRolesArray = JSON.parse(userRoles) as string[];

      //console.log('userRolesArray  -----------> ', userRolesArray);
      //console.log('permissionRoles -----------> ', permissionRoles);

      if (permissionRoles.length === 0) {
        return true;
      }

      return userRolesArray.some((role) => permissionRoles.includes(role));
    } catch (error) {
      console.log(error);
      return false;
    }
  }

} 
