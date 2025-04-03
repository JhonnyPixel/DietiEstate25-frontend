/* 

import { Component, ViewChild } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LeafletMapComponent } from '../leaflet-map/leaflet-map.component';
import { RestBackendService } from '../rest-backend.service';
import { AddressSearchComponent } from '../address-search/address-search.component';

@Component({
  selector: 'app-create-listing',
  imports: [NavbarComponent, ReactiveFormsModule, LeafletMapComponent, FormsModule,AddressSearchComponent],
  templateUrl: './create-listing.component.html',
  styleUrl: './create-listing.component.scss'
})
export class CreateListingComponent {

  constructor(private restBackend: RestBackendService) {}

  @ViewChild(LeafletMapComponent) leafletMap!: LeafletMapComponent;

  energyClasses: string[] = ['A4', 'A3', 'A2', 'A1', 'B', 'C', 'D', 'E', 'F', 'G'];
  categories: string[] = ['houses', 'buildings','garages','lands'];
  listingTypes: string[] = ['BUY', 'RENT'];
  servicesList: string[] = [];
  serviceInput = new FormControl('');

  propertyForm = new FormGroup({
      title: new FormControl('', Validators.required),
      price: new FormControl('', Validators.required),
      category: new FormControl('houses', Validators.required),
      description: new FormControl('', Validators.required),
      squareMeters: new FormControl(24, Validators.required),
      listingType: new FormControl('BUY', Validators.required),
      locationDto: new FormGroup({
        region: new FormControl('italy', Validators.required),
        city: new FormControl('napoli', Validators.required),
        address: new FormControl('Corso amedeo di savoia', Validators.required),
        longitude: new FormControl(25.5, Validators.required),
        latitude: new FormControl(43.1, Validators.required)
      }),
      nRooms: new FormControl(5, Validators.required),
      nBathrooms: new FormControl(2, Validators.required),
      floor: new FormControl(1, Validators.required),
      energyClass: new FormControl('A4', Validators.required),
      otherFeatures: new FormControl<string[]>([]),
      photos: new FormControl([]),
      elevator: new FormControl(false)
  });

  submitForm() {
    if (this.propertyForm.valid) {
      console.log("Form submitted:", this.propertyForm.value);
      this.restBackend.createListing(this.propertyForm.value).subscribe(data => {
        console.log("Data received from backend:", data);
      });
    }
  }

  photoPreviews: string[] = [];

  onPhotoUpload(event: any) {
    const files = event.target.files;
    if (files) {
      for (let file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.photoPreviews.push(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    }
  }

  removePhoto(index: number) {
    this.photoPreviews.splice(index, 1);
  }

  clearAllPhotos() {
    this.photoPreviews = [];
  }

  addService() {
    const serviceValue = this.serviceInput.value!.trim();
    if (serviceValue) {
      this.servicesList.push(serviceValue);

      const currentOtherFeatures = this.propertyForm.get('otherFeatures')!.value || [];
      // Aggiungi il nuovo servizio all'array esistente
      const updatedOtherFeatures = [...currentOtherFeatures, serviceValue];
      this.propertyForm.get('otherFeatures')!.setValue(updatedOtherFeatures);

      this.serviceInput.setValue('');
    }
  }

  removeService(index: number) {
    this.servicesList.splice(index, 1);

     // Ottieni i valori esistenti in 'otherFeatures' o usa un array vuoto se è null
     const currentOtherFeatures = this.propertyForm.get('otherFeatures')!.value || [];
     // Rimuovi il servizio dall'array
     const updatedOtherFeatures = currentOtherFeatures.filter((_, i: number) => i !== index);
     this.propertyForm.get('otherFeatures')!.setValue(updatedOtherFeatures);
  }

  onAddressSelected(data:any){
    this.propertyForm.get(['locationDto', 'region'])?.setValue(data.address.country);
    this.propertyForm.get(['locationDto', 'city'])?.setValue(data.address.city);
    this.propertyForm.get(['locationDto', 'latitude'])?.setValue(Number(data.lat));
    this.propertyForm.get(['locationDto', 'longitude'])?.setValue(Number(data.lon));
    console.log("evento emesso: ",data);
    this.leafletMap.updateMarkerPosition(data.lat,data.lon);
  }
}
 */

import { Component, ViewChild, Input, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LeafletMapComponent } from '../leaflet-map/leaflet-map.component';
import { RestBackendService } from '../rest-backend.service';
import { AddressSearchComponent } from '../address-search/address-search.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-listing',
  imports: [NavbarComponent, ReactiveFormsModule, LeafletMapComponent, FormsModule, AddressSearchComponent],
  templateUrl: './create-listing.component.html',
  styleUrl: './create-listing.component.scss'
})
export class CreateListingComponent implements OnInit {
  @Input() existingListing: any = null; // Input per ricevere il listing da modificare
  @ViewChild(LeafletMapComponent) leafletMap!: LeafletMapComponent;

  isEditMode = false;
  pageTitle = 'Crea nuovo annuncio';
  submitButtonText = 'Salva';

  energyClasses: string[] = ['A4', 'A3', 'A2', 'A1', 'B', 'C', 'D', 'E', 'F', 'G'];
  categories: string[] = ['houses', 'buildings', 'garages', 'lands'];
  listingTypes: string[] = ['BUY', 'RENT'];
  servicesList: string[] = [];
  serviceInput = new FormControl('');

  propertyForm = new FormGroup({
    title: new FormControl('', Validators.required),
    price: new FormControl('', Validators.required),
    category: new FormControl('houses', Validators.required),
    description: new FormControl('', Validators.required),
    squareMeters: new FormControl(24, Validators.required),
    listingType: new FormControl('BUY', Validators.required),
    locationDto: new FormGroup({
      region: new FormControl('italy', Validators.required),
      city: new FormControl('napoli', Validators.required),
      address: new FormControl('Corso amedeo di savoia', Validators.required),
      longitude: new FormControl(25.5, Validators.required),
      latitude: new FormControl(43.1, Validators.required)
    }),
    nRooms: new FormControl(5, Validators.required),
    nBathrooms: new FormControl(2, Validators.required),
    floor: new FormControl(1, Validators.required),
    energyClass: new FormControl('A4', Validators.required),
    otherFeatures: new FormControl<string[]>([]),
    photos: new FormControl([]),
    elevator: new FormControl(false)
  });

  photoPreviews: string[] = [];

  constructor(private restBackend: RestBackendService,private router:Router) {
      // Controlla se ci sono dati di navigazione
      const navigation = this.router.getCurrentNavigation();
      if (navigation?.extras.state) {
        this.existingListing = navigation.extras.state['listing'];
      }
  }

  ngOnInit() {
    // Controlla se è in modalità modifica
    if (this.existingListing) {
      this.isEditMode = true;
      this.pageTitle = 'Modifica annuncio';
      this.submitButtonText = 'Aggiorna';
      this.loadExistingListing();
    }
  }

  loadExistingListing() {
    // Imposta i valori nel form
    this.propertyForm.patchValue({
      title: this.existingListing.title,
      price: this.existingListing.price,
      category: this.existingListing.category,
      description: this.existingListing.description,
      squareMeters: this.existingListing.squareMeters,
      listingType: this.existingListing.listingType,
      nRooms: this.existingListing.nRooms,
      nBathrooms: this.existingListing.nBathrooms,
      floor: this.existingListing.floor,
      energyClass: this.existingListing.energyClass,
      elevator: this.existingListing.elevator
    });

    // Gestione location
    if (this.existingListing.locationDto) {
      this.propertyForm.get('locationDto')?.patchValue({
        region: this.existingListing.locationDto.region,
        city: this.existingListing.locationDto.city,
        address: this.existingListing.locationDto.address,
        longitude: this.existingListing.locationDto.longitude,
        latitude: this.existingListing.locationDto.latitude
      });
    }

    // Carica servizi/caratteristiche
    if (this.existingListing.otherFeatures && this.existingListing.otherFeatures.length > 0) {
      this.servicesList = [...this.existingListing.otherFeatures];
      this.propertyForm.get('otherFeatures')?.setValue(this.servicesList);
    }

    // Carica foto se presenti
    if (this.existingListing.photos && this.existingListing.photos.length > 0) {
      this.photoPreviews = [...this.existingListing.photos];
    }

    // Aggiorna la posizione sulla mappa
    setTimeout(() => {
      if (this.leafletMap && this.existingListing.locationDto) {
        this.leafletMap.updateMarkerPosition(
          this.existingListing.locationDto.latitude,
          this.existingListing.locationDto.longitude
        );
      }
    }, 500);
  }

  submitForm() {
    if (this.propertyForm.valid) {
      console.log("Form submitted:", this.propertyForm.value);

      if (this.isEditMode) {
        // Modalità modifica: aggiorna il listing esistente
        const listingId = this.existingListing.id;
        this.restBackend.updateListing(listingId, this.propertyForm.value).subscribe(data => {
          console.log("Listing updated:", data);
          // Qui potresti aggiungere una notifica di successo e redirect
        });
      } else {
        // Modalità creazione: crea un nuovo listing
        this.restBackend.createListing(this.propertyForm.value).subscribe(data => {
          console.log("New listing created:", data);
          // Qui potresti aggiungere una notifica di successo e redirect
        });
      }
    }
  }

  onPhotoUpload(event: any) {
    const files = event.target.files;
    if (files) {
      for (let file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.photoPreviews.push(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    }
  }

  removePhoto(index: number) {
    this.photoPreviews.splice(index, 1);
  }

  clearAllPhotos() {
    this.photoPreviews = [];
  }

  addService() {
    const serviceValue = this.serviceInput.value!.trim();
    if (serviceValue) {
      this.servicesList.push(serviceValue);

      const currentOtherFeatures = this.propertyForm.get('otherFeatures')!.value || [];
      const updatedOtherFeatures = [...currentOtherFeatures, serviceValue];
      this.propertyForm.get('otherFeatures')!.setValue(updatedOtherFeatures);

      this.serviceInput.setValue('');
    }
  }

  removeService(index: number) {
    this.servicesList.splice(index, 1);

    const currentOtherFeatures = this.propertyForm.get('otherFeatures')!.value || [];
    const updatedOtherFeatures = currentOtherFeatures.filter((_, i: number) => i !== index);
    this.propertyForm.get('otherFeatures')!.setValue(updatedOtherFeatures);
  }

  onAddressSelected(data: any) {
    this.propertyForm.get(['locationDto', 'region'])?.setValue(data.address.country);
    this.propertyForm.get(['locationDto', 'city'])?.setValue(data.address.city);
    this.propertyForm.get(['locationDto', 'latitude'])?.setValue(Number(data.lat));
    this.propertyForm.get(['locationDto', 'longitude'])?.setValue(Number(data.lon));
    console.log("evento emesso: ", data);
    this.leafletMap.updateMarkerPosition(data.lat, data.lon);
  }

  // Aggiunta di un metodo per annullare e tornare indietro
  cancel() {
    // Qui potresti implementare la navigazione indietro o altro comportamento
    console.log("Operazione annullata");
    // Esempio: this.router.navigate(['/listings']);
  }
}