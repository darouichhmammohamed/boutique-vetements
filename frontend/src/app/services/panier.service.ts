import { Injectable, computed, effect, signal } from '@angular/core';
import { ArticlePanier } from '../models/panier';
import { Produit } from '../models/produit';

const CLE_PANIER = 'panier';
const QUANTITE_MAX = 20;

@Injectable({ providedIn: 'root' })
export class PanierService {
  private readonly contenu = signal<ArticlePanier[]>(this.charger());

  readonly articles = this.contenu.asReadonly();
  readonly nombreArticles = computed(() => this.contenu().reduce((n, a) => n + a.quantite, 0));
  readonly total = computed(() => this.contenu().reduce((t, a) => t + a.produit.prix * a.quantite, 0));

  constructor() {
    effect(() => localStorage.setItem(CLE_PANIER, JSON.stringify(this.contenu())));
  }

  ajouter(produit: Produit, taille: string, quantite: number): void {
    this.contenu.update((articles) => {
      const existant = articles.find((a) => a.produit.id === produit.id && a.taille === taille);
      if (existant) {
        return articles.map((a) =>
          a === existant ? { ...a, quantite: this.limiter(a.quantite + quantite, produit) } : a,
        );
      }
      return [...articles, { produit, taille, quantite: this.limiter(quantite, produit) }];
    });
  }

  modifierQuantite(article: ArticlePanier, quantite: number): void {
    if (quantite <= 0) {
      this.retirer(article);
      return;
    }
    this.contenu.update((articles) =>
      articles.map((a) => (a === article ? { ...a, quantite: this.limiter(quantite, a.produit) } : a)),
    );
  }

  retirer(article: ArticlePanier): void {
    this.contenu.update((articles) => articles.filter((a) => a !== article));
  }

  vider(): void {
    this.contenu.set([]);
  }

  private limiter(quantite: number, produit: Produit): number {
    return Math.max(1, Math.min(quantite, produit.stock, QUANTITE_MAX));
  }

  private charger(): ArticlePanier[] {
    try {
      const donnees = JSON.parse(localStorage.getItem(CLE_PANIER) ?? '[]');
      return Array.isArray(donnees) ? donnees : [];
    } catch {
      return [];
    }
  }
}
