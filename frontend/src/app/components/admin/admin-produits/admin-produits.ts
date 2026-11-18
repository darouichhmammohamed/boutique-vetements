import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminOnglets } from '../admin-onglets/admin-onglets';
import { ProduitService } from '../../../services/produit.service';
import { Produit } from '../../../models/produit';
import { messageErreur } from '../../../utils/erreur';

@Component({
  selector: 'app-admin-produits',
  imports: [RouterLink, CurrencyPipe, AdminOnglets],
  templateUrl: './admin-produits.html',
})
export class AdminProduits implements OnInit {
  private produitService = inject(ProduitService);

  produits = signal<Produit[]>([]);
  filtre = signal('');
  chargement = signal(true);
  erreur = signal<string | null>(null);
  succes = signal<string | null>(null);

  produitsFiltres = computed(() => {
    const filtre = this.filtre().trim().toLowerCase();
    return this.produits()
      .filter((p) => !filtre || p.nom.toLowerCase().includes(filtre) || p.categorie.nom.toLowerCase().includes(filtre))
      .sort((a, b) => a.id - b.id);
  });

  ngOnInit(): void {
    this.produitService.getAll().subscribe({
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

  supprimer(produit: Produit): void {
    if (!confirm(`Supprimer définitivement « ${produit.nom} » ?`)) {
      return;
    }
    this.erreur.set(null);
    this.succes.set(null);
    this.produitService.supprimer(produit.id).subscribe({
      next: () => {
        this.produits.update((liste) => liste.filter((p) => p.id !== produit.id));
        this.succes.set(`« ${produit.nom} » a été supprimé.`);
      },
      error: (err) =>
        this.erreur.set(
          err.status === 409
            ? `Impossible de supprimer « ${produit.nom} » : il apparaît dans des commandes. Mettez plutôt son stock à 0.`
            : messageErreur(err, 'Suppression impossible'),
        ),
    });
  }
}
