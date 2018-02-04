import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  // tslint:disable-next-line
  name: 'highlight'
})
export class HighLightPipe implements PipeTransform {
  public transform(text: string, search: string): string {
    if (!search) {
      return text;
    }

    const pattern = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(pattern, 'gi');

    return text.replace(regex, '<span class="highlight">$&</span>');
  }
}
