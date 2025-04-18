import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AccessComponent } from './access.component';
import { ErrorComponent } from './error.component';

export default [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'access', component: AccessComponent },
  { path: 'error', component: ErrorComponent },
] as Routes;
