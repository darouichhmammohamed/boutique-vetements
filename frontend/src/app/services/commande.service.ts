import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../api';
import { Commande, CommandeRequest, StatutCommande } from '../models/commande';

@Injectable({ providedIn: 'root' })
export class CommandeService {
  private http = inject(HttpClient);
  private apiUrl = `${API_URL}/commandes`;

  creer(commande: CommandeRequest): Observable<Commande> {
    return this.http.post<Commande>(this.apiUrl, commande);
  }

  mesCommandes(): Observable<Commande[]> {
    return this.http.get<Commande[]>(`${this.apiUrl}/mes-commandes`);
  }

  annuler(id: number): Observable<Commande> {
    return this.http.put<Commande>(`${this.apiUrl}/${id}/annuler`, {});
  }

  toutes(): Observable<Commande[]> {
    return this.http.get<Commande[]>(this.apiUrl);
  }

  changerStatut(id: number, statut: StatutCommande): Observable<Commande> {
    return this.http.put<Commande>(`${this.apiUrl}/${id}/statut`, { statut });
  }
}
