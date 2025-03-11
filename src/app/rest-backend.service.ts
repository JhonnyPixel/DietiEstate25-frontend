import { HttpClient,HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { first } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RestBackendService {

  constructor(private httpClient:HttpClient,private authService:AuthService) { 
  }

  getListings(filters:any){
    let url=`http://localhost:8080/api/listings/${filters["category"]}`

    //let url=`https://dietiestates25-875570932601.europe-west8.run.app/api/listings/${filters["category"]}`

     // Creiamo un oggetto HttpParams per aggiungere i filtri come query params
    let params = new HttpParams().set('listingType', filters["listingType"]);

    console.log("sono getListings e mi è arrivatop:",filters["radius"] )
    // Iteriamo sugli altri filtri e li aggiungiamo come parametri
    Object.keys(filters).forEach(key => {
      if(filters[key]){
        /* params = params.set(key, filters[key]); */

        let value = filters[key];

        // Se il filtro è "radius", convertiamolo in un intero
        if (key === "radius") {
          value = Math.round(value); // Arrotonda e converte in Integer
        }
    
        params = params.set(key, value.toString()); // Assicura che sia stringa
      }
    });

    return this.httpClient.get<{}>(url,{params});
    
  }

  getListing(id:string){
    /* let url=`http://localhost:8080/api/listings/${filters["category"]}`

    return this.httpClient.get<{}>(url,{params}); */
    
  }

  createListing(data:any){
    let url=`http://localhost:8080/api/listings/${data["category"]}`

    //let url=`https://dietiestates25-875570932601.europe-west8.run.app/api/listings/${data["category"]}`

    console.log("sono createLisitng e mi è arrivato questo: ",data)

    const otherFeatures: { [key: string]: string } = {};  // Mappa vuota per le altre caratteristiche

    // Popola la mappa con gli elementi dell'array `otherFeatures`
    for (let i = 0; i < data.otherFeatures.length; i++) {
      otherFeatures[(i + 1).toString()] = data.otherFeatures[i];
    }

    return this.httpClient.post<{}>(url,{
      title: data.title,
      price: data.price,
      description: data.description,
      squareMeters: data.squareMeters,
      listingType:data.listingType,
      locationDto:{
        region:data.locationDto.region,
        city:data.locationDto.city,
        address:data.locationDto.address,
        longitude:data.locationDto.longitude,
        latitude:data.locationDto.latitude
      },
      nRooms:data.nRooms,
      nBathrooms:data.nBathrooms,
      floor:data.floor,
      energyClass:data.energyClass,
      otherFeatures:data.otherFeatures ,
      photos:data.photos,
      elevator:data.elevator
    })
  }


  createAgent(data:any){
    let agencyId=this.authService.getAgencyId();
    let url=`http://localhost:8080/api/agencies/${agencyId}/agents`

    //let url=`https://dietiestates25-875570932601.europe-west8.run.app/api/agencies/${agencyId}/agents`

    console.log("sono createAgent e mi è arrivato questo: ",data)
    return this.httpClient.post<{}>(url,data)
  }

  




}
