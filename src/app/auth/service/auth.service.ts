// src/app/services/auth.service.ts
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Usuario } from '../interfaces/Usuario';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../../environments/environment';
import { CookieService } from './cookie.service';

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

// para revoke/cancel opcional
declare const google: any;

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Señal para el usuario (tu template usa user(); perfecto)
  private userSignal = signal<Usuario | null>(null);
  public user = this.userSignal.asReadonly();
  private http = inject(HttpClient);
  private router = inject(Router);
  private cookieService = inject(CookieService);
  // Use the baseUrl from environment configuration
  private apiUrl = `${environment.baseUrl}/graphql`;
  private secret = environment.COOKIE_SECRET;
  private userCookieName = environment.USER_COOKIE_NAME;



  /** Estado simple de UI (no consulta cookie httpOnly) */
  public isAuthenticated(): boolean {
      let auth:boolean=false;
      const encrypted :string | null = this.cookieService.getCookie(this.userCookieName);
      if (!encrypted) {
        console.warn('❌ No existe cookie de sesión');
        return auth;
      }

      try {
        // 🔓 Descifrar cookie
        const bytes = CryptoJS.AES.decrypt(encrypted, this.secret);
        const decoded = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        console.log('✅ Usuario autenticado:', decoded);

        if (!decoded) {
          console.warn('❌ Cookie vacía o corrupta');
          return auth ;
        }

        // ⏳ Verificar expiración
        const now = Math.floor(Date.now() / 1000);
        if (decoded.exp && decoded.exp < now) {
          console.warn('❌ Token expirado');
          return auth;
        }

        auth=true;
        return auth;
      } catch (err) {
        console.error('❌ Error al validar cookie:', err);
        return auth;
      }
    }


    public getUserUuid(): String {
      let user_uuid:String="";
      const encrypted :string | null = this.cookieService.getCookie(this.userCookieName);
      if (!encrypted) {
        console.warn('❌ No existe cookie de sesión');
        return user_uuid;
      }

      try {
        // 🔓 Descifrar cookie
        const bytes = CryptoJS.AES.decrypt(encrypted, this.secret);
        const decoded = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        user_uuid=decoded.user_uuid;
        console.log('✅ Usuario autenticado:',user_uuid);
        if (!decoded) {
          console.warn('❌ Cookie vacía o corrupta');
          return user_uuid ;
        }
      return user_uuid;
      } catch (err) {
        console.error('❌ Error al validar cookie:', err);
        return user_uuid;
      }
    }
    /**
     *
     */

  /** Limpia estado local */
  clear() {
    this.userSignal.set(null);
  }

  /**
   * Cierra la sesión del usuario, eliminando todas las cookies y redirigiendo al login
   */
  public logout(): void {
    // Eliminar la cookie de usuario
    this.cookieService.deleteCookie(this.userCookieName);
    this.cookieService.deleteCookie('session_auth');
    // Limpiar cualquier otro dato de sesión que puedas tener
    this.userSignal.set(null);

    // Redirigir al login
    this.router.navigate(['/auth/login']);
  }

  /**
   * 1) Envía el ID token de Google al backend (mutación googleLogin)
   * 2) El backend valida y (recomendado) emite cookie httpOnly de sesión
   * 3) Opcionalmente recibes datos del usuario y los guardas para la UI
   */
  googleLogin(idToken: string) {

    const mutation = `
      mutation LoginWithGoogle($token: String!) {
        googleLogin(tokenGoogle: $token) {
          success
          message
          persona {
            id_persona
            email
            nombre
            photoUrl
            roles
            apps {
              id_app
              app_name
              url
            }
          }
        }
      }
    `;

    // Si tu backend **requiere** Authorization: Bearer para esta mutación inicial:
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    });

    return this.http.post<any>(
      this.apiUrl,
      { query: mutation, variables: { token: idToken } },
      { headers, withCredentials: true } // <- importante para que viaje la cookie httpOnly
    )
    .pipe(
      tap(res => {
        const payload = res?.data?.googleLogin;
        if (payload?.success) {
          const u = payload.persona as Usuario | undefined;
          if (u) this.userSignal.set(u);
        } else {
          // Si falla, limpia el estado local
          this.clear();
        }
      })
    );
  }
/*
  logout(email?: string) {
    this.clear();
    //borrar cookie
    this.cookieService.deleteCookie( environment.USER_COOKIE_NAME);

    // (Opcional) mutación al backend para cerrar sesión server-side
    const mutation = `mutation { logout { success message } }`;
    this.http.post<any>(
      this.apiUrl,
      { query: mutation },
      { withCredentials: true }
    ).subscribe({
      next: () => {},
      error: () => {}
    });

    // (Opcional) Revocar consentimiento en Google
    try {
      if (email && typeof google !== 'undefined') {
        google.accounts.id.revoke(email, () => {});
      } else {
        // cancelar prompts/one-tap si hubiese
        google?.accounts?.id?.cancel?.();
      }
    } catch {}

    this.router.navigate(['/login']);
  }
*/
}
