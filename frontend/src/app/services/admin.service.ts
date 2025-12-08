import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = "http://localhost:8080/api/admin/missing-persons"

  constructor(private http:HttpClient) { }

  //obtenir les demandes en attente
  getPending(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/pending`, {
      withCredentials: true
    });
  }

  //obtenir les demandes approuvées
  getApproved(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/approved`, {
      withCredentials: true
    });
  }

  //obtenir les demandes rejetées
  getRejected(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/rejected`, {
      withCredentials: true
    });
  }

  //obtenir toutes les demandes
  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/all`, {
      withCredentials: true
    });
  }

  // approuver demande
  approveRequest(id: number): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}/approve`, {}, {
      withCredentials: true
    });
  }

  // rejeter demande
  rejectRequest(id: number, reason: string): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}/reject`, null, {
      params: { reason },
      withCredentials: true
    });
  }
}