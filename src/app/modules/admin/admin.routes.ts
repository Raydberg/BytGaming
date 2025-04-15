import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { TableDemo } from './products/tabledemo';
import { Crud } from './categories/crud';

export default [
  { path: "", component: Dashboard },
  { path: "products", component: TableDemo },
  { path: "categories", component: Crud },
  { path: '**', redirectTo: '/notfound' }
] as Routes;
