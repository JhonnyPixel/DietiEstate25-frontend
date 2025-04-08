

  import { Component, ViewChild, Input, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LeafletMapComponent } from '../leaflet-map/leaflet-map.component';
import { RestBackendService } from '../rest-backend.service';
import { AddressSearchComponent } from '../address-search/address-search.component';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-listing',
  imports: [NavbarComponent, ReactiveFormsModule, LeafletMapComponent, FormsModule, AddressSearchComponent],
  templateUrl: './create-listing.component.html',
  styleUrl: './create-listing.component.scss'
})
export class CreateListingComponent implements OnInit {
  @Input() existingListing: any = null; // Input per ricevere il listing da modificare
  @ViewChild(LeafletMapComponent) leafletMap!: LeafletMapComponent;
  @ViewChild(AddressSearchComponent) addressSearchBar!: AddressSearchComponent;

  isEditMode = false;
  pageTitle = 'Crea nuovo annuncio';
  submitButtonText = 'Salva';

  energyClasses: string[] = ['A4', 'A3', 'A2', 'A1', 'B', 'C', 'D', 'E', 'F', 'G'];
  categories: string[] = ['houses', 'buildings', 'garages', 'lands'];
  listingTypes: string[] = ['BUY', 'RENT'];
  servicesList: string[] = [];
  serviceInput = new FormControl('');

  // Strutture dati per gestire le foto
  photoPreviews: { id?: number; url: string; isNew: boolean }[] = [];
  photosUrlsToDelete: string[] = []; // URLs delle foto esistenti da eliminare
  newPhotos: File[] = []; // Nuove foto da caricare

  propertyForm = new FormGroup({
    title: new FormControl('', Validators.required),
    price: new FormControl('', Validators.required),
    category: new FormControl('houses', Validators.required),
    description: new FormControl('', Validators.required),
    squareMeters: new FormControl(24, Validators.required),
    listingType: new FormControl('BUY', Validators.required),
    locationDto: new FormGroup({
      region: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      longitude: new FormControl(null, Validators.required),
      latitude: new FormControl(null, Validators.required)
    }),
    nRooms: new FormControl(5, Validators.required),
    nBathrooms: new FormControl(2, Validators.required),
    floor: new FormControl(1, Validators.required),
    energyClass: new FormControl('A4', Validators.required),
    otherFeatures: new FormControl<string[]>([]),
    elevator: new FormControl(false)
  });

  constructor(private restBackend: RestBackendService, private router: Router,private toaster:ToastrService) {
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

  ngAfterViewInit() {
    // Se siamo in modalità modifica, aggiorna la searchbar dopo che la vista è stata inizializzata
    if (this.isEditMode && this.existingListing && this.existingListing.location) {
      setTimeout(() => {
        this.addressSearchBar.insertInput(this.existingListing.location.address || '');
      });
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
    if (this.existingListing.location) {
      this.propertyForm.get('locationDto')?.patchValue({
        region: this.existingListing.location.region,
        city: this.existingListing.location.city,
        address: this.existingListing.location.address,
        longitude: this.existingListing.location.longitude,
        latitude: this.existingListing.location.latitude
      });

     

    }

    console.log("serrvizi:",this.existingListing)
    // Carica servizi/caratteristiche
    if (this.existingListing.otherFeatures && this.existingListing.otherFeatures.length > 0) {
      this.servicesList = [...this.existingListing.otherFeatures];
      this.propertyForm.get('otherFeatures')?.setValue(this.servicesList);
    }

    // Carica foto se presenti
    if (this.existingListing.photos && this.existingListing.photos.length > 0) {
      // Se le foto sono oggetti con url e id
      if (typeof this.existingListing.photos[0] === 'object' && this.existingListing.photos[0].url) {
        this.photoPreviews = this.existingListing.photos.map((photo: any) => ({
          id: photo.id,
          url: photo.url,
          isNew: false
        }));
      } 
      // Se le foto sono array di stringhe URL
      else if (typeof this.existingListing.photos[0] === 'string') {
        this.photoPreviews = this.existingListing.photos.map((url: string, index: number) => ({
          id: index, // Usando l'indice come id temporaneo
          url: url,
          isNew: false
        }));
      }
    }

    console.log("serrvizi:",this.propertyForm.value)

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
          
          // Gestisci le foto: prima elimina quelle da rimuovere
          if (this.photosUrlsToDelete.length > 0) {
            console.log("Deleting photos with URLs:", this.photosUrlsToDelete);
            this.restBackend.deleteListingImages(listingId, this.photosUrlsToDelete).subscribe(
              deleteRes => {
                console.log("Photos deleted:", deleteRes);
                // Dopo la cancellazione, carica le nuove foto se ce ne sono
                this.uploadNewPhotosIfAny(listingId);
              },
              error => {
                console.error("Error deleting photos:", error);
                // Anche in caso di errore, tenta comunque di caricare le nuove foto
                this.uploadNewPhotosIfAny(listingId);
              }
            );
          } else {
            // Se non ci sono foto da eliminare, carica direttamente le nuove
            this.uploadNewPhotosIfAny(listingId);
          }
        });
      } else {
        // Modalità creazione: crea un nuovo listing        
        this.restBackend.createListing(this.propertyForm.value).subscribe((data: any) => {
          console.log("New listing created:", data);
          // Carica le nuove foto
          if (this.newPhotos.length > 0) {
            this.restBackend.uploadListingImages(data.id, this.newPhotos).subscribe(
              uploadRes => {
                console.log("Photos uploaded:", uploadRes);
                // Redirect dopo il completamento
                this.router.navigate(['/search']);
              }
            );
          } else {
            // Redirect anche se non ci sono foto
            this.router.navigate(['/search']);
          }
        });
      }
    }else if(!this.propertyForm.get(['locationDto','address'])?.value){
      this.toaster.error('Assicurati di aver inserito almeno l indirizzo')
    }else{
      console.log(this.propertyForm.get(['locationDto','address']))
      this.toaster.error('Assicurati di aver inserito tutti i campi obbligatori','Form invalido')
    }
  }

  // Metodo per caricare le nuove foto se ce ne sono
  private uploadNewPhotosIfAny(listingId: string) {
    if (this.newPhotos.length > 0) {
      console.log("Uploading new photos:", this.newPhotos);
      this.restBackend.uploadListingImages(listingId, this.newPhotos).subscribe(
        uploadRes => {
          console.log("New photos uploaded:", uploadRes);
          // Redirect dopo il completamento
          this.router.navigate(['/search']);
        },
        error => {
          console.error("Error uploading new photos:", error);
          // Redirect anche in caso di errore
          this.router.navigate(['/search']);
        }
      );
    } else {
      // Redirect se non ci sono nuove foto da caricare
      this.router.navigate(['/search']);
    }
  }

  onPhotoUpload(event: any) {
    const files = event.target.files;
    if (files) {
      const fileList: File[] = Array.from(files);
      
      // Salva le nuove foto nell'array delle nuove foto
      this.newPhotos = [...this.newPhotos, ...fileList];
      
      // Aggiungi le anteprime
      for (let file of fileList) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.photoPreviews.push({
            url: e.target.result,
            isNew: true
          });
        };
        reader.readAsDataURL(file);
      }
    }
  }

  removePhoto(index: number) {
    const photoToRemove = this.photoPreviews[index];
    
    // Se è una foto esistente (non nuova), aggiungi l'URL all'elenco delle foto da eliminare
    if (!photoToRemove.isNew) {
      this.photosUrlsToDelete.push(photoToRemove.url);
    } else if (photoToRemove.isNew) {
      // Se è una foto nuova, rimuovila dall'array delle nuove foto
      const newPhotoIndex = this.photoPreviews.filter(p => p.isNew).indexOf(photoToRemove);
      if (newPhotoIndex !== -1) {
        this.newPhotos.splice(newPhotoIndex, 1);
      }
    }
    
    // Rimuovi la foto dall'array delle anteprime
    this.photoPreviews.splice(index, 1);
  }

  clearAllPhotos() {
    // Se ci sono foto esistenti, aggiungi tutti gli URL all'elenco delle foto da eliminare
    if (this.isEditMode) {
      const existingPhotos = this.photoPreviews.filter(p => !p.isNew);
      existingPhotos.forEach(photo => {
        this.photosUrlsToDelete.push(photo.url);
      });
    }
    
    // Svuota le nuove foto
    this.newPhotos = [];
    
    // Svuota le anteprime
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
    this.propertyForm.get(['locationDto', 'address'])?.setValue(data.address.road);
    this.propertyForm.get(['locationDto', 'latitude'])?.setValue(Number(data.lat));
    this.propertyForm.get(['locationDto', 'longitude'])?.setValue(Number(data.lon));
    
    console.log("evento emesso: ", data);
    console.log("dati form: ", this.propertyForm.value);

    this.leafletMap.updateMarkerPosition(data.lat, data.lon);
  }

  onAddressClear(){
    this.propertyForm.get(['locationDto', 'region'])?.setValue('');
    this.propertyForm.get(['locationDto', 'city'])?.setValue('');
    this.propertyForm.get(['locationDto', 'address'])?.setValue('');
    this.propertyForm.get(['locationDto', 'latitude'])?.setValue(null);
    this.propertyForm.get(['locationDto', 'longitude'])?.setValue(null);

    this.leafletMap.clearMarker()

    console.log("dati form: ", this.propertyForm.value);
  }

  // Metodo per annullare e tornare indietro
  cancel() {
    // Torna alla pagina precedente
    this.router.navigate(['/listings']);
  }
}