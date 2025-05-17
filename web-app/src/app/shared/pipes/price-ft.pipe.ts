import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'priceFt'
})
export class PriceFtPipe implements PipeTransform {
  transform(value: number): string {
    if (typeof value !== 'number') return '';
    return `${value.toLocaleString('hu-HU', { minimumFractionDigits: 0 })} Ft`;
  }
}
