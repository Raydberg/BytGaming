import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'products',
  imports: [],
  templateUrl: './products.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProductsComponent { }
