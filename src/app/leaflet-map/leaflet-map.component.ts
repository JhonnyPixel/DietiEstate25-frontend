import { Component, OnInit } from '@angular/core';
import * as leaflet from 'leaflet'
import { EventEmitter,Output } from '@angular/core';

@Component({
  selector: 'app-leaflet-map',
  imports: [],
  templateUrl: './leaflet-map.component.html',
  styleUrl: './leaflet-map.component.scss'
})
export class LeafletMapComponent implements OnInit{

  private marker!: L.Marker;
  private createMarker!: L.Marker;
  private defaultZoom:number = 15;
  private circle!: L.Circle;
  private radius: number = 500; // Raggio iniziale in metri
  private isSelecting: boolean = false; 
  private resizeMarker!: L.Marker;

  private resultsMarkers:L.Marker[]=[];
  private markerPopups: { [id: string]: L.Marker } = {}; // Un oggetto per mappare gli ID dei marker ai marker

  @Output() resultMarkerClicked = new EventEmitter<string>();


  
 

  ngOnInit(): void {
    this.configMap();

      // Aggiungi il listener per il click sulla mappa
      this.map.on('click', (event: any) => {
        if (this.isSelecting) {
          this.addMarker(event.latlng.lat, event.latlng.lng);
        }
      });
  }

  map:any

  configMap(){

    this.map=leaflet.map('map',{
      center:[40.853294,14.305573],
      zoom:6
    })

    leaflet.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(this.map);



  }

  toggleSelection():void{
    this.isSelecting= !this.isSelecting

    console.log(this.isSelecting)

    if(!this.isSelecting){
      this.clear()
    }
  }

  private clear(){
    if (this.marker) {
      console.log("ciaoooo")
      this.map.removeLayer(this.marker);
      this.map.removeLayer(this.circle);
      this.map.removeLayer(this.resizeMarker);
    }
  }

  private initializeRadius(): void {
    const currentZoom = this.map.getZoom();
    
    // Formula per calcolare il raggio in base al livello di zoom
    
    this.radius = Math.round(10000 * Math.pow(0.5, currentZoom - 10));
    
    // Imposta limiti per il raggio (min e max)
    //this.radius = Math.max(100, Math.min(this.radius, 10000));
    
    
  }

  private addMarker(lat: number, lng: number): void {
   
    this.initializeRadius()

    if (this.marker) {
      this.map.removeLayer(this.marker);
      this.map.removeLayer(this.circle);
      this.map.removeLayer(this.resizeMarker);
    }
  
    this.marker = leaflet.marker([lat, lng], { draggable: true }).addTo(this.map);
    this.circle = leaflet.circle([lat, lng], {
      radius: this.radius,
      color: 'blue',
      fillColor: 'blue',
      fillOpacity: 0.2
    }).addTo(this.map);
  
    // Calcola posizione iniziale del marker per ridimensionamento
    let resizeLatLng = leaflet.latLng(lat, lng + 0.01);
    this.resizeMarker = leaflet.marker(resizeLatLng, { draggable: true, icon: leaflet.divIcon({ className: 'resize-icon', html: '⬤' }) })
      .addTo(this.map);
  
    // Trascinamento del marker principale: aggiorna cerchio e resize marker
    this.marker.on('drag', (event: any) => {
      const newLatLng = event.target.getLatLng();
      this.circle.setLatLng(newLatLng);
      this.resizeMarker.setLatLng([newLatLng.lat, newLatLng.lng + 0.01]);
    });
  
    // Trascinamento del marker di ridimensionamento
    this.resizeMarker.on('drag', (event: any) => {
      const center = this.marker.getLatLng();
      const edge = event.target.getLatLng();
      this.radius = center.distanceTo(edge); // Calcola distanza tra centro e marker di controllo
      this.circle.setRadius(this.radius);
    });

    
  }

  getMarkerData(){
    return {
      coords:this.marker.getLatLng(),
      radius:this.radius
    }
  }

  clearMarker() {
    if(this.marker){
      this.map.removeLayer(this.marker)
    }
  }

  // Metodo per aggiornare o creare il marker
  updateMarkerPosition(lat: number, lng: number) {
    console.log("updateMarker: ", lat, lng);
    
    // Controlla che la mappa sia stata inizializzata
    /* if (!this.isMapInitialized) {
      console.error("La mappa non è ancora stata inizializzata");
      return;
    } */
    
    const newLatLng = leaflet.latLng(lat, lng);
    
    // Se il marker non esiste ancora, crealo
    if (!this.createMarker) {
      const customIcon = leaflet.icon({
        iconUrl: 'assets/marker-icon.png', 
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
      });
      
      // Crea il marker e aggiungilo alla mappa
      try {
        this.createMarker = leaflet.marker(newLatLng, { 
          /* draggable: true, */
          // icon: customIcon 
        }).addTo(this.map);
        
        // Aggiungi un popup al marker
        this.createMarker.bindPopup('Posizione selezionata').openPopup();
        
        // Ascolta l'evento di trascinamento del marker
        /* this.createMarker.on('dragend', () => {
          if (this.createMarker) {
            const position = this.createMarker.getLatLng();
            console.log("Nuova posizione dopo trascinamento:", position);
            // Qui puoi emettere un evento o aggiornare il form
          }
        }); */
      } catch (error) {
        console.error("Errore nella creazione del marker:", error);
        return;
      }
    } else {
      // Se il marker esiste già, aggiorna solo la sua posizione
      try {
        this.createMarker.setLatLng(newLatLng);
      } catch (error) {
        console.error("Errore nell'aggiornamento del marker:", error);
        return;
      }
    }
    
    // Fai zoom alla nuova posizione
    this.map.setView(newLatLng, this.defaultZoom);
  }

    // Metodo per aggiungere i marker alla mappa
    addListingsToMap(listings: any[]): void {
      if (!this.map) {
        console.error("La mappa non è ancora stata inizializzata.");
        return;
      }
  
      this.deletePreviousResultsMarkers();
  
      const bounds = leaflet.latLngBounds([]);
  
      listings.forEach((listing) => {
        const lat = listing.location.latitude;
        const lng = listing.location.longitude;
  
        if (lat && lng) {
          const marker = leaflet.marker([lat, lng]);
  
          // Crea un popup con le informazioni del listing
          marker.bindPopup(`
            <b>${listing.title}</b><br>
            ${listing.location.address}, ${listing.location.city}<br>
            Prezzo: ${listing.price}€
          `);
  
          // ascoltatore di eventi per quando il marker viene cliccato
          marker.on('click', () => {
            this.resultMarkerClicked.emit(listing.id);
          });
  
          // Aggiungi il marker alla mappa e all array di risultati
          marker.addTo(this.map);
          this.resultsMarkers.push(marker);
          this.markerPopups[listing.id] = marker;  // Mappa l'ID del listing al marker
  
          // Aggiunge il marker ai bounds per adattare la mappa
          bounds.extend([lat, lng]);
        } else {
          console.warn(`Coordinate mancanti per il listing: ${listing.id}`);
        }
      });
  
      // Se ci sono marker, adatta la mappa
      if (listings.length > 0) {
        this.map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  
    // Metodo per rimuovere i marker precedenti dalla mappa
    deletePreviousResultsMarkers() {
      this.resultsMarkers.forEach(marker => {
        this.map.removeLayer(marker);
      });
      this.resultsMarkers = [];
      this.markerPopups = {};  // Resetta anche la mappa degli ID
    }
  
    // Metodo per aprire il popup di un marker dato un ID
    openPopupById(listingId: string): void {
      const marker = this.markerPopups[listingId];
      if (marker) {
        marker.openPopup();  // Apre il popup del marker corrispondente
        this.map.setView(marker.getLatLng(), 15);  // Fai zoom sulla posizione del marker
      } else {
        console.error(`Marker con ID ${listingId} non trovato.`);
      }
    }
  

}
