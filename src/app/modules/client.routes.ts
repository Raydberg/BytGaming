import { Routes } from "@angular/router";
import { ClientLayoutComponent } from "../shared/layouts/client-layout/client-layout.component";

export default [
  {
    path: "", component: ClientLayoutComponent, children: [
      { path: "", loadComponent: () => import("./landing/landing") },
      { path: "product", loadChildren: () => import("./products/product.routes") },
      { path: "cart", loadComponent: () => import("./cart/cart.component") },
    ]
  }
] as Routes;
