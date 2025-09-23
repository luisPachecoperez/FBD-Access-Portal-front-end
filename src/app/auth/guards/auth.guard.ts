import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

export const AuthGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const isAuthenticated = authService.isAuthenticated();

    if (!isAuthenticated) {
        console.log('Usuario no autenticado, redirigiendo a login');
        return router.createUrlTree(['/auth/login']);
    }
    return true;
};
