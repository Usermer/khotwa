import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MissingPersonService {
  
  private apiUrl = 'http://localhost:8080/api/missing-persons';

  constructor(private http: HttpClient) { }

  // Récupérer tous les rapports
  getAllReports(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Récupérer un rapport par ID
  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Créer un nouveau rapport
  createReport(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data, { 
      withCredentials: true 
    });
  }

  // Créer avec photo
  createWithPhoto(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/with-photo`, formData, {
      withCredentials: true
    });
  }

  // Récupérer par statut
  getByStatus(status: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/status/${status}`);
  }
}
