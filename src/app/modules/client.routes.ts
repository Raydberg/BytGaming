import { Routes } from "@angular/router";
import { ClientLayoutComponent } from "../shared/layouts/client-layout/client-layout.component";

export default [
  {
    path: "", component: ClientLayoutComponent, children: [
      
      { path: "", loadComponent: () => import("./landing/landing") }
    ]
  }
] as Routes;
