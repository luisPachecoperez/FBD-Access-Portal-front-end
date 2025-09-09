 import { Injectable } from '@angular/core';
 import Dexie, { Table } from 'dexie';

 export interface Municipio {
   id: string;
   nombre: string;
   codigo_dane: string;
 }

 export interface Usuario {
   id: string;
   email: string;
   nombre: string;
   photoUrl: string;
   token: string;
 }

 @Injectable({
   providedIn: 'root'
 })
 export class DatabaseService extends Dexie {
   municipios!: Table<Municipio, string>;
   usuario!: Table<Usuario, string>;

   constructor() {
    super('CultivarteIndexDB');
    console.log("Crea base de datos si no existe");
     this.version(1).stores({
       municipios: 'id, nombre, codigo_dane',
       usuario: 'id, email'
     });
   }

   async  guardarMunicipios(municipios: Municipio[]) {
    console.log("guardarMunicipios en database.service");
    console.log(municipios);
     await this.municipios.clear();
     await this.municipios.bulkAdd(municipios);
   }

  

   async obtenerMunicipios(): Promise<Municipio[]> {
     console.log("Municipios en indexDb:");
     console.log(this.municipios.toArray);
     return await this.municipios.toArray();
   }

   async guardarUsuario(usuario: Usuario) {
     await this.usuario.clear();
     console.log('Guardando usuario:', usuario);
     await this.usuario.add(usuario);
   }

   async obtenerUsuario(): Promise<Usuario | undefined> {
     const usuarios = await this.usuario.toArray();
     return usuarios[0];
   }

   async limpiarUsuario() {
     await this.usuario.clear();
   }
 }
