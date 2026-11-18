import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AdminOnglets } from '../admin-onglets/admin-onglets';
import { ProduitService } from '../../../services/produit.service';
import { CategorieService } from '../../../services/categorie.service';
import { Categorie } from '../../../models/categorie';
import { ProduitRequest } from '../../../models/produit';
import { erreursDesChamps, messageErreur } from '../../../utils/erreur';

type Champ = 'nom' | 'description' | 'prix' | 'stock' | 'tailles' | 'imageUrl' | 'categorieId';

@Component({
  selector: 'app-produit-form',
  imports: [ReactiveFormsModule, RouterLink, AdminOnglets],
  templateUrl: './produit-form.html',
})
export class ProduitForm implements OnInit {
  private produitService = inject(ProduitService);
  private categorieService = inject(CategorieService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  protected produitId: number | null = null;

  categories = signal<Categorie[]>([]);
  chargement = signal(false);
  envoi = signal(false);
  erreur = signal<string | null>(null);
  erreursServeur = signal<Record<string, string>>({});

  formulaire = inject(FormBuilder).nonNullable.group({
    nom: ['', [Validators.required, Validators.maxLength(150)]],
    description: ['', [Validators.required, Validators.maxLength(1000)]],
    prix: [0, [Validators.required, Validators.min(0.01)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    tailles: ['S,M,L,XL', Validators.required],
    imageUrl: ['', Validators.maxLength(255)],
    categorieId: [0, Validators.min(1)],
  });

  ngOnInit(): void {
    this.categorieService.getAll().subscribe({
      next: (categories) => this.categories.set(categories),
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.produitId = Number(id);
      this.chargement.set(true);
      this.produitService.getById(this.produitId).subscribe({
        next: (p) => {
          this.formulaire.setValue({
            nom: p.nom,
            description: p.description,
            prix: p.prix,
            stock: p.stock,
            tailles: p.tailles,
            imageUrl: p.imageUrl ?? '',
            categorieId: p.categorie.id,
          });
          this.chargement.set(false);
        },
        error: (err) => {
          this.erreur.set(messageErreur(err, 'Produit introuvable'));
          this.chargement.set(false);
        },
      });
    }
  }

  invalide(champ: Champ): boolean {
    const controle = this.formulaire.controls[champ];
    return (controle.touched && controle.invalid) || !!this.erreurServeur(champ);
  }

  erreurServeur(champ: Champ): string | undefined {
    const cle = champ === 'categorieId' ? 'categorie' : champ;
    return this.erreursServeur()[cle];
  }

  enregistrer(): void {
    if (this.formulaire.invalid) {
      this.formulaire.markAllAsTouched();
      return;
    }
    const valeurs = this.formulaire.getRawValue();
    const produit: ProduitRequest = {
      nom: valeurs.nom.trim(),
      description: valeurs.description.trim(),
      prix: Number(valeurs.prix),
      stock: Number(valeurs.stock),
      tailles: valeurs.tailles,
      imageUrl: valeurs.imageUrl.trim(),
      categorie: { id: Number(valeurs.categorieId) },
    };
    const requete = this.produitId
      ? this.produitService.modifier(this.produitId, produit)
      : this.produitService.creer(produit);

    this.envoi.set(true);
    this.erreur.set(null);
    this.erreursServeur.set({});
    requete.subscribe({
      next: () => this.router.navigate(['/admin/produits']),
      error: (err) => {
        this.erreur.set(messageErreur(err, 'Enregistrement impossible'));
        this.erreursServeur.set(erreursDesChamps(err));
        this.envoi.set(false);
      },
    });
  }
}
