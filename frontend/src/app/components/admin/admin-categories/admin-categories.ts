import { Component, OnInit, inject, signal } from '@angular/core';
import { AdminOnglets } from '../admin-onglets/admin-onglets';
import { CategorieService } from '../../../services/categorie.service';
import { Categorie } from '../../../models/categorie';
import { messageErreur } from '../../../utils/erreur';

@Component({
  selector: 'app-admin-categories',
  imports: [AdminOnglets],
  templateUrl: './admin-categories.html',
})
export class AdminCategories implements OnInit {
  private categorieService = inject(CategorieService);

  categories = signal<Categorie[]>([]);
  nouveauNom = signal('');
  enEdition = signal<number | null>(null);
  nomEdite = signal('');
  erreur = signal<string | null>(null);
  succes = signal<string | null>(null);

  ngOnInit(): void {
    this.categorieService.getAll().subscribe({
      next: (categories) => this.categories.set(this.trier(categories)),
      error: (err) => this.erreur.set(messageErreur(err, 'Impossible de charger les catégories')),
    });
  }

  ajouter(): void {
    const nom = this.nouveauNom().trim();
    if (!nom) {
      return;
    }
    this.reinitialiserMessages();
    this.categorieService.creer(nom).subscribe({
      next: (categorie) => {
        this.categories.update((liste) => this.trier([...liste, categorie]));
        this.nouveauNom.set('');
        this.succes.set(`Catégorie « ${categorie.nom} » ajoutée.`);
      },
      error: (err) => this.erreur.set(messageErreur(err, 'Ajout impossible')),
    });
  }

  commencerEdition(categorie: Categorie): void {
    this.enEdition.set(categorie.id);
    this.nomEdite.set(categorie.nom);
  }

  annulerEdition(): void {
    this.enEdition.set(null);
  }

  enregistrer(categorie: Categorie): void {
    const nom = this.nomEdite().trim();
    if (!nom) {
      return;
    }
    this.reinitialiserMessages();
    this.categorieService.modifier(categorie.id, nom).subscribe({
      next: (miseAJour) => {
        this.categories.update((liste) => this.trier(liste.map((c) => (c.id === miseAJour.id ? miseAJour : c))));
        this.enEdition.set(null);
        this.succes.set('Catégorie modifiée.');
      },
      error: (err) => this.erreur.set(messageErreur(err, 'Modification impossible')),
    });
  }

  supprimer(categorie: Categorie): void {
    if (!confirm(`Supprimer la catégorie « ${categorie.nom} » ?`)) {
      return;
    }
    this.reinitialiserMessages();
    this.categorieService.supprimer(categorie.id).subscribe({
      next: () => {
        this.categories.update((liste) => liste.filter((c) => c.id !== categorie.id));
        this.succes.set(`Catégorie « ${categorie.nom} » supprimée.`);
      },
      error: (err) =>
        this.erreur.set(
          err.status === 409
            ? `Impossible de supprimer « ${categorie.nom} » : elle contient encore des produits.`
            : messageErreur(err, 'Suppression impossible'),
        ),
    });
  }

  private reinitialiserMessages(): void {
    this.erreur.set(null);
    this.succes.set(null);
  }

  private trier(categories: Categorie[]): Categorie[] {
    return [...categories].sort((a, b) => a.nom.localeCompare(b.nom));
  }
}
