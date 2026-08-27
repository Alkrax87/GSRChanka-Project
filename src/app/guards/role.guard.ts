import { inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = async (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.usuarioLogged;

  if (!user()) {
    return router.navigate(['login']);
  }

  const allowedRoles = route.data['allowedRoles'] as string[];

  if (!allowedRoles || allowedRoles.includes(user()!.role)) {
    return true;
  }

  return router.navigate(['portal/home']);
};
