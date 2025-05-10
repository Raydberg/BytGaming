import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../../core/services/auth.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ButtonModule,
    CheckboxModule,
    InputTextModule,
    PasswordModule,
    FormsModule,
    RouterModule,
    RippleModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: "./login.component.html"
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  checked: boolean = false;
  loading: boolean = false;

  private authService = inject(AuthService);
  private messageService = inject(MessageService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  login(): void {
    if (!this.email || !this.password) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Por favor ingresa tu email y contraseña'
      });
      return;
    }

    this.loading = true;
    this.authService.login(this.email, this.password)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (response) => {
          if (!response.status) {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Email o contraseña incorrectos'
            });
          } else {
            // Successful login is handled in the service (redirects based on role)
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Inicio de sesión exitoso'
            });
          }
        },
        error: (error) => {
          console.error('Login error:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Ocurrió un problema al iniciar sesión'
          });
        }
      });
  }
}
