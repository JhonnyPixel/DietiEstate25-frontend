import { Component, OnInit } from '@angular/core';
import * as leaflet from 'leaflet'

@Component({
  selector: 'app-leaflet-map',
  imports: [],
  templateUrl: './leaflet-map.component.html',
  styleUrl: './leaflet-map.component.scss'
})
export class LeafletMapComponent implements OnInit{

  private marker!: L.Marker;
  private defaultZoom:number = 15;
  private circle!: L.Circle;
  private radius: number = 500; // Raggio iniziale in metri
  private isSelecting: boolean = false; // Controlla se l'utente sta selezionando un punto
  private resizeMarker!: L.Marker;


  
 

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

  var greenIcon = leaflet.icon({
    iconUrl: 'img/location.png',
    shadowUrl: '',

    iconSize:     [30, 30], // size of the icon
    iconAnchor:   [15, 30], // point of the icon which will correspond to marker's location
    popupAnchor:  [0, -30] // point from which the popup should open relative to the iconAnchor
});

  /* var marker = leaflet.marker([40.853294, 14.305573],{icon:greenIcon})

  function onMarkerClick(e:any){
    alert("ciao")
    //codice per reagire al tocco del marker
  }

  marker.on("click",onMarkerClick) //registro l evento per il marker

  marker.bindPopup("<br>Preview Annuncio</br>") //qui metteremo preview dell' annuncio

  marker.addTo(this.map); */

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

  private addMarker(lat: number, lng: number): void {
   

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
    if (!this.marker) {
      // Crea un'icona personalizzata (opzionale)
      const customIcon = leaflet.icon({
        iconUrl: 'assets/marker-icon.png', // Assicurati che questo file esista!
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        // Se non hai un'icona personalizzata, puoi omettere questo blocco
        // e leaflet userà l'icona di default
      });
      
      // Crea il marker e aggiungilo alla mappa
      try {
        this.marker = leaflet.marker(newLatLng, { 
          draggable: true,
          // icon: customIcon // Decommentare se usi un'icona personalizzata
        }).addTo(this.map);
        
        // Aggiungi un popup al marker
        this.marker.bindPopup('Posizione selezionata').openPopup();
        
        // Ascolta l'evento di trascinamento del marker
        this.marker.on('dragend', () => {
          if (this.marker) {
            const position = this.marker.getLatLng();
            console.log("Nuova posizione dopo trascinamento:", position);
            // Qui puoi emettere un evento o aggiornare il form
          }
        });
      } catch (error) {
        console.error("Errore nella creazione del marker:", error);
        return;
      }
    } else {
      // Se il marker esiste già, aggiorna solo la sua posizione
      try {
        this.marker.setLatLng(newLatLng);
      } catch (error) {
        console.error("Errore nell'aggiornamento del marker:", error);
        return;
      }
    }
    
    // Fai zoom alla nuova posizione
    this.map.setView(newLatLng, this.defaultZoom);
  }

}
