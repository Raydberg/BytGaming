import { Routes } from '@angular/router';
import { ListUsersComponent } from './list-users/list-users.component';
import { RegisterUserComponent } from './register-user/register-user.component';


export default [
  { path: '', pathMatch: "full", component: ListUsersComponent },
  { path: 'register', component: RegisterUserComponent }
] as Routes;
