

import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { RestBackendService } from '../rest-backend.service';
import { NgClass } from '@angular/common';
import { Router } from '@angular/router';

interface Listing {
  id: string;
  title: string;
  price: number;
  location: string;
  imageUrl: string;
  status: string;
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
  imports: [NgClass ],
  templateUrl: './mylistings.component.html',
  styleUrl: './mylistings.component.scss'
})
export class MylistingsComponent implements OnInit {
  houses: HouseListing[] = [];
  buildings: BuildingListing[] = [];
  lands: LandListing[] = [];
  garages: GarageListing[] = [];
  
  isLoading = true;
  activeTab: 'houses' | 'buildings' | 'lands' | 'garages' = 'houses';
  errorMessage: string | null = null;
  
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
        this.houses = results.houses;
        this.buildings = results.buildings;
        this.lands = results.lands;
        this.garages = results.garages;
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
}