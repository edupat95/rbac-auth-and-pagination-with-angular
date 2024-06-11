import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const roleGuard: CanActivateFn = (route, state) => {
  
  const allowedRoles = route.data['roles'] as string[];

  const router = inject(Router);

  const userRoles = localStorage.getItem('roles');
  if(!userRoles){
    router.navigateByUrl('/welcome');
    return false;
  }

  const userRolesArray = JSON.parse(userRoles) as string[];

  /* compare the roles of the user with the roles of the route */
  if(userRolesArray.some(role => allowedRoles.includes(role))){
    return true;
  } else {
    router.navigateByUrl('/welcome');
    return false;
  }
};
