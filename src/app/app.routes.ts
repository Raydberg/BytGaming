import { Routes } from '@angular/router';
import { AppLayout } from './shared/layouts/layout-admin/app.layout';
import { Notfound } from './shared/components/notfound/notfound';

export const routes: Routes = [
  { path: '', loadChildren: () => import("./modules/client.routes") },
  { path: 'auth', loadChildren: () => import("./modules/auth/auth.routes") },
  {
    path: 'admin',
    component: AppLayout,
    children: [
      { path: '', loadChildren: () => import('../app/modules/admin/admin.routes') },
    ]
  },
  { path: 'notfound', component: Notfound },
  { path: '**', redirectTo: '/notfound' }
];
