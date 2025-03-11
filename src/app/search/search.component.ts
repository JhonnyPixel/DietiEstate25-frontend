import { Component, OnInit} from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { NgxSliderModule, Options} from '@angular-slider/ngx-slider';
import { AddressSearchComponent } from '../address-search/address-search.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHouse,faMoneyBill,faCube,faSliders } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { FormsModule} from '@angular/forms';



@Component({
  selector: 'app-search',
  imports: [NavbarComponent,NgxSliderModule,AddressSearchComponent,FontAwesomeModule,FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {

  constructor(private router:Router) {}


  filters: any = {
    listingType: 'BUY',
    category: 'houses',
    priceMin: null,
    priceMax: null,
    surfaceMin: null,
    surfaceMax: null,
    region: null,
    city: null,
    nRoomsMin: null,
    nRoomsMax: null,
    nBathroomsMin: null,
    nBathroomsMax: null,
    floorMin: null,
    floorMax: null,
    energyClassMin: null,
    building: false,
    centerLatitude: null,
    centerLongitude: null,
    radius: null
  };

   priceValue: number = 80;
   priceHighValue:number =90; 
   priceOptions: Options = {
    floor: 0,
    ceil: 200,
    translate: (value: number): string => {
      return value === 0 ? '€0' : value === 200 ? '€2M+' : '€' + value + 'k';
    }
  };

  surfaceValue: number = 80;
   surfaceHighValue:number =90; 
   surfaceOptions: Options = {
    floor: 0,
    ceil: 2000,
    translate: (value: number): string => {
      return value === 0 ? '0m²' : value === 2000 ? '2000m²+' : value + 'm²';
    }
  };

  faHouse=faHouse
  faMoneyBill=faMoneyBill
  faCube=faCube
  faSliders=faSliders

   // Method to update price filters from slider
   onPriceChange(event: any): void {
    this.filters.priceMin = this.priceValue === 0 ? null : this.priceValue * 1000;
    this.filters.priceMax = this.priceHighValue === 200 ? null : this.priceHighValue * 1000;
  }

  // Method to update surface filters from slider
  onSurfaceChange(event: any): void {
    this.filters.surfaceMin = this.surfaceValue === 0 ? null : this.surfaceValue;
    this.filters.surfaceMax = this.surfaceHighValue === 2000 ? null : this.surfaceHighValue;
  }

  

  recentSearchSelected(recent:any){
    this.filters=recent;

    //this.filters.category=recent.

    // Update slider values when a recent search is selected
    /* this.priceValue = this.filters.priceMin ? this.filters.priceMin / 1000 : 0;
    this.priceHighValue = this.filters.priceMax ? this.filters.priceMax / 1000 : 200;
    this.surfaceValue = this.filters.surfaceMin || 0;
    this.surfaceHighValue = this.filters.surfaceMax || 2000; */
  }

  addressSelected(place:any){
    console.log("indirizzo selezionato mi è arrivato",place);
    this.filters.centerLatitude=parseFloat(place.lat);
    this.filters.centerLongitude=parseFloat(place.lon);
    this.filters.radius=place.radius;
    
  }

  search() {

    // Update the filters with the current slider values before searching
    this.onPriceChange(null);
    this.onSurfaceChange(null);

    this.router.navigate(['/results'], { state: { filters: this.filters } });
  }
}
