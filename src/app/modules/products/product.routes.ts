import { Routes } from '@angular/router';

export default [
  { path: "", loadComponent: () => import("./products.component") },
  { path: ":id", loadComponent: () => import("./product-detail/product-detail.component") }
] as Routes;
