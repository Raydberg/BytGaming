import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';
@Component({
  selector: 'client-product',
  imports: [CarouselModule,ButtonModule],
  templateUrl: './client-product.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientProductComponent { }
