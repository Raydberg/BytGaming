export interface StaffRequest{
  name:string;
  email:string;
  post:ADMINISTRADOR | ALMACENERO |  SUPERVISOR ;
}
