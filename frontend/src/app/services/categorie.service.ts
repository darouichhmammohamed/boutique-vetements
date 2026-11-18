import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../api';
import { Categorie } from '../models/categorie';

@Injectable({ providedIn: 'root' })
export class CategorieService {
  private http = inject(HttpClient);
  private apiUrl = `${API_URL}/categories`;

  getAll(): Observable<Categorie[]> {
    return this.http.get<Categorie[]>(this.apiUrl);
  }

  getById(id: number): Observable<Categorie> {
    return this.http.get<Categorie>(`${this.apiUrl}/${id}`);
  }

  creer(nom: string): Observable<Categorie> {
    return this.http.post<Categorie>(this.apiUrl, { nom });
  }

  modifier(id: number, nom: string): Observable<Categorie> {
    return this.http.put<Categorie>(`${this.apiUrl}/${id}`, { nom });
  }

  supprimer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
