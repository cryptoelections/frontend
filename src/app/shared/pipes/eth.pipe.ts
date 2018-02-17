import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  // tslint:disable-next-line
  name: 'eth'
})
export class EthPipe implements PipeTransform {
  constructor(private translate: TranslateService) {
  }

  public transform(count: string): string {
   const result = (+count / 1000000000000000000).toFixed(2);

    return result;
  }
}
