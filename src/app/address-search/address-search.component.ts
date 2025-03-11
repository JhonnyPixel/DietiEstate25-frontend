/* import { Component, EventEmitter, OnInit,Output } from '@angular/core';
import { FormControl,ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

interface AddressSuggestion {
  display_name: string;
  place_id: number;
  lat: number;
  lon: number;
  address:{
    city:string,
    country:string
  }
}

@Component({
  selector: 'app-address-search',
  imports: [ReactiveFormsModule],
  templateUrl: './address-search.component.html',
  styleUrl: './address-search.component.scss'
})
export class AddressSearchComponent implements OnInit  {

  @Output() addressSelected=new EventEmitter<AddressSuggestion>();

  searchControl = new FormControl('');
  suggestions: AddressSuggestion[] = [];
  isLoading = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {

    
    // Implementazione con debounce per limitare le chiamate API
    this.searchControl.valueChanges.pipe(
      debounceTime(300), // Attende 300ms dopo l'ultima digitazione
      distinctUntilChanged(), // Invia solo se il valore è cambiato
      switchMap(term => {
        if (!term || term.length < 3) {
          this.suggestions = [];
          return of([]);
        }
        this.isLoading = true;
        return this.searchAddresses(term);
      }),
      catchError(error => {
        console.error('Error fetching address suggestions:', error);
        return of([]);
      })
    ).subscribe(results => {
      this.suggestions = results;
      this.isLoading = false;
    });
  }

  searchAddresses(query: string): Observable<AddressSuggestion[]> {
    // Utilizzo di Nominatim API di OpenStreetMap
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5`;
    
    return this.http.get<AddressSuggestion[]>(url).pipe(
      catchError(error => {
        console.error('API error:', error);
        return of([]);
      })
    );
  }

  selectAddress(suggestion: AddressSuggestion) {
    this.searchControl.setValue(suggestion.display_name);
    this.suggestions = [];
    
    // Qui puoi emettere un evento o chiamare un servizio per gestire l'indirizzo selezionato
    console.log('Indirizzo selezionato:', suggestion);
    this.addressSelected.emit(suggestion);
    // Esempio: this.selectedAddress.emit(suggestion);
  }

} */

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { AuthService } from '../auth.service';

interface AddressSuggestion {
  display_name: string;
  place_id: number;
  lat: number;
  lon: number;
  radius:number;
  boundingbox:string[];
  address: {
    city: string,
    country: string
  };
  isRecent?: boolean; // Flag per identificare le ricerche recenti
}

@Component({
  selector: 'app-address-search',
  imports: [ReactiveFormsModule],
  templateUrl: './address-search.component.html',
  styleUrl: './address-search.component.scss'
})
export class AddressSearchComponent implements OnInit {
  
  @Output() addressSelected = new EventEmitter<AddressSuggestion>();
  @Output() recentSearchSelected = new EventEmitter();
  
  searchControl = new FormControl('');
  suggestions: AddressSuggestion[] = [];
  recentSearches:any=[];
  isLoading = false;
  
  constructor(private http: HttpClient,private auth:AuthService) {}
  
  ngOnInit() {
    // Carica le ricerche recenti all'avvio del componente
    this.loadRecentSearches();
    
    // Implementazione con debounce per limitare le chiamate API
    this.searchControl.valueChanges.pipe(
      debounceTime(300), // Attende 300ms dopo l'ultima digitazione
      distinctUntilChanged(), // Invia solo se il valore è cambiato
      switchMap(term => {
        if (!term || term.length < 3) {
          // Se il campo è vuoto o contiene meno di 3 caratteri, mostra solo le ricerche recenti
          this.suggestions = [...this.recentSearches];
          return of([]);
        }
        this.isLoading = true;
        return this.searchAddresses(term);
      }),
      catchError(error => {
        console.error('Error fetching address suggestions:', error);
        return of([]);
      })
    ).subscribe(results => {
      // Combina le ricerche recenti con i risultati della API
      /* this.combineRecentAndApiResults(results); */
      this.suggestions = results;
      this.isLoading = false;
    });
  }
  
  loadRecentSearches(): void {
    // Chiamata al tuo endpoint per recuperare le ricerche recenti
    const userId=this.auth.getUserId();
    this.http.get<AddressSuggestion[]>(`http://localhost:8080/api/recent-searches/${userId}`).pipe(
      catchError(error => {
        console.error('Error loading recent searches:', error);
        return of([]);
      })
    ).subscribe(recentSearches => {
      this.recentSearches = recentSearches

      console.log(recentSearches)
      
      // Se il campo di ricerca è vuoto, mostra subito le ricerche recenti
      if (!this.searchControl.value || this.searchControl.value.length < 3) {
        this.suggestions = [...this.recentSearches];
      }
    });
  }
  
  /* combineRecentAndApiResults(apiResults: AddressSuggestion[]): void {
    // Filtra le ricerche recenti che corrispondono alla query attuale
    const query = this.searchControl.value?.toLowerCase() || '';
    const filteredRecents = this.recentSearches.filter(
      recent => recent.display_name.toLowerCase().includes(query)
    );
    
    // Evita duplicati (se un indirizzo è sia nei recenti che nei risultati API)
    const apiResultsWithoutDuplicates = apiResults.filter(
      apiResult => !filteredRecents.some(
        recent => recent.place_id === apiResult.place_id
      )
    );
    
    // Combina con i recenti all'inizio
    this.suggestions = [...filteredRecents, ...apiResultsWithoutDuplicates];
  } */
  
  searchAddresses(query: string): Observable<AddressSuggestion[]> {
    // Utilizzo di Nominatim API di OpenStreetMap
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5`;
    
    return this.http.get<AddressSuggestion[]>(url).pipe(
      catchError(error => {
        console.error('API error:', error);
        return of([]);
      })
    );
  }
  
  selectAddress(suggestion: AddressSuggestion) {
    this.searchControl.setValue(suggestion.display_name);
    this.suggestions = [];
    
    // Salva nelle ricerche recenti (puoi implementare una chiamata all'endpoint per salvarla)
   /*  this.saveToRecentSearches(suggestion); */
    
   

    suggestion.radius=this.addRadiusAproximation(suggestion);

    console.log('Indirizzo selezionato:', suggestion);

    this.addressSelected.emit(suggestion);
  }

  addRadiusAproximation(suggestion: AddressSuggestion){

    const centerLat = (parseFloat(suggestion.boundingbox[0]) + parseFloat(suggestion.boundingbox[1])) / 2;
    const centerLon = (parseFloat(suggestion.boundingbox[2]) + parseFloat(suggestion.boundingbox[3])) / 2;

   
    // Converti in metri o km usando formule di distanza geografica
    const radius = Math.max(
        this.haversineDistance(centerLat, centerLon, parseFloat(suggestion.boundingbox[0]), centerLon),
        this.haversineDistance(centerLat, centerLon, centerLat, parseFloat(suggestion.boundingbox[2]))
    );

    return radius;

  }

  haversineDistance(lat1:number, lon1:number, lat2:number, lon2:number) {
    const R = 6371000; // raggio della Terra in metri
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // distanza in metri
  }


  selectRecent(recent:any) {
    this.searchControl.setValue("Ricerca Recente");
    this.suggestions = [];
    
    // Salva nelle ricerche recenti (puoi implementare una chiamata all'endpoint per salvarla)
   /*  this.saveToRecentSearches(suggestion); */
    
    console.log('Ricerca recente selezionata:', recent);
    this.recentSearchSelected.emit(recent);
  }
  
  /* saveToRecentSearches(suggestion: AddressSuggestion): void {
    // Rimuovi l'attributo isRecent prima di salvare
    const { isRecent, ...suggestionToSave } = suggestion;
    
    // Chiamata POST al tuo endpoint per salvare la ricerca recente
    this.http.post<void>('/api/recent-addresses', suggestionToSave).pipe(
      catchError(error => {
        console.error('Error saving recent search:', error);
        return of(null);
      })
    ).subscribe(() => {
      // Aggiorna la lista delle ricerche recenti
      this.loadRecentSearches();
    });
  } */
}
