import {Routes} from '@angular/router';
import {AppLayout} from './shared/layouts/layout-admin/app.layout';
import {Notfound} from './shared/components/notfound/notfound';
import {adminGuard} from './core/guards/admin.guard';

export const routes: Routes = [
  {path: '', loadChildren: () => import("./modules/client.routes")},
  {path: 'auth', loadChildren: () => import("./modules/auth/auth.routes")},
  {
    path: 'admin',
    component: AppLayout,
    children: [
      {path: '', loadChildren: () => import('../app/modules/admin/admin.routes')},
    ],
    canActivate: [adminGuard]
  },
  {path: 'notfound', component: Notfound},
  {path: '**', redirectTo: '/notfound'}
];
