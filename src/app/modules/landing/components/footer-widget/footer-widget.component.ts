import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'footer-widget',
  imports: [RouterModule],
  templateUrl: './footer-widget.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterWidgetComponent {
  router = inject(Router)
}
