import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { OAuth2CallbackComponent } from './auth/oauth2-callback/oauth2-callback.component';
import { UserPageComponent } from './home/user-page/user-page.component';
import { MissingFormComponent } from './pages/missing-form/missing-form.component';
import { FoundFormComponent } from './pages/found-form/found-form.component';
import { MissingPersonsComponent } from './pages/missing-persons/missing-persons.component';
import { FoundPersonsComponent } from './pages/found-persons/found-persons.component';
import { DashboadAdminComponent } from './home/dashboad-admin/dashboad-admin.component';

import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
//   { path: '', component: HeroSectionComponent },
  { path: '', redirectTo: '/user-page', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'oauth2-callback', component: OAuth2CallbackComponent },
  
  { path: 'user-page', component: UserPageComponent },
  { path: 'dashboard', component: DashboadAdminComponent, canActivate: [AuthGuard] },

  // Report Forms - Protected Routes
  { path: 'report/missing', component: MissingFormComponent, canActivate: [AuthGuard] },
  { path: 'report/found', component: FoundFormComponent, canActivate: [AuthGuard] },
  
  // Public Lists
  { path: 'missing', component: MissingPersonsComponent },
  { path: 'found', component: FoundPersonsComponent },
  
  { path: '**', component: UserPageComponent },
  
  
];
