export interface ReguisterRequest{
  email:string;
  password:string;
  name:string;
  lastName:string;
}
export interface AuthResponse {
  message: string;
  status:  boolean;
  jwt:     string;
  email:   string;
}
