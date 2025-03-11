import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const authService:AuthService=inject(AuthService)
  
  
  const authToken = authService.getToken();

  

  if (authToken) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`,
        /* 'X-XSRF-TOKEN':csrfService.getCsrfToken() */ //più in la possiamo pensare alla sicurezza
      }
    });
    return next(authReq);
  }
  
  
  return next(req);
};
