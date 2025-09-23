import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';

export const NotAuthenticatedGuard: CanMatchFn = async (
    route: Route,
    segments: UrlSegment[]
) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  const isAuthenticated = authService.isAuthenticated();

  if (isAuthenticated) {
    console.log('El usuario ya está autenticado');
    router.navigate(['/dashboard']);
      return false;
  }
  return true;
}
