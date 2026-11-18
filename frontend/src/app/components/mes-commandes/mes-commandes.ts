import { Component, OnInit, inject, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommandeService } from '../../services/commande.service';
import { Commande } from '../../models/commande';
import { couleurStatut, libelleStatut } from '../../utils/statut';
import { messageErreur } from '../../utils/erreur';

@Component({
  selector: 'app-mes-commandes',
  imports: [RouterLink, CurrencyPipe, DatePipe],
  templateUrl: './mes-commandes.html',
})
export class MesCommandes implements OnInit {
  private commandeService = inject(CommandeService);
  private route = inject(ActivatedRoute);

  protected nouvelleCommande = this.route.snapshot.queryParamMap.get('nouvelle');
  protected libelleStatut = libelleStatut;
  protected couleurStatut = couleurStatut;

  commandes = signal<Commande[]>([]);
  chargement = signal(true);
  erreur = signal<string | null>(null);

  ngOnInit(): void {
    this.charger();
  }

  annuler(commande: Commande): void {
    if (!confirm(`Annuler la commande n°${commande.id} ?`)) {
      return;
    }
    this.commandeService.annuler(commande.id).subscribe({
      next: (miseAJour) =>
        this.commandes.update((liste) => liste.map((c) => (c.id === miseAJour.id ? miseAJour : c))),
      error: (err) => this.erreur.set(messageErreur(err, "Impossible d'annuler la commande")),
    });
  }

  private charger(): void {
    this.commandeService.mesCommandes().subscribe({
      next: (commandes) => {
        this.commandes.set(commandes);
        this.chargement.set(false);
      },
      error: (err) => {
        this.erreur.set(messageErreur(err, 'Impossible de charger vos commandes'));
        this.chargement.set(false);
      },
    });
  }
}
