export interface Usuario {
  id_persona: string;
  email: string;
  nombre: string;
  photoUrl?: string | null;
  roles?: string[];
  apps?: { id_app: string; app_name: string; url: string }[];
  menu?: { id_menu: string; nombre: string; ruta: string }[];
}
