import { Routes } from '@angular/router';
import { HomeComponent } from './ui/pages/home/home.component';
import { LoginComponent } from './ui/pages/login/login.component';
import { AuthGuard } from './core/auth.guard';
import { SignupComponent } from './ui/pages/signup/signup.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    // canActivate: [NoAuthGuard]
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // Default route redirects to home
  { path: '**', redirectTo: '/home' } // Wildcard route for 404 handling
];
