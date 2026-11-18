import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProduitService } from '../../services/produit.service';
import { PanierService } from '../../services/panier.service';
import { Produit } from '../../models/produit';
import { messageErreur } from '../../utils/erreur';

@Component({
  selector: 'app-produit-detail',
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './produit-detail.html',
})
export class ProduitDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private produitService = inject(ProduitService);
  private panier = inject(PanierService);

  produit = signal<Produit | null>(null);
  chargement = signal(true);
  erreur = signal<string | null>(null);
  tailleChoisie = signal<string | null>(null);
  quantite = signal(1);
  ajoute = signal(false);

  tailles = computed(() => this.produit()?.tailles.split(',').map((t) => t.trim()).filter(Boolean) ?? []);
  quantiteMax = computed(() => Math.min(this.produit()?.stock ?? 0, 20));

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.produitService.getById(id).subscribe({
      next: (produit) => {
        this.produit.set(produit);
        this.chargement.set(false);
      },
      error: (err) => {
        this.erreur.set(messageErreur(err, 'Produit introuvable'));
        this.chargement.set(false);
      },
    });
  }

  choisirTaille(taille: string): void {
    this.tailleChoisie.set(taille);
    this.ajoute.set(false);
  }

  changerQuantite(delta: number): void {
    this.quantite.update((q) => Math.max(1, Math.min(q + delta, this.quantiteMax())));
    this.ajoute.set(false);
  }

  ajouterAuPanier(): void {
    const produit = this.produit();
    const taille = this.tailleChoisie();
    if (!produit || !taille || produit.stock === 0) {
      return;
    }
    this.panier.ajouter(produit, taille, this.quantite());
    this.ajoute.set(true);
  }
}
