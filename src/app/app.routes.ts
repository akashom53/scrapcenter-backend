import { Routes } from '@angular/router';
import { HomeComponent } from './ui/pages/home/home.component';
import { LoginComponent } from './ui/pages/login/login.component';
import { AuthGuard } from './core/auth.guard';
import { SignupComponent } from './ui/pages/signup/signup.component';
import { MainLayoutComponent } from './ui/common/main-layout/main-layout.component';
import { NewScrapRequestComponent } from './ui/pages/new-scrap-request/new-scrap-request.component';
import { LeadsListComponent } from './ui/pages/leads-list/leads-list.component';
import { LeadComponent } from './ui/pages/lead/lead.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'new',
        component: NewScrapRequestComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'leads',
        component: LeadsListComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'lead/:id',
        component: LeadComponent,
        canActivate: [AuthGuard]
      }
    ]
  },
  {
    path: 'login',
    component: LoginComponent,
    // canActivate: [NoAuthGuard]
  },
  { path: 'signup', component: SignupComponent },
  { path: '**', redirectTo: '' } // Wildcard route for 404 handling
];
