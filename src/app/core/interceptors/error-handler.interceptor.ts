import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errorHandlerInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const tokenValue = localStorage.getItem('token'); // Search token in local storage
  req = req.clone({
    setHeaders: { Authorization: `Bearer ${tokenValue}` } // Add token to headers
  });

  return next(req).pipe(catchError((error: HttpErrorResponse) => {
    let errorMessage = "";

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      if(error.status === 401){
        //clean localstorage
        //localStorage.removeItem('token');
        localStorage.clear();
        //redirect to login
        router.navigateByUrl('/login');
      } else if(error.status === 403){
        //redirect to forbidden
        router.navigateByUrl('/welcome');
      }
      console.error("Desde interceptor -> " + JSON.stringify(error));
      errorMessage = `Error code: ${error.status}, message: ${error.error.message}`;
    }

    return throwError(() => errorMessage); 
  }))
};
