import { Routes } from '@angular/router';
import { adminGuard, connecteGuard } from './guards/auth.guards';
import { ProduitList } from './components/produit-list/produit-list';
import { ProduitDetail } from './components/produit-detail/produit-detail';
import { Panier } from './components/panier/panier';
import { Connexion } from './components/connexion/connexion';
import { Inscription } from './components/inscription/inscription';
import { MesCommandes } from './components/mes-commandes/mes-commandes';
import { AdminProduits } from './components/admin/admin-produits/admin-produits';
import { ProduitForm } from './components/admin/produit-form/produit-form';
import { AdminCategories } from './components/admin/admin-categories/admin-categories';
import { AdminCommandes } from './components/admin/admin-commandes/admin-commandes';
import { PageIntrouvable } from './components/page-introuvable/page-introuvable';

const NOM_SITE = 'Boutique de vêtements';

export const routes: Routes = [
  { path: '', component: ProduitList, title: NOM_SITE },
  { path: 'produits/:id', component: ProduitDetail, title: `Produit | ${NOM_SITE}` },
  { path: 'panier', component: Panier, title: `Mon panier | ${NOM_SITE}` },
  { path: 'connexion', component: Connexion, title: `Connexion | ${NOM_SITE}` },
  { path: 'inscription', component: Inscription, title: `Inscription | ${NOM_SITE}` },
  {
    path: 'mes-commandes',
    component: MesCommandes,
    canActivate: [connecteGuard],
    title: `Mes commandes | ${NOM_SITE}`,
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'produits', pathMatch: 'full' },
      { path: 'produits', component: AdminProduits, title: `Admin - Produits | ${NOM_SITE}` },
      { path: 'produits/nouveau', component: ProduitForm, title: `Admin - Nouveau produit | ${NOM_SITE}` },
      { path: 'produits/:id', component: ProduitForm, title: `Admin - Modifier un produit | ${NOM_SITE}` },
      { path: 'categories', component: AdminCategories, title: `Admin - Catégories | ${NOM_SITE}` },
      { path: 'commandes', component: AdminCommandes, title: `Admin - Commandes | ${NOM_SITE}` },
    ],
  },
  { path: '**', component: PageIntrouvable, title: `Page introuvable | ${NOM_SITE}` },
];
