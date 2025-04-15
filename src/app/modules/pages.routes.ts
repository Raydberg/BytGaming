import { Routes } from '@angular/router';


export default [
    // { path: 'documentation', component: Documentation },
    // { path: 'crud', component: Crud },
    // { path: 'empty', component: Empty },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
