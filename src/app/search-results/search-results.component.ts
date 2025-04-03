import { Component,ViewChild } from '@angular/core';
import { LeafletMapComponent } from '../leaflet-map/leaflet-map.component';
import {FormsModule } from '@angular/forms';
import { RestBackendService } from '../rest-backend.service';
import { FilterBarComponent } from '../filter-bar/filter-bar.component';
import { AddressSearchComponent } from '../address-search/address-search.component';
import { Router, RouterLink } from '@angular/router';

import { ResultItemComponent } from '../result-item/result-item.component';

@Component({
  selector: 'app-search-results',
  imports: [LeafletMapComponent,FormsModule,FilterBarComponent,AddressSearchComponent,RouterLink,ResultItemComponent],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.scss'
})
export class SearchResultsComponent {


  constructor(private restBackend:RestBackendService,private router:Router){}

  @ViewChild(LeafletMapComponent) leafletMap!: LeafletMapComponent;
  @ViewChild(FilterBarComponent) filterBar!: FilterBarComponent;

  listings:Array<any>=[];

  isSelecting:Boolean = false

  focusedListingId:string=''


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

  ngOnInit() {
    const state = window.history.state;
    const filters = state ? state.filters : null;
    
    console.log('sono in OnInit', state);
    if (filters) {
      console.log('Dati ricevuti:', filters);

      this.onFiltersApplied(filters);

    }
  }


  toggleSelection():void{
    this.leafletMap.toggleSelection();
    this.isSelecting= !this.isSelecting
  }

  onFiltersApplied(filters:any) {

    for(let key in filters){
      this.filters[key]=filters[key]
    }
    
    this.restBackend.getListings(this.filters).subscribe(data=>{
      console.log(data);
      this.listings=(data as []);
      console.log("dati arrivati: ",this.listings);
      this.leafletMap.addListingsToMap(this.listings)
    })
    
    console.log("Filtri applicati:", this.filters);

  }

  recentSearchSelected(recent:any){
    this.filters=recent;
  }

  addressSelected(place:any){
    console.log("indirizzo selezionato mi è arrivato",place);
    this.filters.centerLatitude=parseFloat(place.lat);
    this.filters.centerLongitude=parseFloat(place.lon);
    this.filters.radius=place.radius;
    
  }


  searchFromPoint(){
    const markerData=this.leafletMap.getMarkerData();

    const filters=this.filterBar.getFilters();

    filters.centerLatitude=markerData.coords.lat;
    filters.centerLongitude=markerData.coords.lng;
    filters.radius=markerData.radius;

    //imposto a null i campi per la posizione
    filters.region=null;
    filters.city=null;

    /* const filters2={
      category:filters.category,
      listingType:filters.listingType,
      centerLatitude: markerData.coords.lat,
      centerLongitude: markerData.coords.lng,
      radius: markerData.radius
    } */

    console.log("ricerca da punto",filters);

    this.restBackend.getListings(filters).subscribe(data=>{
      console.log(data);
      this.listings=(data as []);
      console.log("dati arrivati: ",this.listings);
      this.toggleSelection(); //reimposto la mappa
      this.leafletMap.addListingsToMap(this.listings)
    })


  }


  openListingDetails(listing: any): void {
    this.router.navigate(['/listing', listing.id],{
      state:{listingData:listing}
    });
  }

  resultMarkedClicked(id:string) {
    this.focusedListingId=id;
  }

}
