import { Routes } from '@angular/router';
import { AppEmbedComponent } from './dashboard-fbd/pages/app-embed/app-embed.component';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes')
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard-fbd/admin.routes')
  },
  {
    path: 'embed',
    component: AppEmbedComponent
  },
  {
    path: '**',
    redirectTo: 'auth/login'
  }
];
