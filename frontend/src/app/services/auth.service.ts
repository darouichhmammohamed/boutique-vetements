import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { API_URL } from '../api';
import { AuthResponse, Utilisateur } from '../models/utilisateur';

const CLE_TOKEN = 'token';
const CLE_UTILISATEUR = 'utilisateur';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private readonly utilisateurConnecte = signal<Utilisateur | null>(this.chargerSession());

  readonly utilisateur = this.utilisateurConnecte.asReadonly();
  readonly estConnecte = computed(() => this.utilisateurConnecte() !== null);
  readonly estAdmin = computed(() => this.utilisateurConnecte()?.role === 'ADMIN');

  get token(): string | null {
    return localStorage.getItem(CLE_TOKEN);
  }

  connexion(email: string, motDePasse: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${API_URL}/auth/connexion`, { email, motDePasse })
      .pipe(tap((reponse) => this.ouvrirSession(reponse)));
  }

  inscription(nom: string, email: string, motDePasse: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${API_URL}/auth/inscription`, { nom, email, motDePasse })
      .pipe(tap((reponse) => this.ouvrirSession(reponse)));
  }

  deconnexion(): void {
    this.fermerSession();
    this.router.navigate(['/']);
  }

  sessionExpiree(): void {
    this.fermerSession();
    this.router.navigate(['/connexion'], { queryParams: { expire: 1 } });
  }

  private ouvrirSession(reponse: AuthResponse): void {
    localStorage.setItem(CLE_TOKEN, reponse.token);
    localStorage.setItem(CLE_UTILISATEUR, JSON.stringify(reponse.utilisateur));
    this.utilisateurConnecte.set(reponse.utilisateur);
  }

  private fermerSession(): void {
    localStorage.removeItem(CLE_TOKEN);
    localStorage.removeItem(CLE_UTILISATEUR);
    this.utilisateurConnecte.set(null);
  }

  private chargerSession(): Utilisateur | null {
    const token = localStorage.getItem(CLE_TOKEN);
    const utilisateur = localStorage.getItem(CLE_UTILISATEUR);
    if (!token || !utilisateur || this.estExpire(token)) {
      localStorage.removeItem(CLE_TOKEN);
      localStorage.removeItem(CLE_UTILISATEUR);
      return null;
    }
    try {
      return JSON.parse(utilisateur) as Utilisateur;
    } catch {
      return null;
    }
  }

  private estExpire(token: string): boolean {
    try {
      const contenu = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      const { exp } = JSON.parse(atob(contenu)) as { exp: number };
      return exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }
}
