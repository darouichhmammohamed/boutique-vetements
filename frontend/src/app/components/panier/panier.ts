import { Component, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { PanierService } from '../../services/panier.service';
import { AuthService } from '../../services/auth.service';
import { CommandeService } from '../../services/commande.service';
import { ArticlePanier } from '../../models/panier';
import { messageErreur } from '../../utils/erreur';

@Component({
  selector: 'app-panier',
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './panier.html',
})
export class Panier {
  protected panier = inject(PanierService);
  protected auth = inject(AuthService);
  private commandeService = inject(CommandeService);
  private router = inject(Router);

  adresse = signal('');
  envoi = signal(false);
  erreur = signal<string | null>(null);

  changerQuantite(article: ArticlePanier, delta: number): void {
    this.panier.modifierQuantite(article, article.quantite + delta);
  }

  commander(): void {
    const adresse = this.adresse().trim();
    if (!adresse) {
      this.erreur.set("Merci d'indiquer une adresse de livraison");
      return;
    }
    this.envoi.set(true);
    this.erreur.set(null);
    this.commandeService
      .creer({
        adresseLivraison: adresse,
        lignes: this.panier.articles().map((a) => ({
          produitId: a.produit.id,
          quantite: a.quantite,
          taille: a.taille,
        })),
      })
      .subscribe({
        next: (commande) => {
          this.panier.vider();
          this.router.navigate(['/mes-commandes'], { queryParams: { nouvelle: commande.id } });
        },
        error: (err) => {
          this.erreur.set(messageErreur(err, 'La commande a échoué'));
          this.envoi.set(false);
        },
      });
  }
}
