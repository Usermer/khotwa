import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FoundService {
  private baseUrl = "http://localhost:8080/api/found-persons";

  constructor(private http: HttpClient) { }

  // ============ PUBLIC ENDPOINTS ============
  // Accessible to everyone without authentication
  
  // Get all found person reports (PUBLIC)
  getAllReports(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}`);
  }

  // Get a specific report by ID (PUBLIC)
  getReportById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  // Search reports by keyword (PUBLIC)
  searchReports(keyword: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/search`, {
      params: { keyword }
    });
  }

  // Get reports by status (PUBLIC)
  getByStatus(status: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/status/${status}`);
  }

  // ============ AUTHENTICATED ENDPOINTS ============
  // Require authentication (USER)
  
  // Create a new found person report (AUTHENTICATED)
  createReport(foundPersonData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`, foundPersonData, {
      withCredentials: true // Important for authentication
    });
  }

  // Create a found person report with photo upload (AUTHENTICATED)
  createReportWithPhoto(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/with-photo`, formData, {
      withCredentials: true // Important for authentication
    });
  }

  // Get my own reports (AUTHENTICATED)
  getMyReports(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/user/my-reports`, {
      withCredentials: true // Important for authentication
    });
  }

  // Update my report (AUTHENTICATED)
  updateMyReport(id: number, foundPersonData: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, foundPersonData, {
      withCredentials: true // Important for authentication
    });
  }

  // Delete my report (AUTHENTICATED)
  deleteMyReport(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`, {
      withCredentials: true // Important for authentication
    });
  }
}
