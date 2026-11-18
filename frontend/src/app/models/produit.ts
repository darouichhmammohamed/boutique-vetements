import { Categorie } from './categorie';

export interface Produit {
  id: number;
  nom: string;
  description: string;
  prix: number;
  stock: number;
  tailles: string;
  imageUrl: string;
  categorie: Categorie;
}

export interface ProduitRequest {
  nom: string;
  description: string;
  prix: number;
  stock: number;
  tailles: string;
  imageUrl: string;
  categorie: { id: number };
}
