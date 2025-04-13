
import { Component, ViewChild } from '@angular/core';
import { LeafletMapComponent } from '../leaflet-map/leaflet-map.component';
import { FormsModule } from '@angular/forms';
import { RestBackendService } from '../rest-backend.service';
import { FilterBarComponent } from '../filter-bar/filter-bar.component';
import { AddressSearchComponent } from '../address-search/address-search.component';
import { Router, RouterLink } from '@angular/router';

import { ResultItemComponent } from '../result-item/result-item.component';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-search-results',
  imports: [LeafletMapComponent,NavbarComponent, FormsModule, FilterBarComponent, AddressSearchComponent, RouterLink, ResultItemComponent],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.scss'
})
export class SearchResultsComponent {

  constructor(private restBackend: RestBackendService, private router: Router) { }

  @ViewChild(LeafletMapComponent) leafletMap!: LeafletMapComponent;
  @ViewChild(FilterBarComponent) filterBar!: FilterBarComponent;
  @ViewChild(AddressSearchComponent) addressBar!: AddressSearchComponent;

  filtersFromSearch:any=null

  listings: Array<any> = [];
  
  // Pagination variables
  currentPage: number = 0;  
  totalPages: number = 1;
  totalResults: number = 0;
  resultsPerPage: number = 10;

  isSelecting: Boolean = false;

  focusedListingId: string = '';

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
    radius: null,
    page: 0  
  };

  

  ngOnInit() {
    const state = window.history.state;
    const filters = state ? state.filters : null;
    
    console.log('sono in OnInit', state);
    if (filters) {
      console.log('Dati ricevuti:', filters);
      this.filtersFromSearch={...filters}
      this.onFiltersApplied(filters);
      
    }
  }

  ngAfterViewInit(){
    const state = window.history.state;
    const address = state ? state.address : null;

    if(address){
      this.addressBar.insertInput(address)
    }
  }

  toggleSelection(): void {
    this.leafletMap.toggleSelection();
    this.isSelecting = !this.isSelecting;
  }

  onFiltersApplied(filters: any) {

   
    this.currentPage = 0;  // Reset to page 0

    console.log("filtri applicati: ",filters);
    
    for (let key in filters) {
      this.filters[key] = filters[key];
    }
    
    // Set current page in filters
    this.filters.page = this.currentPage;
    
    this.fetchListings();


     
  }

  fetchListings() {
    console.log("sto per chiamare getListing: ",this.filters)
    this.restBackend.getListings(this.filters).subscribe((response:any) => {
     

      console.log("risposta backend:",response)

      this.listings = response.content;

      this.currentPage = response.pageable.pageNumber || 0;
      this.totalPages = response.totalPages || 1;
      this.totalResults = response.totalElements || this.listings.length;
      this.resultsPerPage = response.pageable.pageSize || 10;

      console.log("dati arrivati: ", this.listings);
      console.log("Pagination info:", {
        currentPage: this.currentPage,
        totalPages: this.totalPages,
        totalResults: this.totalResults
      });
      
      this.leafletMap.addListingsToMap(this.listings);
      
      //this.resetLocationFilters();
    });
  }

  goToPage(page: number) {
    if (page < 0 || page >= this.totalPages || page === this.currentPage) {
      return;
    }
    
    this.currentPage = page;
    this.filters.page = page;
    
    this.fetchListings();
    
    // Scroll to top of results
    const resultsContainer = document.querySelector('.flex-1.flex.flex-col');
    if (resultsContainer) {
      resultsContainer.scrollTop = 0;
    }
  }

  resetLocationFilters(): void {
    // Reset delle coordinate e del raggio
    this.filters.centerLatitude = null;
    this.filters.centerLongitude = null;
    this.filters.radius = null;

    /* delete this.filters.centerLatitude
    delete this.filters.centerLongitude
    delete this.filters.radius */
    
    console.log("Filtri di posizione reimpostati:", this.filters);
  }

  recentSearchSelected(recent: any) {
    this.currentPage = 0;  // Reset to page 0
    /* this.filters = recent; */

    const category=this.getCategorySlug(recent.searchType)
    recent.searchType=null
    delete recent.searchType //formatta per bene la categoria
    this.filters.category=category

    this.onFiltersApplied(recent);
    this.filters.page = this.currentPage;
    this.fetchListings();
  }

  addressSelected(place: any) {
    console.log("indirizzo selezionato mi è arrivato", place);
    this.filters.centerLatitude = parseFloat(place.lat);
    this.filters.centerLongitude = parseFloat(place.lon);
    this.filters.radius = place.radius;
  }

  searchFromPoint() {
    const markerData = this.leafletMap.getMarkerData();
    const filters = {...this.filterBar.getFilters()}
    
    // Reset to first page
    this.currentPage = 0;  // Reset to page 0

    filters.centerLatitude = markerData.coords.lat;
    filters.centerLongitude = markerData.coords.lng;
    filters.radius = markerData.radius;
    filters.page = this.currentPage;

    // Imposto a null i campi per la posizione
    filters.region = null;
    filters.city = null;

    console.log("ricerca da punto", filters);

    this.restBackend.getListings(filters).subscribe((response:any) => {
      

      this.listings = response.content;

      this.currentPage = response.pageable.pageNumber || 0;
      this.totalPages = response.totalPages || 1;
      this.totalResults = response.totalElements || this.listings.length;
      this.resultsPerPage = response.pageable.pageSize || 10;

      
      console.log("dati arrivati: ", this.listings);
      this.toggleSelection(); // Reimposto la mappa
      this.leafletMap.addListingsToMap(this.listings);

      this.addressBar.clearSearch()
      
      this.resetLocationFilters();
      
    });
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

  openListingDetails(listing: any): void {
    console.log(listing);
    
    const categorySlug = this.getCategorySlug(listing.category)
    
    this.router.navigate(['/listing', categorySlug, listing.id], {
      state: { listingData: listing }
    });
  }

  resultMarkedClicked(id: string) {
    this.focusedListingId = id;
  }
  
  // Calcola l'indice di inizio e fine per il conteggio dei risultati
  get displayedResultsStart(): number {
    return this.currentPage * this.resultsPerPage + 1;
  }
  
  get displayedResultsEnd(): number {
    return Math.min((this.currentPage + 1) * this.resultsPerPage, this.totalResults);
  }
  
  // Genera array di pagine per la paginazione
  getPagesArray(): number[] {
    const pagesArray: number[] = [];
    const maxVisiblePages = 5;
    
    if (this.totalPages <= maxVisiblePages) {
      // Mostra tutte le pagine se il totale è inferiore al massimo visibile
      for (let i = 0; i < this.totalPages; i++) {
        pagesArray.push(i);
      }
    } else {
      // Calcola quali pagine mostrare
      const halfVisible = Math.floor(maxVisiblePages / 2);
      
      let startPage = Math.max(0, this.currentPage - halfVisible);
      let endPage = Math.min(this.totalPages - 1, this.currentPage + halfVisible);
      
      // Aggiusta se siamo vicini all'inizio
      if (this.currentPage < halfVisible) {
        endPage = maxVisiblePages - 1;
      }
      
      // Aggiusta se siamo vicini alla fine
      if (this.currentPage > this.totalPages - halfVisible - 1) {
        startPage = this.totalPages - maxVisiblePages;
      }
      
      // Aggiungi pagina 0 se non è inclusa
      if (startPage > 0) {
        pagesArray.push(0);
        // Aggiungi ellipsis se necessario
        if (startPage > 1) {
          pagesArray.push(-1); // -1 rappresenta l'ellipsis
        }
      }
      
      // Aggiungi le pagine centrali
      for (let i = startPage; i <= endPage; i++) {
        pagesArray.push(i);
      }
      
      // Aggiungi l'ultima pagina se non è inclusa
      if (endPage < this.totalPages - 1) {
        // Aggiungi ellipsis se necessario
        if (endPage < this.totalPages - 2) {
          pagesArray.push(-2); // -2 rappresenta l'ellipsis
        }
        pagesArray.push(this.totalPages - 1);
      }
    }
    
    return pagesArray;
  }
}