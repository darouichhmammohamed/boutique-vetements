import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-admin-onglets',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <h1 class="h3 fw-bold mb-3">Administration</h1>
    <ul class="nav nav-pills gap-2 mb-4">
      <li class="nav-item">
        <a class="nav-link link-dark border" routerLink="/admin/produits" routerLinkActive="active text-white bg-dark">Produits</a>
      </li>
      <li class="nav-item">
        <a class="nav-link link-dark border" routerLink="/admin/categories" routerLinkActive="active text-white bg-dark">Catégories</a>
      </li>
      <li class="nav-item">
        <a class="nav-link link-dark border" routerLink="/admin/commandes" routerLinkActive="active text-white bg-dark">Commandes</a>
      </li>
    </ul>
  `,
})
export class AdminOnglets {}
