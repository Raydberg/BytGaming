import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';

export default [
  { path: "", component: Dashboard },
  { path: '**', redirectTo: '/notfound' }
] as Routes;
