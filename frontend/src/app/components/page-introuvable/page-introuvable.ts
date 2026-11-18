import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-page-introuvable',
  imports: [RouterLink],
  template: `
    <div class="text-center py-5">
      <p class="display-1 fw-bold">404</p>
      <h1 class="h3 mb-3">Page introuvable</h1>
      <p class="text-muted mb-4">La page que vous cherchez n'existe pas ou a été déplacée.</p>
      <a routerLink="/" class="btn btn-dark">Retour à la boutique</a>
    </div>
  `,
})
export class PageIntrouvable {}
