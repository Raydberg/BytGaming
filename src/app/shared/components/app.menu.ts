import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MenuItemComponent } from './menu-item/menu-item.component';

@Component({
  selector: 'app-menu',
  imports: [CommonModule, MenuItemComponent, RouterModule],
  template: `
    <ul class="layout-menu">
    @for (item of model(); track $index; let i = $index) {
      @if (!item.separator) {
        <li app-menuitem [item]="item" [index]="i" [root]="true"></li>
      } @else {
        <li class="menu-separator"></li>
      }
    }
  </ul>
    `
})
export class AppMenu {
  model = signal<MenuItem[]>([]);

  ngOnInit() {
    this.model.set([
      {
        items: [
          // { label: 'Dashboard', icon: 'pi pi-home', routerLink: ['/admin'] },
          { label: 'Personal', icon: 'pi pi-users', routerLink: ['/admin/staff'] },
          { label: 'Proveedores', icon: 'pi pi-truck', routerLink: ['/admin/supplier'] },
          { label: 'Categorias', icon: 'pi pi-tags', routerLink: ['/admin/categories'] },
          { label: 'Productos', icon: 'pi pi-box', routerLink: ['/admin/products'] },
          { label: 'Usuarios', icon: 'pi pi-user', routerLink: ['/admin/users'] },
          { label: 'Kardex', icon: 'pi pi-file-excel', routerLink: ['/admin/kardex'] },
          // { label: 'Message', icon: 'pi pi-comment', routerLink: ['/admin/message'] },
          // { label: 'File', icon: 'pi pi-file', routerLink: ['/admin/file'] },
          // { label: 'Chart', icon: 'pi pi-chart-bar', routerLink: ['/admin/charts'] },
          // { label: 'Misc', icon: 'pi pi-circle', routerLink: ['/admin/misc'] },
          // { label: 'Crud', icon: 'pi pi-pencil', routerLink: ['/admin/categories'] },
          // { label: 'Pages', icon: 'pi pi-briefcase', routerLink: ['/pages'], },
        ]
      }
    ])
  }
}

