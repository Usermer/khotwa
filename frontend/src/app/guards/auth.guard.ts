import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}
  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // Vérifier si l'utilisateur est authentifié
    if (this.authService.isAuthenticated()) {
      return true;
    }
    
    // Si non authentifié, rediriger vers login
    console.log('Access denied, redirecting to login');
    this.router.navigate(['/login'], { 
      queryParams: { 
        returnUrl: state.url,
        message: 'Please login to report a missing person'
      }
    });
    return false;
  }
}
