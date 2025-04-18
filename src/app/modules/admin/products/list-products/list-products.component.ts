
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'list-products',
  imports: [],
  templateUrl: './list-products.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListProductsComponent { }
