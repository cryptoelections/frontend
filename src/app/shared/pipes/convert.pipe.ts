import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  // tslint:disable-next-line
  name: 'convert'
})
export class ConvertPipe implements PipeTransform {
  constructor(private translate: TranslateService) {
  }

  public transform(count: string): string {
    const mln = 1000000;
    const th = 1000;
    let result: string;
    if (+count >= mln) {
      result = `${(
        +count / mln
      ).toFixed(2)}${this.translate.instant('COMMON.MLN')}`
    } else if (+count > th && +count < mln) {
      result = `${(
        +count / th
      ).toFixed(2)}${this.translate.instant('COMMON.THOUSANDS')}`
    } else {
      result = count.toString();
    }

    return result;
  }
}
