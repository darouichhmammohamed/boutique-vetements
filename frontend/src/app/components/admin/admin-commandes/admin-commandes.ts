import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { AdminOnglets } from '../admin-onglets/admin-onglets';
import { CommandeService } from '../../../services/commande.service';
import { Commande, StatutCommande } from '../../../models/commande';
import { STATUTS, couleurStatut, libelleStatut } from '../../../utils/statut';
import { messageErreur } from '../../../utils/erreur';

@Component({
  selector: 'app-admin-commandes',
  imports: [CurrencyPipe, DatePipe, AdminOnglets],
  templateUrl: './admin-commandes.html',
})
export class AdminCommandes implements OnInit {
  private commandeService = inject(CommandeService);

  protected statuts = STATUTS;
  protected libelleStatut = libelleStatut;
  protected couleurStatut = couleurStatut;

  commandes = signal<Commande[]>([]);
  ouvertes = signal<Set<number>>(new Set());
  chargement = signal(true);
  erreur = signal<string | null>(null);

  chiffreAffaires = computed(() =>
    this.commandes()
      .filter((c) => c.statut !== 'ANNULEE')
      .reduce((total, c) => total + c.total, 0),
  );
  enAttente = computed(() => this.commandes().filter((c) => c.statut === 'EN_ATTENTE').length);

  ngOnInit(): void {
    this.commandeService.toutes().subscribe({
      next: (commandes) => {
        this.commandes.set(commandes);
        this.chargement.set(false);
      },
      error: (err) => {
        this.erreur.set(messageErreur(err, 'Impossible de charger les commandes'));
        this.chargement.set(false);
      },
    });
  }

  basculerDetails(id: number): void {
    this.ouvertes.update((ids) => {
      const copie = new Set(ids);
      if (copie.has(id)) {
        copie.delete(id);
      } else {
        copie.add(id);
      }
      return copie;
    });
  }

  changerStatut(commande: Commande, statut: string): void {
    const nouveauStatut = statut as StatutCommande;
    if (nouveauStatut === commande.statut) {
      return;
    }
    if (nouveauStatut === 'ANNULEE' && !confirm(`Annuler la commande n°${commande.id} ? Le stock sera remis à jour.`)) {
      this.commandes.update((liste) => [...liste]);
      return;
    }
    this.erreur.set(null);
    this.commandeService.changerStatut(commande.id, nouveauStatut).subscribe({
      next: (miseAJour) =>
        this.commandes.update((liste) => liste.map((c) => (c.id === miseAJour.id ? miseAJour : c))),
      error: (err) => {
        this.erreur.set(messageErreur(err, 'Changement de statut impossible'));
        this.commandes.update((liste) => [...liste]);
      },
    });
  }
}
