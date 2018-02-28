import {Component, Input, OnInit} from '@angular/core';
import {Country} from '../../shared/models/country.model';
import {City} from '../../shared/models/city.model';
// import * as datamap from 'datamaps/dist/datamaps.world'
// tslint:disable-next-line
const Datamap = require('datamaps/dist/datamaps.world');

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  @Input() public countries: Array<Country>;
  @Input() public countriesDynamic: { [country: string]: Country };
  @Input() public cities: Array<City>;
  @Input() public myCitiesByCountry: { [countryId: number]: City };
  public map;

  public ngOnInit() {
    this.map = new Datamap({
        element: document.getElementById('container'),
        fills: {
          'enabled': '#CC4731',
          defaultFill: '#cccccc'
        },
        geographyConfig: {
          highlightBorderColor: '#d91070',
          popupTemplate: (geography, data) => `<div class="hoverinfo">
                                                   <app-parameters-pair [name]="'COUNTRY.CARD.PRESIDENT' | translate"
                                                                        [value]="data.president">
                                                   </app-parameters-pair>
                                               </div>`,
          highlightBorderWidth: 3
        },
        data: {
          'RUS': {
            'president': 'PUTIN',
            'price': '0.5ETH',
            'fillKey': 'enabled',
          },
          'KAZ': {
            'president': 'Nazarbaev',
            'price': '0.1ETH',
            'fillKey': 'enabled',
          }
        }
      }
    );
  }
}
