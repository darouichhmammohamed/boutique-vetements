import { StatutCommande } from '../models/commande';

export const STATUTS: { valeur: StatutCommande; libelle: string; couleur: string }[] = [
  { valeur: 'EN_ATTENTE', libelle: 'En attente', couleur: 'warning' },
  { valeur: 'VALIDEE', libelle: 'Validée', couleur: 'info' },
  { valeur: 'EXPEDIEE', libelle: 'Expédiée', couleur: 'primary' },
  { valeur: 'LIVREE', libelle: 'Livrée', couleur: 'success' },
  { valeur: 'ANNULEE', libelle: 'Annulée', couleur: 'secondary' },
];

export function libelleStatut(statut: StatutCommande): string {
  return STATUTS.find((s) => s.valeur === statut)?.libelle ?? statut;
}

export function couleurStatut(statut: StatutCommande): string {
  return STATUTS.find((s) => s.valeur === statut)?.couleur ?? 'secondary';
}
