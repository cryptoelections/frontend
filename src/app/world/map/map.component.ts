import {AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Country} from '../../shared/models/country.model';
import {City} from '../../shared/models/city.model';
import {StorageKeys} from '../../shared/services/storage.service';

const Datamap = require('datamaps/dist/datamaps.world');

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnChanges, AfterViewInit {
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

  constructor(private cd: ChangeDetectorRef) {
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
          window['amplitude'].getInstance().logEvent('country_map_click', {country: geography.id});
          sessionStorage.setItem(StorageKeys.SelectedCountry, geography.id);
        });
      },
      geographyConfig: {
        highlightFillColor: '#e61b72',
        borderWidth: 2,
        highlightBorderWidth: 2,
        highlightBorderColor: '#ffffff',
        popupTemplate: function (geo, data) {
          return `<div class="hoverinfo">
                    <h4><b>${ data.name }</b></h4>
                    ${ data.numberOfCities } cities / ${ data.myCities } under your control <br/>
                    <b>President: </b> ${ data.president }
                   </div>`;
        },
      },
    });
  }

  public ngAfterViewInit() {
    this.cd.detectChanges();
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.countriesForMap && this.map) {
      this.map.updateChoropleth(this.countriesForMap);
    }
  }
}
