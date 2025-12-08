import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule, 
    RouterModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    
    // ❌ Commenté: Permet à l'utilisateur d'accéder à la page login même s'il est authentifié
    // pour pouvoir se reconnecter avec un autre compte
    // this.authService.isAuthenticated$.subscribe(isAuth => {
    //   if (isAuth) {
    //     this.redirectBasedOnRole();
    //   }
    // });
  }

  initializeForm(): void {
    // Login Form seulement (pas de register dans ce composant)
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // Getters pour accéder aux contrôles du formulaire
  get loginEmail() {
    return this.loginForm.get('email');
  }

  get loginPassword() {
    return this.loginForm.get('password');
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Please fill the form correctly';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'Sign in successful!';
        setTimeout(() => {
          this.redirectBasedOnRole();
        }, 1500);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.message || 'Sign in failed. Please check your credentials.';
      }
    });
  }

  // Rediriger basé sur le rôle de l'utilisateur
  redirectBasedOnRole(): void {
    const user = this.authService.getCurrentUserSync();
    console.log('👤 Current user for redirect:', user);
    
    if (user) {
      // Vérifier si les rôles existent et contiennent ADMIN
      const roles = user.roles || [];
      const isAdmin = roles.some((role: any) => {
        const roleName = typeof role === 'string' ? role : role.name;
        return roleName === 'ADMIN' || roleName === 'ROLE_ADMIN';
      });
      
      console.log('🔍 User roles:', roles);
      console.log('🔐 Is admin?:', isAdmin);
      
      if (isAdmin) {
        console.log('🔐 Admin detected, redirecting to /dashboard');
        this.router.navigate(['/dashboard']);
      } else {
        console.log('👤 Regular user detected, redirecting to /user-page');
        this.router.navigate(['/user-page']);
      }
    } else {
      // Fallback: essayer d'obtenir l'utilisateur depuis l'endpoint /me
      console.log('⚠️ No user found, trying /me endpoint');
      this.authService.getUser().pipe(
        take(1)
      ).subscribe({
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
          } else {
            this.router.navigate(['/user-page']);
          }
        },
        error: () => {
          console.log('❌ Error getting user, redirecting to /user-page');
          this.router.navigate(['/user-page']);
        }
      });
    }
  }
  

  loginWithGoogle(): void {
    this.authService.loginWithGoogle();
  }
}
