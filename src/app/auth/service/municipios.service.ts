import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { map, tap, catchError, switchMap } from 'rxjs/operators';
import { DatabaseService, Municipio } from './database.service';
import { GraphQLService } from './graphql.service';

interface GetMunicipiosResponse {
  getMunicipios: Municipio[];
}

@Injectable({
  providedIn: 'root'
})
export class MunicipiosService {
  private readonly GET_MUNICIPIOS_QUERY = `
    query  {
      getMunicipios {
        id
        nombre
        codigo_dane
      }
    }
  `;

  constructor(
    private graphql: GraphQLService,
    private db: DatabaseService
  ) {}

  obtenerMunicipios(): Observable<Municipio[]> {
    // Intentar obtener de GraphQL primero
    return this.graphql.query<GetMunicipiosResponse>(this.GET_MUNICIPIOS_QUERY).pipe(
      tap(async (response) => {
        if (response?.getMunicipios) {
          console.log("Obtuvo municipios del servicio: ")
          // Guardar en IndexedDB
          await this.db.guardarMunicipios(response.getMunicipios);
        }
      }),
      map(response => response?.getMunicipios || []),
      catchError((error) => {
        console.log('Error al obtener municipios de GraphQL:', error);
        console.log('Cargando municipios desde IndexedDB...');
        // Si falla, obtener de IndexedDB
        return from(this.db.obtenerMunicipios());
      })
    );
  }

  // Método que devuelve de indexDb
  obtenerMunicipiosIndexDB(): Observable<Municipio[]> {
    return from(this.db.obtenerMunicipios()).pipe(
      catchError(err => {
        console.error('Error al obtener municipios de cache:', err);
        return of([] as Municipio[]);
      })
    );
  }
}
