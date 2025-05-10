import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { AuthState, JwtPayload, RegisterRequest } from '../interfaces/auth-http.interface';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { AuthModel } from '../model/auth.model';
import {catchError, map, Observable, of, tap} from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient)
  private baseUrl = environment.apiUrl
  private router = inject(Router)
  private readonly TOKEN_KEY = "auth_token"


  private authState = signal<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
    roles: []
  })


  public isAuthenticated = computed(() => this.authState().isAuthenticated)
  public currentUser = computed(() => this.authState().user)
  public roles = computed(() => this.authState().roles)
  public isAdmin = computed(() => this.authState().roles.includes("ROLE_ADMIN"))

  constructor() {
    this.loadAuthStateFromStorage();
    effect(() => {
      const token = this.authState().token;
      if (token) {
        localStorage.setItem(this.TOKEN_KEY, token)
      } else {
        localStorage.removeItem(this.TOKEN_KEY)
      }
    });
  }
  register(userData: RegisterRequest): Observable<any> {
  return this.http.post<any>(`${this.baseUrl}/auth/sign`, userData)
    .pipe(
      map(response => {
        return {
          success: true,
          ...response
        };
      }),
      catchError(error => {
        console.error('Registration error:', error);
        return of({
          success: false,
          message: error.error?.message || 'Error en el registro'
        });
      })
    );
}


  login(email: string, password: string): Observable<AuthModel> {
    return this.http.post<AuthModel>(`${this.baseUrl}/auth/login`, { email, password })
      .pipe(
        tap(response => {
          if (response.status && response.jwt) {
            const decodedToken = jwtDecode<JwtPayload>(response.jwt);
            const roles = decodedToken.authorities ? decodedToken.authorities.split(',') : [];

            this.authState.set({
              isAuthenticated: true,
              user: {
                email: response.email,
                sub: decodedToken.sub,
              },
              token: response.jwt,
              roles: roles
            });
            if (roles.includes('ROLE_ADMIN')) {
              this.router.navigate(['/admin']);
            } else {
              this.router.navigate(['/']);
            }
          }
        }),
        catchError(error => {
          console.error('Login error:', error);
          return of({ email: '', status: false, message: 'Login failed', jwt: '', success: false } as AuthModel);
        })
      );
  }
  logout(): void {
    this.authState.set({
      isAuthenticated: false,
      user: null,
      token: null,
      roles: []
    });
    this.router.navigate(['/auth/login'])
  }
  private loadAuthStateFromStorage(): void {
    const token = localStorage.getItem(this.TOKEN_KEY);

    if (token) {
      try {
        const decodedToken = jwtDecode<JwtPayload>(token);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp > currentTime) {
          const roles = decodedToken.authorities ? decodedToken.authorities.split(",") : [];
          this.authState.set({
            isAuthenticated: true,
            user: {
              email: decodedToken.sub,
              sub: decodedToken.sub
            },
            token: token,
            roles: roles
          });
        } else {
          localStorage.removeItem(this.TOKEN_KEY);
        }
      } catch (error) {
        console.error("Error al decodificar el token", error)
        localStorage.removeItem(this.TOKEN_KEY);
      }
    }
  }
  getToken(): string | null {
    return this.authState().token;
  }

  hasRole(role: string): boolean {
    return this.authState().roles.includes(role);
  }
  isLoggedIn(): boolean {
  return this.isAuthenticated();
}
}
