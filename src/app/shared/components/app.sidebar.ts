import { Component, ElementRef } from '@angular/core';
import { AppMenu } from './app.menu';

@Component({
  selector: 'app-sidebar',
  imports: [AppMenu],
  template: `
    <div class="layout-sidebar">
        <app-menu/>
    </div>
    `
})
export class SidebarComponent {
  constructor(public el: ElementRef) { }
}
