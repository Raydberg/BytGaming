import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'features-widget',
  imports: [CommonModule],
  templateUrl: './features-widget.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeaturesWidgetComponent { }
