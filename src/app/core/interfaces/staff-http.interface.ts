export type StaffPost = 'ADMINISTRADOR' | 'ALMACENERO' | 'SUPERVISOR';

export interface StaffRequest {
  name: string;
  email: string;
  post: StaffPost;
}
