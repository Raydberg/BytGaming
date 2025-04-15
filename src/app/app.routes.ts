import { Routes } from '@angular/router';
import { AppLayout } from './shared/layouts/layout-admin/app.layout';
import { Landing } from './modules/landing/landing';

export const routes: Routes = [
  {
    path: 'admin',
    component: AppLayout,
    children: [
      // { path: '', component: Dashboard },
      // { path: 'uikit', loadChildren: () => import('./app/pages/uikit/uikit.routes') },
      // { path: 'documentation', component: Documentation },
      { path: 'pages', loadChildren: () => import('../app/modules/pages.routes') }
    ]
  },
  { path: '', component: Landing },
  // { path: 'notfound', component: Notfound },
  { path: 'auth', loadChildren: () => import('../app/modules/auth/auth.routes') },
  { path: '**', redirectTo: '/notfound' }
];
