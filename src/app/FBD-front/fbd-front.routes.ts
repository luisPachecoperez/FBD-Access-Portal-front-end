import { Routes } from "@angular/router";
import { FbdDashboardLayoutComponent } from "./layouts/fbd-dashboard-layout.component";
export const fbdFrontRoutes:Routes = [
  {
    path:'',
    component:FbdDashboardLayoutComponent,
    children:[
      {
        path:'dashboard',
        component:FbdDashboardLayoutComponent
      },
      {
        path:'**',
        redirectTo:'dashboard'
      }
    ]
  }
];
export default fbdFrontRoutes;
