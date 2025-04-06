import { inject } from '@angular/core'
import { CanActivateFn, Router  } from '@angular/router';
import { AuthService } from './auth.service';

export const agentRoleGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
     const authService = inject(AuthService);
     if(authService.isAgent()){
     return true; 
     } else {
     console.log("Non puoi accedere a questa funzionalità")
     router.navigateByUrl("/login"); 
     return false; 
     }
};
