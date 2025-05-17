import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeRangeFormat'
})
export class TimeRangeFormatPipe implements PipeTransform {

  transform(time: number): string {
    return `${time.toString().padStart(2, '0')}:00`;
  }

}
