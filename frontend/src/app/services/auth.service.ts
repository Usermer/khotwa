import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/api';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private userSubject = new BehaviorSubject<any>(null);

  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  public user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {
    this.checkAuthStatus();
  }

  // ========== LOGIN ==========
  login(email: string, password: string): Observable<any> {
    const loginData = {
      email: email,
      password: password
    };

    return this.http.post(`${this.baseUrl}/auth/login`, loginData, {
      withCredentials: true
    }).pipe(
      tap((response: any) => {
        console.log('✅ Login response:', response);
        // Mettre à jour l'utilisateur après login réussi
        if (response.success && response.user) {
          this.userSubject.next(response.user);
          this.isAuthenticatedSubject.next(true);
        }
      }),
      catchError(error => {
        console.error('❌ Login error:', error);
        let errorMessage = 'Email ou mot de passe incorrect';
        
        if (error.status === 401) {
          errorMessage = 'Identifiants invalides';
        } else if (error.status === 0) {
          errorMessage = 'Serveur injoignable. Vérifiez que le backend tourne.';
        } else if (error.error && error.error.error) {
          errorMessage = error.error.error;
        }
        
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  // ========== REGISTER ==========
  register(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
  }): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/register`, userData, {
      withCredentials: true
    }).pipe(
      tap((response: any) => {
        console.log('✅ Register response:', response);
        if (response.success && response.user) {
          this.userSubject.next(response.user);
          this.isAuthenticatedSubject.next(true);
        }
      }),
      catchError(error => {
        console.error('❌ Register error:', error);
        let errorMessage = 'Erreur d\'inscription';
        
        if (error.error && error.error.error) {
          errorMessage = error.error.error;
        } else if (error.error && typeof error.error === 'string') {
          errorMessage = error.error;
        }
        
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  // ========== CHECK AUTH STATUS ==========
  checkAuthStatus(): void {
    console.log('🔍 Checking auth status at:', `${this.baseUrl}/auth/me`);
    
    this.http.get(`${this.baseUrl}/auth/me`, {
      withCredentials: true
    }).subscribe({
      next: (response: any) => {
        console.log('✅ Auth status response:', response);
        
        // Vérifie la structure de ta réponse
        if (response && response.id) {
          // Si ton backend retourne directement l'utilisateur
          this.userSubject.next(response);
          this.isAuthenticatedSubject.next(true);
        } else if (response && response.error) {
          // Si erreur "Non authentifié"
          console.log('❌ Not authenticated:', response.error);
          this.userSubject.next(null);
          this.isAuthenticatedSubject.next(false);
        } else {
          this.userSubject.next(null);
          this.isAuthenticatedSubject.next(false);
        }
      },
      error: (error) => {
        console.error('❌ Auth status error:', error);
        this.userSubject.next(null);
        this.isAuthenticatedSubject.next(false);
      }
    });
  }

  // ========== LOGOUT ==========
  logout(): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/logout`, {}, {
      withCredentials: true
    }).pipe(
      tap(() => {
        console.log('✅ Logout successful');
        this.isAuthenticatedSubject.next(false);
        this.userSubject.next(null);
        setTimeout(() => window.location.href = '/', 100);
      }),
      catchError(error => {
        console.error('❌ Logout error:', error);
        this.isAuthenticatedSubject.next(false);
        this.userSubject.next(null);
        window.location.href = '/';
        return throwError(() => error);
      })
    );
  }

  // ========== GOOGLE OAUTH2 ==========
  loginWithGoogle(): void {
    // Redirection vers l'endpoint OAuth2 du backend
    // Spring Security gérera le flux OAuth2 automatiquement
    window.location.href = `http://localhost:8080/oauth2/authorization/google`;
  }

  // Appelé après redirection depuis Google OAuth
  getOAuth2User(): Observable<any> {
    return this.http.get(`${this.baseUrl}/oauth2/user`, {
      withCredentials: true
    }).pipe(
      tap((response: any) => {
        console.log('✅ OAuth2 user:', response);
        this.userSubject.next(response);
        this.isAuthenticatedSubject.next(true);
      }),
      catchError(error => {
        console.error('❌ OAuth2 error:', error);
        this.userSubject.next(null);
        this.isAuthenticatedSubject.next(false);
        return throwError(() => error);
      })
    );
  }

  // ========== GETTERS ==========
  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  getUser(): Observable<any> {
    return this.user$;
  }

  getCurrentUserSync(): any {
    return this.userSubject.value;
  }

  // ========== DEBUG ==========
  debugRequest(): void {
    console.log('=== DEBUG ===');
    console.log('Base URL:', this.baseUrl);
    console.log('Full /me URL:', `${this.baseUrl}/auth/me`);
    console.log('Cookies:', document.cookie);
    console.log('Is authenticated:', this.isAuthenticated());
    console.log('Current user:', this.getUser());
  }
}