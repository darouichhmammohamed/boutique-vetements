import { HttpErrorResponse } from '@angular/common/http';

export function messageErreur(erreur: unknown, messageParDefaut = 'Une erreur est survenue'): string {
  if (erreur instanceof HttpErrorResponse) {
    if (erreur.status === 0) {
      return 'Impossible de contacter le serveur. Le backend est-il lancé ?';
    }
    if (typeof erreur.error?.message === 'string') {
      return erreur.error.message;
    }
  }
  return messageParDefaut;
}

export function erreursDesChamps(erreur: unknown): Record<string, string> {
  if (erreur instanceof HttpErrorResponse && erreur.error?.erreurs) {
    return erreur.error.erreurs;
  }
  return {};
}
