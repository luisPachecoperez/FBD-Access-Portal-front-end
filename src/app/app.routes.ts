import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path:'auth',
    loadChildren:()=>import('./auth/auth.routes')
  },
  {
    path:'fbd-front',
    loadChildren:()=>import('./FBD-front/fbd-front.routes')
  },
  {
    path:'**',
    redirectTo:'auth/login'
  }
];
