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

export interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  token: string | null;
  roles: string[];
}
export interface JwtPayload {
  sub:         string;
  nbf:         number;
  iss:         string;
  exp:         number;
  iat:         number;
  authorities: string;
  jti:         string;
}
