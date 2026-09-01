import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const guestGuard: CanActivateFn = () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (!auth.currentUser()) {
        // allow to login
        return true; 
    }

    // if already logged in
    return router.createUrlTree(['/home']); 
};