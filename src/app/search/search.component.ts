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


  filterConfig: { [key: string]: string[] } = {
    houses: [
        'listingType',
        'priceMin',
        'priceMax',
        'energyClassMin',
        'region',
        'city',
        'squareMetersMin',
        'squareMetersMax',
        'nRoomsMin',
        'nRoomsMax',
        'nBathroomsMin',
        'nBathroomsMax',
        'floorMin',
        'floorMax'],
    buildings: [
      'listingType',
      'priceMin',
      'priceMax',
      'region',
      'city',
      'squareMetersMin',
      'squareMetersMax'],
    garages: [
      'listingType',
      'priceMin',
      'priceMax',
      'region',
      'city',
      'squareMetersMin',
      'squareMetersMax',
      'floorMin',
      'floorMax'],
    lands: [
      'listingType',
      'priceMin',
      'priceMax',
      'region',
      'city',
      'squareMetersMin',
      'squareMetersMax',
      'building']
  };


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

  availableFilters: string[] = this.filterConfig["houses"]; 

  address:any;

   priceValue: number = 0;
   priceHighValue:number =200; 
   priceOptions: Options = {
    floor: 0,
    ceil: 200,
    translate: (value: number): string => {
      return value === 0 ? '€0' : value === 200 ? '€2M+' : '€' + value + 'k';
    }
  };

  surfaceValue: number = 0;
   surfaceHighValue:number =2000; 
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

  onCategoryChange(event:any) {

    console.log(event.target.value);
    this.availableFilters=this.filterConfig[event.target.value]
    //this.filterForm // Reset filtri quando cambia categoria
    this.resetFilters(event.target.value);
    //this.disableFilters();
  }

  addressClear() {
    this.filters.centerLatitude=null;
    this.filters.centerLongitude=null;
    this.filters.radius=null;
    this.address=null;
  }

  getCategorySlug(cat:string){
    const categorySlug = {
      HOUSE: 'houses',
      BUILDING: 'buildings',
      GARAGE: 'garages',
      LAND: 'lands'
    }[cat as 'HOUSE' | 'BUILDING' | 'GARAGE' | 'LAND'];

    return categorySlug
  }
  

  recentSearchSelected(recent:any){

    const fieldMappings:any = {
      'searchType':'category'
    }
    
    Object.keys(recent).forEach(
      property=>{
        if (this.filters.hasOwnProperty(property)) {
          this.filters[property]=recent[property]
        }
      }
    )

    //let mappedRecent:any = { ...this.filters };

    Object.keys(fieldMappings).forEach(recentField => {
      if (recent[recentField] !== undefined) {
        // Copia il valore dal campo della ricerca recente al campo corrispondente dei filtri
        if(fieldMappings[recentField]==='category'){
          this.filters[fieldMappings[recentField]] = this.getCategorySlug(recent[recentField]);
        }else{
          this.filters[fieldMappings[recentField]] = recent[recentField];
        }
        
      }
    });



    console.log("riceca:",recent)
    console.log("filtri aggioranti",this.filters)

    //this.filters.category=recent.
    this.availableFilters=this.filterConfig[this.filters.category]

    // Update slider values when a recent search is selected
    this.priceValue = this.filters.priceMin ? this.filters.priceMin / 1000 : 0;
    this.priceHighValue = this.filters.priceMax ? this.filters.priceMax / 1000 : 200;
    this.surfaceValue = this.filters.surfaceMin || 0;
    this.surfaceHighValue = this.filters.surfaceMax || 2000;
  }

  addressSelected(place:any){
    console.log("indirizzo selezionato mi è arrivato",place);
    this.filters.centerLatitude=parseFloat(place.lat);
    this.filters.centerLongitude=parseFloat(place.lon);
    this.filters.radius=place.radius;

    this.address=place.display_name
    
  }

  resetFilters(category:string){
    let lat=this.filters.centerLatitude
    let lon=this.filters.centerLongitude
    let radius=this.filters.radius
    this.filters={
      listingType: 'BUY',
      category: category,
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
      centerLatitude: lat,
      centerLongitude: lon,
      radius: radius
    };
  }

  disableFilters() {
    // Aggiungi logica per resettare o disabilitare i controlli non necessari
    for (const control in this.filters.controls) {
      if (this.filters.controls.hasOwnProperty(control)) {
        if (control === 'category') {
          this.filters.controls[control].enable();
        } else {
          const controlEnabled = this.availableFilters.includes(control);
  
          if (controlEnabled) {
            this.filters.controls[control].enable();
          } else {
            this.filters.controls[control].disable();
            // Reset dei valori dei controlli disabilitati
            //this.filterForm.controls[control].setValue(null);
          }
        }
      }
    }
  }

  search() {

    console.log("applicata ricerca filtri:",this.filters)

    // Update the filters with the current slider values before searching
    this.onPriceChange(null);
    this.onSurfaceChange(null);

    this.router.navigate(['/results'], { state: { filters: this.filters,address:this.address } });
  }
}
