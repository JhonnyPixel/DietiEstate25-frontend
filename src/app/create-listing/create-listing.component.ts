/* import { Component,ViewChild } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FormGroup,FormControl,Validators,ReactiveFormsModule,FormsModule} from '@angular/forms';
import { LeafletMapComponent } from '../leaflet-map/leaflet-map.component';
import { RestBackendService } from '../rest-backend.service';


@Component({
  selector: 'app-create-listing',
  imports: [NavbarComponent,ReactiveFormsModule,LeafletMapComponent,FormsModule],
  templateUrl: './create-listing.component.html',
  styleUrl: './create-listing.component.scss'
})
export class CreateListingComponent{

  constructor(private restBackend:RestBackendService){}

  @ViewChild(LeafletMapComponent) leafletMap!: LeafletMapComponent;



  energyClasses: string[] = ['A+', 'A', 'B', 'C', 'D', 'E', 'F', 'G'];
  servicesList: string[] = []; // Array per i servizi
 
  serviceInput = new FormControl('');

  propertyForm = new FormGroup({
      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      price: new FormControl('', Validators.required),
      size: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      rooms: new FormControl('', Validators.required),
      floor: new FormControl('', Validators.required),
      elevator: new FormControl(false),
      energyClass: new FormControl('', Validators.required),
      services: new FormControl([]),
      category: new FormControl('houses', Validators.required),
      listingType: new FormControl('BUY', Validators.required),
      latitude: new FormControl(23.5, Validators.required),
      longitude: new FormControl(23.5, Validators.required),
      photos: new FormControl([])
  })

  submitForm() {
    console.log("oooo");
    if (this.propertyForm.valid) {
      console.log(this.propertyForm.value);
      console.log("aaaa");
      this.restBackend.createListing(this.propertyForm.value).subscribe( data =>{
        console.log("dat iricevuti dal backend: ",data)
      }
      )
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

  removePhoto(index:number){
    console.log("index removed: "+index)
    this.photoPreviews.splice(index,1)
    
  }

  clearAllPhotos(){
    this.photoPreviews=[]
  }

  addService() {
    console.log("ci provo")
    console.log("eccola-->"+this.serviceInput.value)
  

      const serviceValue = this.serviceInput.value!.trim();
      if (serviceValue) {
        this.servicesList.push(serviceValue);
        this.serviceInput.setValue(''); // Resetta il campo dopo l'aggiunta
      }
  }

  removeService(index: number) {
    this.servicesList.splice(index, 1);
  }

}
 */

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
