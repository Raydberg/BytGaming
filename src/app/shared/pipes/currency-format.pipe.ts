import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyFormat',
})
export class CurrencyFormatPipe implements PipeTransform {

  transform(value: number | null): string {
    if (value === null || value === undefined) return 'S/ 0.00'
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      currencyDisplay: 'symbol',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value)
  }

}
