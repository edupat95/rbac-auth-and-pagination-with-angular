import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  EMPTY,
  firstValueFrom,
  Observable,
} from 'rxjs';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  constructor(private http: HttpClient) {}

  async loadPermissions(): Promise<void> {
    const permissions = await this.http.get<string[]>(`${environment.API_URL}/permissions/permissions-of-user`).toPromise();
    if (permissions) {
      //save permissions in local storage
      localStorage.setItem('permissions', JSON.stringify(permissions));
    }
    //console.log('Permissions loaded: ' + localStorage.getItem('permissions'));
  }

  hasPermission(permission: string): boolean {
    const permissionsString = localStorage.getItem('permissions');
    if (!permissionsString) {
      return false;
    }
    const permissions = JSON.parse(permissionsString) as string[];
    //console.log('permissions: ', permissions);
    return permissions.includes(permission) ?? false;
  }

  permission(permission: string): Observable<string[]> {
    return this.http.get<string[]>(
      `${environment.API_URL}/permissions/roles-by-permission/${permission}`
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
