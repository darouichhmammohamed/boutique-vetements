import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const connecteGuard: CanActivateFn = (_route, etat) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.estConnecte()
    ? true
    : router.createUrlTree(['/connexion'], { queryParams: { retour: etat.url } });
};

export const adminGuard: CanActivateFn = (_route, etat) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (!auth.estConnecte()) {
    return router.createUrlTree(['/connexion'], { queryParams: { retour: etat.url } });
  }
  return auth.estAdmin() ? true : router.createUrlTree(['/']);
};
