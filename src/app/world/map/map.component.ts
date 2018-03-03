import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Country} from '../../shared/models/country.model';
import {City} from '../../shared/models/city.model';
import {StorageKeys} from '../../shared/services/storage.service';
import {Observer} from 'rxjs/Observer';
import {Observable} from 'rxjs/Observable';

const Datamap = require('datamaps/dist/datamaps.world');

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnChanges {
  @Input() public countries;
  @Input() public countriesForMap;
  @Input() public countriesDynamic: { [country: string]: Country };
  @Input() public myCitiesByCountry: { [countryId: number]: City };
  @Output() public selectCountry = new EventEmitter();
  public map;
  private previousSelectedCountry;

  public get selectedCountry() {
    const country = sessionStorage.getItem(StorageKeys.SelectedCountry);
    if (country !== this.previousSelectedCountry) {
      this.previousSelectedCountry = country;
      this.selectCountry.emit(country);
    }
    return this.previousSelectedCountry;
  }

  public ngOnInit() {
    this.map = new Datamap({
      element: document.getElementById('container'),
      fills: {
        ENABLED: '#1d70b7',
        defaultFill: '#cccccc'
      },
      done: function (datamap) {
        datamap.svg.selectAll('.datamaps-subunit').on('click', function (geography) {
          sessionStorage.setItem(StorageKeys.SelectedCountry, geography.id);
        });
      },
      geographyConfig: {
        highlightFillColor: '#e61b72',
        borderWidth: 2,
        highlightBorderWidth: 2,
        highlightBorderColor: '#ffffff',
        popupTemplate: function (geo, data) {
          return `<div class="hoverinfo" (click)="showCountry(data.id)">
                    President: ${ data.president }
                   </div>`;
        },
      },
    });
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.countriesForMap && this.map) {
      this.map.updateChoropleth(this.countriesForMap);
    }
  }
}
