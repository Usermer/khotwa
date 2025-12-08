import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-oauth2-callback',
  standalone: true,
  template: `
    <div style="display: flex; justify-content: center; align-items: center; height: 100vh;">
      <div>
        <p>Authentification en cours...</p>
      </div>
    </div>
  `
})
export class OAuth2CallbackComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Vérifier que l'utilisateur est bien authentifié
    this.authService.checkAuthStatus();
    
    // Attendre un peu que la session soit créée
    setTimeout(() => {
      this.redirectBasedOnRole();
    }, 500);
  }

  redirectBasedOnRole(): void {
    const user = this.authService.getCurrentUserSync();
    console.log('👤 OAuth2 Callback - Current user:', user);
    
    if (user) {
      const roles = user.roles || [];
      const isAdmin = roles.some((role: any) => {
        const roleName = typeof role === 'string' ? role : role.name;
        return roleName === 'ADMIN' || roleName === 'ROLE_ADMIN';
      });
      
      if (isAdmin) {
        console.log('👑 Redirecting admin to /dashboard');
        this.router.navigate(['/dashboard']);
      } else {
        console.log('👤 Redirecting user to /user-page');
        this.router.navigate(['/user-page']);
      }
    } else {
      // Essayer d'obtenir l'utilisateur via /me
      this.authService.checkAuthStatus();
      setTimeout(() => {
        this.authService.getUser().subscribe({
          next: (user: any) => {
            console.log('📡 User from /me:', user);
            if (user) {
              const roles = user.roles || [];
              const isAdmin = roles.some((role: any) => {
                const roleName = typeof role === 'string' ? role : role.name;
                return roleName === 'ADMIN' || roleName === 'ROLE_ADMIN';
              });
              
              if (isAdmin) {
                this.router.navigate(['/dashboard']);
              } else {
                this.router.navigate(['/user-page']);
              }
            }
          },
          error: () => {
            console.error('Failed to get user info');
            this.router.navigate(['/login']);
          }
        });
      }, 500);
    }
  }
}
