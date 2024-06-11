import { CanActivateFn, Router } from '@angular/router';

import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  
  const router = inject(Router);

  if(localStorage.getItem('token')){
    return true;
  } else {
    localStorage.clear();
    router.navigateByUrl('/login');
    return false;
  }
}
  