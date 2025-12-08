import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MissingService {
  private baseUrl = "http://localhost:8080/api/missing-persons";

  constructor(private http: HttpClient) { }

  // ============ PUBLIC ENDPOINTS ============
  // Accessibles à tous sans authentification
  
  // Afficher seulement les signalements approuvés (PUBLIC)
  getApprovedReports(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/approved`);
    // withCredentials: false car c'est public
  }

  // Voir un signalement approuvé (PUBLIC)
  getApprovedReport(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/approved/${id}`);
    // withCredentials: false car c'est public
  }

  // ============ PRIVATE ENDPOINTS ============
  // Requièrent authentification USER
  
  // Créer un signalement (SEULEMENT SI AUTHENTIFIÉ)
  createReport(missingPersonData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`, missingPersonData, {
      withCredentials: true // Important pour l'authentification
    });
  }

  // Créer un signalement avec upload de photo (SEULEMENT SI AUTHENTIFIÉ)
  createReportWithPhoto(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/with-photo`, formData, {
      withCredentials: true // Important pour l'authentification
    });
  }

  // Obtenir mes signalements (SEULEMENT SI AUTHENTIFIÉ)
  getMyReports(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/user/my-reports`, {
      withCredentials: true // Important pour l'authentification
    });
  }

  // Mettre à jour mon signalement (SEULEMENT SI AUTHENTIFIÉ)
  updateMyReport(id: number, missingPersonData: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, missingPersonData, {
      withCredentials: true // Important pour l'authentification
    });
  }

  // Supprimer mon signalement (SEULEMENT SI AUTHENTIFIÉ)
  deleteMyReport(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`, {
      withCredentials: true // Important pour l'authentification
    });
  }
}