import { CanActivateFn, Router } from '@angular/router';
import { AppService } from '../app.service';
import { inject } from '@angular/core';
import { EMPTY, catchError } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { PermissionService } from '../auth/permission.service';
export const permissionGuard: CanActivateFn = (route, state) => {
  const authService = inject(PermissionService);
  const router = inject(Router);

  const permission = route.data['permission'] as string;

  //console.log('permissionGuard' + permission);

  authService
    .permission(permission)
    .pipe(
      catchError((error: string) => {
        console.log(error);
        return EMPTY;
      })
    )
    .subscribe((permissionRoles: string[]) => {
      const userRoles = localStorage.getItem('roles');
      if (!userRoles) {
        router.navigateByUrl('/welcome');
        return false;
      }

      const userRolesArray = JSON.parse(userRoles) as string[];
      
      if (userRolesArray.some((role) => permissionRoles.includes(role))) {
        return true;
      } else {
        router.navigateByUrl('/welcome');
        return false;
      }
    });

  return true;
};
