import { inject } from '@angular/core'
import { CanActivateFn, Router  } from '@angular/router';
import { AuthService } from './auth.service';

export const managerRoleGuard: CanActivateFn = (route, state) => {
   const router = inject(Router);
    const authService = inject(AuthService);
    if(authService.isManager()){
    return true; 
    } else {
    console.log("Non puoi accedere a questa funzionalità")
    router.navigateByUrl("/login"); 
    return false; 
    }
};
