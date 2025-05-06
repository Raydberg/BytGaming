import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AccessComponent } from './access.component';
import { ErrorComponent } from './error.component';
import { ClientLayoutComponent } from '../../shared/layouts/client-layout/client-layout.component';
import { RegisterComponent } from './register/register.component';

export default [
  {
    path: '', component: ClientLayoutComponent, children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'access', component: AccessComponent },
      { path: 'error', component: ErrorComponent },
    ]
  },
] as Routes;
