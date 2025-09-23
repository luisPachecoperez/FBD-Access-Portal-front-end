import { Routes } from "@angular/router";
import { AuthLayoutComponent } from "./layout/auth-layout/auth-layout.component";
import { LoginPageComponent } from "./pages/login-page/login-page.component";
import { NotAuthenticatedGuard } from "./guards/not-authenticated.guard";
export const authRoutes:Routes = [
  {
    path:'',
    component:AuthLayoutComponent,
    children:[
      {
        path:'login',
        component:LoginPageComponent,
        canActivate: [NotAuthenticatedGuard]
      },
      {
        path:'**',
        redirectTo:'login'
      }
    ]
  }
];
export default authRoutes;
