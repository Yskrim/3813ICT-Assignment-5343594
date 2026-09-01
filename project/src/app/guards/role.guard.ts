import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserRole } from '../models';
import { AuthService } from '../services/auth.service';

export const roleGuard = (...roles: UserRole[]): CanActivateFn => () => {
    const auth = inject(AuthService);
    const router = inject(Router);
    const user = auth.currentUser();

    if (user && roles.includes(user.role)) {
        return true;
    }

    return router.createUrlTree(['/home']);
};