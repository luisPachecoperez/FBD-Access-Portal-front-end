import { Routes } from '@angular/router';
import { AppEmbedComponent } from './dashboard-fbd/pages/app-embed/app-embed.component';
import { AuthGuard } from './auth/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes'),
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard-fbd/admin.routes'),
    canActivate: [AuthGuard],
  },
  {
    path: 'embed',
    component: AppEmbedComponent,
    canActivate: [AuthGuard],
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'auth/login',
  },
];
