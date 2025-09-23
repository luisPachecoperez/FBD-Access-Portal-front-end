

import { inject, Injectable, signal } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
@Injectable({
    providedIn: 'root'
})
export class MenuService {

  private apiUrl = `${environment.baseUrl}/graphql`;
  private http = inject(HttpClient);

  getMenu(): Observable<any> {
    const query = `
      query GetMenu {
        getMenu {
          id_menu
          nombre
          ruta
        }
      }
    `;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(
      this.apiUrl,
      { query },
      { headers, withCredentials: true } // importante para que viaje la cookie
    );
  }
}
