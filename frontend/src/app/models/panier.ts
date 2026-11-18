import { Produit } from './produit';

export interface ArticlePanier {
  produit: Produit;
  taille: string;
  quantite: number;
}
