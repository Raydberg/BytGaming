import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from '../layouts/layout-admin/app.menuitem';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, AppMenuitem, RouterModule],
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
          { label: 'Home', icon: 'pi pi-fw pi-home', routerLink: ['/'] },
          { label: 'Table', icon: 'pi pi-fw pi-table', routerLink: ['/uikit/table'] },
          { label: 'List', icon: 'pi pi-fw pi-list', routerLink: ['/uikit/list'] },
          { label: 'Tree', icon: 'pi pi-fw pi-share-alt', routerLink: ['/uikit/tree'] },
          { label: 'Overlay', icon: 'pi pi-fw pi-clone', routerLink: ['/uikit/overlay'] },
          { label: 'Media', icon: 'pi pi-fw pi-image', routerLink: ['/uikit/media'] },
          { label: 'Menu', icon: 'pi pi-fw pi-bars', routerLink: ['/uikit/menu'] },
          { label: 'Message', icon: 'pi pi-fw pi-comment', routerLink: ['/uikit/message'] },
          { label: 'File', icon: 'pi pi-fw pi-file', routerLink: ['/uikit/file'] },
          { label: 'Chart', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/uikit/charts'] },
          { label: 'Misc', icon: 'pi pi-fw pi-circle', routerLink: ['/uikit/misc'] },
          { label: 'Crud', icon: 'pi pi-fw pi-pencil', routerLink: ['/pages/crud'] },
          { label: 'Pages', icon: 'pi pi-fw pi-briefcase', routerLink: ['/pages'], },
        ]
      }
    ])
  }
}

