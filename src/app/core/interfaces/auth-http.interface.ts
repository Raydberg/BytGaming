export interface RegisterRequest {
  email?: string;
  password?: string;
  name?: string;
  lastName?: string;
  role?: "ADMIN" | "USER"
}

export interface AuthResponse {
  message: string;
  status: boolean;
  jwt: string;
  email: string;
}
