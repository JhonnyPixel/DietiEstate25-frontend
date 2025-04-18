
import { environment } from '../../enviroments/enviroment';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { AuthService } from '../auth.service';

import { faClockRotateLeft,faLocationDot } from '@fortawesome/free-solid-svg-icons';

interface AddressSuggestion {
  display_name: string;
  place_id: number;
  lat: number;
  lon: number;
  radius: number;
  boundingbox: string[];
  address: {
    city: string,
    country: string
  };
}

@Component({
  selector: 'app-address-search',
  imports: [ReactiveFormsModule,FontAwesomeModule],
  templateUrl: './address-search.component.html',
  styleUrl: './address-search.component.scss'
})
export class AddressSearchComponent implements OnInit {
  
  @Output() addressSelected = new EventEmitter<AddressSuggestion>();
  @Output() recentSearchSelected = new EventEmitter();
  @Output() inputCleared = new EventEmitter<void>();

  @Input() showRecentSearches:boolean=true
  
  searchControl = new FormControl('');
  suggestions: AddressSuggestion[] = [];
  recentSearches: any = [];
  nRecentSearches:number=5;
  isLoading = false;
  isFocused=false;
  showDropdown = false; 
  
  faClock=faClockRotateLeft
  faMark=faLocationDot


  constructor(private http: HttpClient, private auth: AuthService) {}
  
  ngOnInit() {
    // Carica le ricerche recenti all'avvio del componente
    if(this.showRecentSearches){
      this.loadRecentSearches();
    }

     // listener separato per rilevare quando l'input diventa vuoto
  this.searchControl.valueChanges.subscribe(value => {
    if (value === '') {
      this.clearSearch();
    }
  });
    
    // Implementazione per limitare le chiamate API
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
        // Quando l'utente inizia a digitare, mostra il dropdown
        this.showDropdown = true;
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

  insertInput(value:any){
    this.searchControl.setValue(value, { emitEvent: false });
  }

  clearSearch() {
    this.searchControl.setValue('', { emitEvent: false });
    this.suggestions = [...this.recentSearches];
    this.showDropdown = true;
    this.inputCleared.emit();
  }
  
  loadRecentSearches(): void {
    const userId = this.auth.getUserId();
    this.http.get<AddressSuggestion[]>(`${environment.apiUrl}/recent-searches/${userId}`).pipe(
      catchError(error => {
        console.error('Error loading recent searches:', error);
        return of([]);
      })
    ).subscribe(recentSearches => {
      this.recentSearches = recentSearches.slice(0, this.nRecentSearches);
      console.log(recentSearches);
      
      // Se il campo di ricerca è vuoto, mostra subito le ricerche recenti
      if (!this.searchControl.value || this.searchControl.value.length < 3) {
        this.suggestions = [...this.recentSearches];
      }
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
    this.searchControl.setValue(suggestion.display_name, { emitEvent: false });
    this.showDropdown = false;
    this.suggestions = [];
    
    suggestion.radius = this.addRadiusAproximation(suggestion);
    console.log('Indirizzo selezionato:', suggestion);
    this.addressSelected.emit(suggestion);
  }

  addRadiusAproximation(suggestion: AddressSuggestion) {
    const centerLat = (parseFloat(suggestion.boundingbox[0]) + parseFloat(suggestion.boundingbox[1])) / 2;
    const centerLon = (parseFloat(suggestion.boundingbox[2]) + parseFloat(suggestion.boundingbox[3])) / 2;
   
    // Converti in metri o km usando formule di distanza geografica
    const radius = Math.max(
        this.haversineDistance(centerLat, centerLon, parseFloat(suggestion.boundingbox[0]), centerLon),
        this.haversineDistance(centerLat, centerLon, centerLat, parseFloat(suggestion.boundingbox[2]))
    );

    return radius;
  }

  haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
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

  selectRecent(recent: any) {
    //impostiamo senza emettere l'evento
    this.searchControl.setValue("Ricerca Recente", { emitEvent: false });

    this.showDropdown = false;
    this.suggestions = [];
    
    console.log('Ricerca recente selezionata:', recent);
    this.recentSearchSelected.emit(recent);
  }
  
  // Funzione per mostrare il dropdown quando l'input riceve il focus
  onFocus() {
    this.isFocused=true
    this.showDropdown = true;
    // Se il campo è vuoto o ha meno di 3 caratteri, mostriamo le ricerche recenti
    if (!this.searchControl.value || this.searchControl.value.length < 3) {
      this.suggestions = [...this.recentSearches];
    }
  }
  
  // Funzione per nascondere il dropdown quando si clicca al di fuori
  onBlur() {
    // Aggiungiamo un piccolo ritardo per permettere il click sul dropdown
    setTimeout(() => {
      this.isFocused=false
      this.showDropdown = false;
    }, 200);
  }
}