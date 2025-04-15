import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';

@Component({
  selector: 'top-bar-widget',
  imports: [RouterModule, StyleClassModule, ButtonModule, RippleModule],
  templateUrl: './top-bar-widget.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopBarWidgetComponent {
  router = inject(Router)

}
