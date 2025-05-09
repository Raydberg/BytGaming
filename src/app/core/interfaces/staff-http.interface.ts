export type StaffPost = 'ADMINISTRADOR' | 'ALMACENERO' | 'SUPERVISOR';

export interface StaffRequest {
  id?:number;
  name?: string;
  email?: string;
  post?: StaffPost;
}
