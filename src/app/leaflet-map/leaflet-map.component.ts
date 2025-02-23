import { Component, OnInit } from '@angular/core';
import * as leaflet from 'leaflet'

@Component({
  selector: 'app-leaflet-map',
  imports: [],
  templateUrl: './leaflet-map.component.html',
  styleUrl: './leaflet-map.component.scss'
})
export class LeafletMapComponent implements OnInit{

  ngOnInit(): void {
    this.configMap()
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

  var marker = leaflet.marker([40.853294, 14.305573],{icon:greenIcon})

  function onMarkerClick(e:any){
    alert("ciao")
    //codice per reagire al tocco del marker
  }

  marker.on("click",onMarkerClick) //registro l evento per il marker

  marker.bindPopup("<br>Preview Annuncio</br>") //qui metteremo preview dell' annuncio

  marker.addTo(this.map);

  }

}
