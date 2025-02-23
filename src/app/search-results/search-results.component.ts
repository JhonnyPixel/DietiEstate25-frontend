import { Component } from '@angular/core';
import { LeafletMapComponent } from '../leaflet-map/leaflet-map.component';
@Component({
  selector: 'app-search-results',
  imports: [LeafletMapComponent],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.scss'
})
export class SearchResultsComponent {

}
