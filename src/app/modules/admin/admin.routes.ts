import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';

export default [
  { path: "", component: Dashboard },
  { path: "products", loadChildren: () => import("./products/product.routes") },
  { path: "categories", loadChildren: () => import("./categories/category.routes") },
  { path: "kardex", loadChildren: () => import("./kardex/kardex.routes") },
  { path: "staff", loadChildren: () => import("./staff/staff.routes") },
  { path: "supplier", loadChildren: () => import("./supplier/supplier.routes") },
  { path: "users", loadChildren: () => import("./users/user.routes") },
  { path: '**', redirectTo: '/notfound' }
] as Routes;
