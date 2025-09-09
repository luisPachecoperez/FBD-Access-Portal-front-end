import { CookieService } from '../../service/cookie.service';
import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder,ReactiveFormsModule,Validators} from '@angular/forms';
//import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from '../../service/auth.service';
import { environment } from '../../../../environments/environment.development';


declare const google: any; // 👈 Tipificado simple para GSI

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
export class LoginPageComponent {
  @ViewChild('googleBtn', { static: true }) googleBtn!: ElementRef;
  scriptLoaded = signal(false);
  cookieService = inject(CookieService);
  authService = inject(AuthService);
  router = inject(Router);

  async ngOnInit():Promise<void> {
    await this.ensureGsiLoaded();
    this.initGsi();
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
      s.onload = () => { this.scriptLoaded.set(true); resolve(); };
      s.onerror = (e) => reject(e);
      document.head.appendChild(s);
    });
  }

  private initGsi(): void {
    if (!this.scriptLoaded) return;

    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: (response: any) => this.onCredential(response),
      ux_mode: 'popup',            // evita recarga
      auto_select: false,          // no elige cuenta automáticamente
      itp_support: true
    });

    // Renderiza el botón en el contenedor
    google.accounts.id.renderButton(this.googleBtn.nativeElement, {
      type: 'standard',
      theme: 'outline',
      size: 'large',
      text: 'signin_with',
      logo_alignment: 'left',
      shape: 'rectangular'
    });

    // (Opcional) Mostrar One Tap:
    // google.accounts.id.prompt();
  }

  private onCredential(resp: { credential: string }): void {
    const idToken = resp?.credential; // <-- Este es el JWT de
    console.log("ID Token:",idToken);
    console.log("Login exitoso:",resp);
    const decodedToken = jwtDecode<GoogleJwtPayload>(idToken);
    console.log("Decoded token:",decodedToken);

    if (!idToken) return;

    this.cookieService.deleteCookie( environment.USER_COOKIE_NAME);
    console.log("Cookie borrada");
    this.authService.googleLogin(idToken).subscribe({
      next: (res: any) => {
        console.log("Respuesta del back:",res);
        if (res?.data?.googleLogin?.success) {
          this.router.navigate(['/dashboard']);
        } else {
          console.error('Login falló:', res);
        }
      },
      error: (err) => console.error('Error en login:', err)
    });

  }
}
