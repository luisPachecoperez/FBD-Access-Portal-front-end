import { Routes } from "@angular/router";
import { HomePageComponent } from "./pages/home-page/home-page.component";
import { DashboardFbdLayoutComponent } from './layouts/dashboard-fbd-layout.component';
import { AppEmbedComponent } from "./pages/app-embed/app-embed.component";
export const adminRoutes: Routes = [
  {
    path: '',
    component: DashboardFbdLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        component: HomePageComponent
      },

      {
        path: '**',
        redirectTo: 'home'
      }
    ]
  }
];

export default adminRoutes;
