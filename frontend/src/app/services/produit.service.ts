import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../api';
import { Produit, ProduitRequest } from '../models/produit';

@Injectable({ providedIn: 'root' })
export class ProduitService {
  private http = inject(HttpClient);
  private apiUrl = `${API_URL}/produits`;

  getAll(): Observable<Produit[]> {
    return this.http.get<Produit[]>(this.apiUrl);
  }

  getById(id: number): Observable<Produit> {
    return this.http.get<Produit>(`${this.apiUrl}/${id}`);
  }

  getByCategorie(categorieId: number): Observable<Produit[]> {
    return this.http.get<Produit[]>(`${this.apiUrl}/categorie/${categorieId}`);
  }

  rechercher(motCle: string): Observable<Produit[]> {
    return this.http.get<Produit[]>(`${this.apiUrl}/recherche`, { params: { q: motCle } });
  }

  creer(produit: ProduitRequest): Observable<Produit> {
    return this.http.post<Produit>(this.apiUrl, produit);
  }

  modifier(id: number, produit: ProduitRequest): Observable<Produit> {
    return this.http.put<Produit>(`${this.apiUrl}/${id}`, produit);
  }

  supprimer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
