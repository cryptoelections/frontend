import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-filter',
  templateUrl: 'filter.component.html'
})
export class FilterComponent {
  @Input() public query: string;
  @Input() public sortBy: number;
  @Output() public sortByChange = new EventEmitter<number>();
  @Output() public queryChange = new EventEmitter<string>();
  @Output() public queueChange = new EventEmitter<boolean>();

  public header: string;
  public sortOptions: Array<{ option: number | string, name: string, icon: string }>;

  public onSortByChange() {
    this.sortByChange.emit(this.sortBy);
  }

  public onQueryChange(query: string) {
    this.queryChange.emit(query);
  }
}
