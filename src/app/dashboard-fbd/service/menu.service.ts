import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MenuItem {
  id_menu: string;
  nombre: string;
  ruta: string;
}

export interface GetMenuResponse {
  data?: {
    getMenu?: MenuItem[];
  };
}
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private apiUrl = `${environment.baseUrl}/graphql`;
  private http = inject(HttpClient);

  getMenu(): Observable<GetMenuResponse> {
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
      'Content-Type': 'application/json',
    });

    return this.http.post<GetMenuResponse>(
      this.apiUrl,
      { query },
      { headers, withCredentials: true },
    );
  }
}
