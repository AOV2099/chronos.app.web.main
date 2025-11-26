import { LayoutDashboard, CalendarSearch, GraduationCap, BookA, ClipboardPlus, BookOpen, Bolt, FileSearch, LogOut } from "lucide-svelte";
import { writable } from "svelte/store";



//export const API_BASE_URL = "http://localhost:3000/api";
export const API_BASE_URL = "http://ec2-18-118-165-200.us-east-2.compute.amazonaws.com:3000/api";

export const HORARIO_URL = `${API_BASE_URL}/cargar-horario`;
export const ASIGNATURAS_URL = `${API_BASE_URL}/cargar-asignaturas`;
export const PROFESORES_URL = `${API_BASE_URL}/cargar-profesores`;
export const PROPUESTA_INDIVIDUAL_URL = `${API_BASE_URL}/propuesta`;
export const PROPUESTAS_GLOBAL_URL = `${API_BASE_URL}/propuestas-from-csv`;
export const CSV_TEMPLATE_URL = `${API_BASE_URL}/example-csv`;

export const SIDEBAR_ITEMS = {
  GENERAL:        { label: "General",        icon: LayoutDashboard },
  HORARIOS:       { label: "Banco de Hrs",   icon: CalendarSearch },
  ACADEMICOS:     { label: "Académicos",     icon: GraduationCap },
  ASIGNATURAS:    { label: "Asignaturas",    icon: BookA },
  REPORTES:       { label: "Reportes",       icon: ClipboardPlus },
  FORMATOS:       { label: "Formatos",       icon: BookOpen },
  CONFIGURACION:  { label: "Configuración",  icon: Bolt },
  DOCUMENTACION:  { label: "Documentación",  icon: FileSearch },
  CERRAR_SESION:  { label: "Cerrar sesión",  icon: LogOut }
};


export const selectedSidebarItem = writable( SIDEBAR_ITEMS.ACADEMICOS );
