import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Router, RouterModule} from '@angular/router';
import {ButtonModule} from 'primeng/button';
import {CheckboxModule} from 'primeng/checkbox';
import {InputTextModule} from 'primeng/inputtext';
import {PasswordModule} from 'primeng/password';
import {RippleModule} from 'primeng/ripple';
import {MessageService} from 'primeng/api';
import {ToastModule} from 'primeng/toast';
import {AuthService} from '../../../core/services/auth.service';
import {finalize} from 'rxjs';
import {RegisterRequest} from '../../../core/interfaces/auth-http.interface';

@Component({
  selector: 'app-register',
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
  templateUrl: './register.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  name: string = '';
  lastName: string = '';
  email: string = '';
  password: string = '';
  checked: boolean = false;
  loading: boolean = false;

  private authService = inject(AuthService);
  private messageService = inject(MessageService);
  private router = inject(Router);

  register(): void {
    if (!this.email || !this.password || !this.name || !this.lastName) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Por favor completa todos los campos requeridos'
      });
      return;
    }

    if (!this.checked) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Aviso',
        detail: 'Debes aceptar los términos y condiciones'
      });
      return;
    }

    this.loading = true;

    const userData: RegisterRequest = {
      email: this.email,
      password: this.password,
      name: this.name,
      lastName: this.lastName,
      role: "USER" // Note the quotes, making it a literal type
    };

    this.authService.register(userData)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Registro exitoso! Ahora puedes iniciar sesión'
            });
            setTimeout(() => {
              this.router.navigate(['/auth/login']);
            }, 2000);
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: response.message || 'Error en el registro'
            });
          }
        },
        error: (error) => {
          console.error('Registration error:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Ocurrió un problema durante el registro'
          });
        }
      });
  }
}
