import { Produit } from './produit';
import { Utilisateur } from './utilisateur';

export type StatutCommande = 'EN_ATTENTE' | 'VALIDEE' | 'EXPEDIEE' | 'LIVREE' | 'ANNULEE';

export interface LigneCommande {
  id: number;
  quantite: number;
  taille: string;
  prixUnitaire: number;
  produit: Produit;
}

export interface Commande {
  id: number;
  dateCommande: string;
  total: number;
  statut: StatutCommande;
  adresseLivraison: string;
  utilisateur: Utilisateur;
  lignes: LigneCommande[];
}

export interface CommandeRequest {
  adresseLivraison: string;
  lignes: { produitId: number; quantite: number; taille: string }[];
}
