/* 

import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { RestBackendService } from '../rest-backend.service';
import { NgClass } from '@angular/common';
import { Router,RouterLink } from '@angular/router';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NavbarComponent } from '../navbar/navbar.component';

interface Listing {
  id: string;
  title: string;
  price: number;
  location: any;
  photos: string[];
  listingType: string;
  createdAt: Date;
  // altri campi comuni
}

interface HouseListing extends Listing {
  rooms: number;
  area: number;
  // campi specifici per case
}

interface BuildingListing extends Listing {
  floors: number;
  totalArea: number;
  // campi specifici per edifici
}

interface LandListing extends Listing {
  area: number;
  zoning: string;
  // campi specifici per terreni
}

interface GarageListing extends Listing {
  size: number;
  securitySystem: boolean;
  // campi specifici per garage
}

@Component({
  selector: 'app-mylistings',
  imports: [NgClass,RouterLink,FontAwesomeModule,NavbarComponent],
  templateUrl: './mylistings.component.html',
  styleUrl: './mylistings.component.scss'
})
export class MylistingsComponent implements OnInit {
  //houses: HouseListing[] = [];
  //buildings: BuildingListing[] = [];
  //lands: LandListing[] = [];
  //garages: GarageListing[] = [];

  houses: any[] = [];
  buildings: any[] = [];
  lands: any[] = [];
  garages: any[] = [];
  
  isLoading = true;
  activeTab: 'houses' | 'buildings' | 'lands' | 'garages' = 'houses';
  errorMessage: string | null = null;

  faPlus=faPlus
  
  constructor(private listingsService: RestBackendService,private router:Router) {}
  
  ngOnInit(): void {
    this.loadAllListings();
  }
  
  loadAllListings(): void {
    this.isLoading = true;
    this.errorMessage = null;
    
    // Utilizzo forkJoin per fare richieste parallele
    forkJoin({
      houses: this.listingsService.getUserHouses(),
      buildings: this.listingsService.getUserBuildings(),
      lands: this.listingsService.getUserLands(),
      garages: this.listingsService.getUserGarages()
    }).subscribe({
      next: (results) => {
        console.log("riuslati finali__>",results);
        this.houses = results.houses.content;
        this.buildings = results.buildings.content;
        this.lands = results.lands.content;
        this.garages = results.garages.content;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Errore nel recupero degli annunci', error);
        this.errorMessage = 'Si è verificato un errore nel caricamento dei tuoi annunci. Riprova più tardi.';
        this.isLoading = false;
      }
    });
  }

  editListing(house: any) {
    // Naviga al componente di modifica e passa il listing come stato di navigazione
    this.router.navigate(['/create'], { 
      state: { listing: house } 
    });
  }
  
  setActiveTab(tab: 'houses' | 'buildings' | 'lands' | 'garages'): void {
    this.activeTab = tab;
  }
  
  getListingsCount(): number {
    return this.houses.length + this.buildings.length + this.lands.length + this.garages.length;
  }
  
  deleteListing(type: string, id: string): void {
    if (confirm('Sei sicuro di voler eliminare questo annuncio?')) {
      const deleteMethod = {
        'houses': () => this.listingsService.deleteHouse(id),
        'buildings': () => this.listingsService.deleteBuilding(id),
        'lands': () => this.listingsService.deleteLand(id),
        'garages': () => this.listingsService.deleteGarage(id)
      }[type];
      
      if (deleteMethod) {
        deleteMethod().subscribe({
          next: () => {
            // Aggiorna l'array locale in base al tipo
            if (type === 'houses') {
              this.houses = this.houses.filter(h => h.id !== id);
            } else if (type === 'buildings') {
              this.buildings = this.buildings.filter(b => b.id !== id);
            } else if (type === 'lands') {
              this.lands = this.lands.filter(l => l.id !== id);
            } else if (type === 'garages') {
              this.garages = this.garages.filter(g => g.id !== id);
            }
          },
          error: (error:any) => {
            console.error('Errore durante l\'eliminazione', error);
            alert('Impossibile eliminare l\'annuncio. Riprova più tardi.');
          }
        });
      }
    }
  }
} */

  import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { RestBackendService } from '../rest-backend.service';
import { NgClass } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NavbarComponent } from '../navbar/navbar.component';

interface Listing {
  id: string;
  title: string;
  price: number;
  location: any;
  photos: string[];
  listingType: string;
  createdAt: Date;
  // altri campi comuni
}

interface HouseListing extends Listing {
  rooms: number;
  area: number;
  // campi specifici per case
}

interface BuildingListing extends Listing {
  floors: number;
  totalArea: number;
  // campi specifici per edifici
}

interface LandListing extends Listing {
  area: number;
  zoning: string;
  // campi specifici per terreni
}

interface GarageListing extends Listing {
  size: number;
  securitySystem: boolean;
  // campi specifici per garage
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
}

@Component({
  selector: 'app-mylistings',
  imports: [NgClass, RouterLink, FontAwesomeModule, NavbarComponent],
  templateUrl: './mylistings.component.html',
  styleUrl: './mylistings.component.scss'
})
export class MylistingsComponent implements OnInit {
  houses: any[] = [];
  buildings: any[] = [];
  lands: any[] = [];
  garages: any[] = [];
  
  // Informazioni di paginazione per ogni categoria
  housesPagination: PaginationInfo = { currentPage: 0, totalPages: 1, totalElements: 0, pageSize: 10 };
  buildingsPagination: PaginationInfo = { currentPage: 0, totalPages: 1, totalElements: 0, pageSize: 10 };
  landsPagination: PaginationInfo = { currentPage: 0, totalPages: 1, totalElements: 0, pageSize: 10 };
  garagesPagination: PaginationInfo = { currentPage: 0, totalPages: 1, totalElements: 0, pageSize: 10 };
  
  isLoading = true;
  activeTab: 'houses' | 'buildings' | 'lands' | 'garages' = 'houses';
  errorMessage: string | null = null;

  faPlus = faPlus;
  
  constructor(private listingsService: RestBackendService, private router: Router) {}
  
  ngOnInit(): void {
    this.loadAllListings();
  }
  
  loadAllListings(): void {
    this.isLoading = true;
    this.errorMessage = null;
    
    // Utilizzo forkJoin per fare richieste parallele
    forkJoin({
      houses: this.listingsService.getUserHouses(this.housesPagination.currentPage),
      buildings: this.listingsService.getUserBuildings(this.buildingsPagination.currentPage),
      lands: this.listingsService.getUserLands(this.landsPagination.currentPage),
      garages: this.listingsService.getUserGarages(this.garagesPagination.currentPage)
    }).subscribe({
      next: (results) => {
        console.log("risultati finali__>", results);
        
        // Houses
        this.houses = results.houses.content;
        this.updatePaginationInfo('houses', results.houses);
        
        // Buildings
        this.buildings = results.buildings.content;
        this.updatePaginationInfo('buildings', results.buildings);
        
        // Lands
        this.lands = results.lands.content;
        this.updatePaginationInfo('lands', results.lands);
        
        // Garages
        this.garages = results.garages.content;
        this.updatePaginationInfo('garages', results.garages);
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Errore nel recupero degli annunci', error);
        this.errorMessage = 'Si è verificato un errore nel caricamento dei tuoi annunci. Riprova più tardi.';
        this.isLoading = false;
      }
    });
  }

  // Metodo per aggiornare le informazioni di paginazione
  updatePaginationInfo(type: string, response: any): void {
    const paginationInfo: PaginationInfo = {
      currentPage: response.pageable?.pageNumber || 0,
      totalPages: response.totalPages || 1,
      totalElements: response.totalElements || 0,
      pageSize: response.pageable?.pageSize || 10
    };

    switch (type) {
      case 'houses':
        this.housesPagination = paginationInfo;
        break;
      case 'buildings':
        this.buildingsPagination = paginationInfo;
        break;
      case 'lands':
        this.landsPagination = paginationInfo;
        break;
      case 'garages':
        this.garagesPagination = paginationInfo;
        break;
    }
  }

  // Carica annunci per una categoria specifica
  loadListingsByType(type: 'houses' | 'buildings' | 'lands' | 'garages', page: number): void {
    this.isLoading = true;
    
    const loadMethod = {
      'houses': () => this.listingsService.getUserHouses(page),
      'buildings': () => this.listingsService.getUserBuildings(page),
      'lands': () => this.listingsService.getUserLands(page),
      'garages': () => this.listingsService.getUserGarages(page)
    }[type];
    
    if (loadMethod) {
      loadMethod().subscribe({
        next: (response) => {
          switch (type) {
            case 'houses':
              this.houses = response.content;
              break;
            case 'buildings':
              this.buildings = response.content;
              break;
            case 'lands':
              this.lands = response.content;
              break;
            case 'garages':
              this.garages = response.content;
              break;
          }
          
          this.updatePaginationInfo(type, response);
          this.isLoading = false;
        },
        error: (error) => {
          console.error(`Errore nel recupero degli annunci di tipo ${type}`, error);
          this.errorMessage = `Si è verificato un errore nel caricamento dei tuoi annunci di tipo ${type}. Riprova più tardi.`;
          this.isLoading = false;
        }
      });
    }
  }

  // Metodo per cambiare pagina
  goToPage(type: 'houses' | 'buildings' | 'lands' | 'garages', page: number): void {
    const pagination = this.getPaginationForType(type);
    
    if (page < 0 || page >= pagination.totalPages || page === pagination.currentPage) {
      return;
    }
    
    // Aggiorno la pagina corrente nell'oggetto di paginazione
    switch (type) {
      case 'houses':
        this.housesPagination.currentPage = page;
        break;
      case 'buildings':
        this.buildingsPagination.currentPage = page;
        break;
      case 'lands':
        this.landsPagination.currentPage = page;
        break;
      case 'garages':
        this.garagesPagination.currentPage = page;
        break;
    }
    
    // Carico i nuovi dati
    this.loadListingsByType(type, page);
    
    // Scroll to top of results
    const resultsContainer = document.querySelector('.grid');
    if (resultsContainer) {
      resultsContainer.scrollTop = 0;
    }
  }

  getPaginationForType(type: 'houses' | 'buildings' | 'lands' | 'garages'): PaginationInfo {
    switch (type) {
      case 'houses': return this.housesPagination;
      case 'buildings': return this.buildingsPagination;
      case 'lands': return this.landsPagination;
      case 'garages': return this.garagesPagination;
    }
  }

  // Calcolo degli indici per la visualizzazione (es: "Risultati 1-10 di 50")
  getDisplayedResultsStart(type: 'houses' | 'buildings' | 'lands' | 'garages'): number {
    const pagination = this.getPaginationForType(type);
    return pagination.currentPage * pagination.pageSize + 1;
  }
  
  getDisplayedResultsEnd(type: 'houses' | 'buildings' | 'lands' | 'garages'): number {
    const pagination = this.getPaginationForType(type);
    return Math.min((pagination.currentPage + 1) * pagination.pageSize, pagination.totalElements);
  }
  
  // Generazione array di pagine per la paginazione
  getPagesArray(type: 'houses' | 'buildings' | 'lands' | 'garages'): number[] {
    const pagination = this.getPaginationForType(type);
    const pagesArray: number[] = [];
    const maxVisiblePages = 5;
    
    if (pagination.totalPages <= maxVisiblePages) {
      // Mostra tutte le pagine se il totale è inferiore al massimo visibile
      for (let i = 0; i < pagination.totalPages; i++) {
        pagesArray.push(i);
      }
    } else {
      // Calcola quali pagine mostrare
      const halfVisible = Math.floor(maxVisiblePages / 2);
      
      let startPage = Math.max(0, pagination.currentPage - halfVisible);
      let endPage = Math.min(pagination.totalPages - 1, pagination.currentPage + halfVisible);
      
      // Aggiusta se siamo vicini all'inizio
      if (pagination.currentPage < halfVisible) {
        endPage = maxVisiblePages - 1;
      }
      
      // Aggiusta se siamo vicini alla fine
      if (pagination.currentPage > pagination.totalPages - halfVisible - 1) {
        startPage = pagination.totalPages - maxVisiblePages;
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
      if (endPage < pagination.totalPages - 1) {
        // Aggiungi ellipsis se necessario
        if (endPage < pagination.totalPages - 2) {
          pagesArray.push(-2); // -2 rappresenta l'ellipsis
        }
        pagesArray.push(pagination.totalPages - 1);
      }
    }
    
    return pagesArray;
  }

  editListing(house: any) {
    // Naviga al componente di modifica e passa il listing come stato di navigazione
    this.router.navigate(['/create'], { 
      state: { listing: house } 
    });
  }
  
  setActiveTab(tab: 'houses' | 'buildings' | 'lands' | 'garages'): void {
    this.activeTab = tab;
  }
  
  getListingsCount(): number {
    return this.houses.length + this.buildings.length + this.lands.length + this.garages.length;
  }
  
  deleteListing(type: string, id: string): void {
    if (confirm('Sei sicuro di voler eliminare questo annuncio?')) {
      const deleteMethod = {
        'houses': () => this.listingsService.deleteHouse(id),
        'buildings': () => this.listingsService.deleteBuilding(id),
        'lands': () => this.listingsService.deleteLand(id),
        'garages': () => this.listingsService.deleteGarage(id)
      }[type];
      
      if (deleteMethod) {
        deleteMethod().subscribe({
          next: () => {
            // Aggiorna l'array locale in base al tipo
            if (type === 'houses') {
              this.houses = this.houses.filter(h => h.id !== id);
              this.housesPagination.totalElements--;
              if (this.houses.length === 0 && this.housesPagination.currentPage > 0) {
                this.goToPage('houses', this.housesPagination.currentPage - 1);
              } else {
                this.loadListingsByType('houses', this.housesPagination.currentPage);
              }
            } else if (type === 'buildings') {
              this.buildings = this.buildings.filter(b => b.id !== id);
              this.buildingsPagination.totalElements--;
              if (this.buildings.length === 0 && this.buildingsPagination.currentPage > 0) {
                this.goToPage('buildings', this.buildingsPagination.currentPage - 1);
              } else {
                this.loadListingsByType('buildings', this.buildingsPagination.currentPage);
              }
            } else if (type === 'lands') {
              this.lands = this.lands.filter(l => l.id !== id);
              this.landsPagination.totalElements--;
              if (this.lands.length === 0 && this.landsPagination.currentPage > 0) {
                this.goToPage('lands', this.landsPagination.currentPage - 1);
              } else {
                this.loadListingsByType('lands', this.landsPagination.currentPage);
              }
            } else if (type === 'garages') {
              this.garages = this.garages.filter(g => g.id !== id);
              this.garagesPagination.totalElements--;
              if (this.garages.length === 0 && this.garagesPagination.currentPage > 0) {
                this.goToPage('garages', this.garagesPagination.currentPage - 1);
              } else {
                this.loadListingsByType('garages', this.garagesPagination.currentPage);
              }
            }
          },
          error: (error: any) => {
            console.error('Errore durante l\'eliminazione', error);
            alert('Impossibile eliminare l\'annuncio. Riprova più tardi.');
          }
        });
      }
    }
  }
}