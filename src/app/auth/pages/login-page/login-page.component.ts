import { CookieService } from '../../service/cookie.service';
import { Component, ElementRef, inject, signal, ViewChild, OnDestroy, effect, viewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder,ReactiveFormsModule,Validators} from '@angular/forms';
//import { AuthService } from '../../services/auth.service';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from '../../service/auth.service';
import { environment } from '../../../../environments/environment.development';
import { rxResource } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';

import { OnInit } from '@angular/core';

// Tipado para GSI
declare const google: any;
interface GoogleJwtPayload {
  iss: string;
  nbf: number;
  aud: string;
  sub: string;
  email: string;
  email_verified: boolean;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  iat: number;
  exp: number;
  jti: string;
}

// Si tienes environments, úsalo aquí:
const GOOGLE_CLIENT_ID = (window as any)?.env?.GOOGLE_CLIENT_ID || '805564313548-77meehpvt1697vs6reevf29ihk635ei0.apps.googleusercontent.com';
@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-component.css']
})
export class LoginPageComponent implements OnInit {
  googleBtn = viewChild<ElementRef>('googleBtn');
  scriptLoaded = signal(false);
  idToken = signal<string | null>(null);
  cookieService = inject(CookieService);
  authService = inject(AuthService);
  router = inject(Router);


  async ngOnInit():Promise<void> {
    await this.ensureGsiLoaded();
    this.initGsi();
  }

  // Resource para manejar el login
  loginResource = rxResource({
    request: () => {
      const token = this.idToken();
      return token ? { idToken: token } : null;
    },
    loader: ({ request }) => {
      if (!request) return of(null);
      return this.authService.googleLogin(request.idToken);
    },
  });

  constructor() {
    // Efecto para reaccionar cuando llega respuesta
    effect(() => {
      const result = this.loginResource.value();
      if (!result) return;

      console.log('Respuesta del back:', result);

      if (result?.data?.googleLogin?.success) {
        console.log('Login exitoso');

        // guardar cookie con info básica de la persona
        this.cookieService.deleteCookie(environment.USER_COOKIE_NAME);
        this.cookieService.setCookie(
          environment.USER_COOKIE_NAME,
          JSON.stringify(result.data.googleLogin.persona),
          1 // días de expiración
        );

        // redirección al dashboard después de login exitoso
        this.router.navigate(['/dashboard']);
      } else if (this.loginResource.error()) {
        console.error('Error en login:', this.loginResource.error());
      }
    });
  }

  private async ensureGsiLoaded(): Promise<void> {
    if ((window as any).google?.accounts?.id) {
      this.scriptLoaded.set(true);
      return;
    }
    await new Promise<void>((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://accounts.google.com/gsi/client';
      s.async = true;
      s.defer = true;
      s.onload = () => {
        this.scriptLoaded.set(true);
        resolve();
      };
      s.onerror = (e) => reject(e);
      document.head.appendChild(s);
    });
  }

  private initGsi(): void {
    if (!this.scriptLoaded()) return;

    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: (response: any) => this.onCredential(response),
      ux_mode: 'popup',
      auto_select: false
    });

    google.accounts.id.renderButton(this.googleBtn()?.nativeElement, {
      type: 'standard',
      theme: 'outline',
      size: 'large',
      text: 'signin_with',
      logo_alignment: 'left',
      shape: 'rectangular',
    });
  }

  private onCredential(resp: { credential: string }): void {
    const idToken = resp?.credential;
    if (!idToken) return;

    console.log('ID Token:', idToken);
    const decodedToken = jwtDecode<GoogleJwtPayload>(idToken);
    console.log('Decoded token:', decodedToken);

    // Actualizar el signal, esto dispara el resource
    this.idToken.set(idToken);
  }
}
