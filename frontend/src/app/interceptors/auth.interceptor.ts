import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { API_URL } from '../api';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (requete, suivant) => {
  const auth = inject(AuthService);
  const token = auth.token;
  const requeteFinale =
    token && requete.url.startsWith(API_URL)
      ? requete.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : requete;

  return suivant(requeteFinale).pipe(
    catchError((erreur: HttpErrorResponse) => {
      if (erreur.status === 401 && token) {
        auth.sessionExpiree();
      }
      return throwError(() => erreur);
    }),
  );
};
