export type Role = 'CLIENT' | 'ADMIN';

export interface Utilisateur {
  id: number;
  nom: string;
  email: string;
  role: Role;
}

export interface AuthResponse {
  token: string;
  utilisateur: Utilisateur;
}
