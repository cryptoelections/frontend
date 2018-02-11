import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-filter',
  templateUrl: 'filter.component.html'
})
export class FilterComponent implements OnInit {
  @Input() public query: string;
  @Input() public sortBy: number;
  @Output() public sortByChange = new EventEmitter<number>();
  @Output() public queryChange = new EventEmitter<string>();
  @Output() public queueChange = new EventEmitter<boolean>();

  public header: string;
  public sortOptions: Array<{ option: number | string, name: string }>;

  constructor(private activatedRoute: ActivatedRoute) {
  }

  public ngOnInit() {
  }

  public onSortByChange() {
    this.sortByChange.emit(this.sortBy);
  }

  public onQueryChange(query: string) {
    this.queryChange.emit(query);
  }
}
