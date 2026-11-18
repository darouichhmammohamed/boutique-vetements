import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { ProduitService } from '../../services/produit.service';
import { CategorieService } from '../../services/categorie.service';
import { Produit } from '../../models/produit';
import { Categorie } from '../../models/categorie';
import { messageErreur } from '../../utils/erreur';

type Tri = 'defaut' | 'prix-croissant' | 'prix-decroissant' | 'nom';

@Component({
  selector: 'app-produit-list',
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './produit-list.html',
  styleUrl: './produit-list.css',
})
export class ProduitList implements OnInit {
  private produitService = inject(ProduitService);
  private categorieService = inject(CategorieService);

  produits = signal<Produit[]>([]);
  categories = signal<Categorie[]>([]);
  categorieActive = signal<number | null>(null);
  motCleActif = signal('');
  tri = signal<Tri>('defaut');
  chargement = signal(true);
  erreur = signal<string | null>(null);

  produitsAffiches = computed(() => {
    const liste = [...this.produits()];
    switch (this.tri()) {
      case 'prix-croissant':
        return liste.sort((a, b) => a.prix - b.prix);
      case 'prix-decroissant':
        return liste.sort((a, b) => b.prix - a.prix);
      case 'nom':
        return liste.sort((a, b) => a.nom.localeCompare(b.nom));
      default:
        return liste;
    }
  });

  ngOnInit(): void {
    this.categorieService.getAll().subscribe({
      next: (categories) => this.categories.set(categories),
    });
    this.afficherTous();
  }

  afficherTous(): void {
    this.categorieActive.set(null);
    this.motCleActif.set('');
    this.charger(this.produitService.getAll());
  }

  filtrerParCategorie(categorieId: number): void {
    this.categorieActive.set(categorieId);
    this.motCleActif.set('');
    this.charger(this.produitService.getByCategorie(categorieId));
  }

  rechercher(motCle: string): void {
    const recherche = motCle.trim();
    if (!recherche) {
      this.afficherTous();
      return;
    }
    this.categorieActive.set(null);
    this.motCleActif.set(recherche);
    this.charger(this.produitService.rechercher(recherche));
  }

  changerTri(valeur: string): void {
    this.tri.set(valeur as Tri);
  }

  private charger(requete: Observable<Produit[]>): void {
    this.chargement.set(true);
    this.erreur.set(null);
    requete.subscribe({
      next: (produits) => {
        this.produits.set(produits);
        this.chargement.set(false);
      },
      error: (err) => {
        this.erreur.set(messageErreur(err, 'Impossible de charger les produits'));
        this.chargement.set(false);
      },
    });
  }
}
