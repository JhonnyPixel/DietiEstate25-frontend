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

    console.log("sono getListings e mi è arrivatop:",filters)
    // Iteriamo sugli altri filtri e li aggiungiamo come parametri
    Object.keys(filters).forEach(key => {
      if(filters[key] !== null && filters[key] !== undefined){
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

  getListing(type:string,listingId:string){
    let url=`http://localhost:8080/api/listings/${type}/${listingId}`

    return this.httpClient.get<{}>(url);
    
  }


  getStarredListings(){
    let url=`http://localhost:8080/api/starred-listings`

    let params = new HttpParams().set('userId', this.authService.getUserId()!);
    return this.httpClient.get(url,{params});
  }

  addStarredListing(listingId:string){
    let url=`http://localhost:8080/api/starred-listings`

    let params = new HttpParams().set('userId', this.authService.getUserId()!);
    return this.httpClient.post(url,listingId,{params});
  }

  removeStarredListing(listingId:string){
    let url=`http://localhost:8080/api/starred-listings`

    let params = new HttpParams().set('userId', this.authService.getUserId()!);
    params = params.set('listingId', listingId);

    return this.httpClient.delete(url,{params});
  }




  getUserHouses(page:number=0){
    let params = new HttpParams().set('agentId', this.authService.getUserId()!);
    params= params.set('page',page); //replace all thisa lines with listinType:any when riccardo has done

    let url=`http://localhost:8080/api/listings/houses`

    return this.httpClient.get<any>(url,{params});
  }

  getUserBuildings(page:number=0){
    let params = new HttpParams().set('agentId', this.authService.getUserId()!);
    params= params.set('page',page);

    let url=`http://localhost:8080/api/listings/buildings`

    return this.httpClient.get<any>(url,{params});
  }

  getUserLands(page:number=0){
    let params = new HttpParams().set('agentId', this.authService.getUserId()!);
    params= params.set('page',page);

    let url=`http://localhost:8080/api/listings/lands`

    return this.httpClient.get<any>(url,{params});
  }

  getUserGarages(page:number=0){
    let params = new HttpParams().set('agentId', this.authService.getUserId()!);
    params= params.set('page',page);

    let url=`http://localhost:8080/api/listings/garages`

    return this.httpClient.get<any>(url,{params});
  }

  deleteHouse(id:string){

    let url=`http://localhost:8080/api/listings/houses/${id}`

    return this.httpClient.delete<any>(url);
  }

  deleteBuilding(id:string){
    let url=`http://localhost:8080/api/listings/buildings/${id}`

    return this.httpClient.delete<any>(url);
  }

  deleteLand(id:string){
    let url=`http://localhost:8080/api/listings/lands/${id}`

    return this.httpClient.delete<any>(url);
  }

  deleteGarage(id:string){
    let url=`http://localhost:8080/api/listings/garages/${id}`

    return this.httpClient.delete<any>(url);
  }


  createListing(data:any){
    /* let url=`http://localhost:8080/api/listings/${data["category"]}`

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
    }) */

      const url = `http://localhost:8080/api/listings/${data["category"]}`;
      console.log("Sono createListing e mi è arrivato questo:", data);
    
      // Costruzione dinamica del body
      const body: any = {};
    
      // Aggiungi dinamicamente tutte le proprietà tranne locationDto
      Object.keys(data).forEach(key => {
        if (key !== 'locationDto') {
          body[key] = data[key];
        }
      });
    
      // Gestione speciale per locationDto (se esiste)
      if (data.locationDto) {
        body.locationDto = {
          region: data.locationDto.region,
          city: data.locationDto.city,
          address: data.locationDto.address,
          longitude: data.locationDto.longitude,
          latitude: data.locationDto.latitude
        };
      }
    
      return this.httpClient.post<{}>(url, body);


  }

  updateListing(id: string, data: any){

    const validCategories = ["HOUSE", "BUILDING", "LAND", "GARAGE"] as const;
    type CategoryType = (typeof validCategories)[number];

    const categoryMap: Record<CategoryType, string> = {
      HOUSE: "houses",
      BUILDING: "buildings",
      LAND: "lands",
      GARAGE: "garages",
    };

  const category: string = validCategories.includes(data["category"])
  ? categoryMap[data["category"] as CategoryType]
  : "unknown";


    let url=`http://localhost:8080/api/listings/${category}/${id}`

    console.log("sono updateLisitng e mi è arrivato questo: ",data)

    const otherFeatures: { [key: string]: string } = {};  // Mappa vuota per le altre caratteristiche

    // Popola la mappa con gli elementi dell'array `otherFeatures`
    for (let i = 0; i < data.otherFeatures.length; i++) {
      otherFeatures[(i + 1).toString()] = data.otherFeatures[i];
    }

    return this.httpClient.put<{}>(url,{
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

  uploadListingImages(listingId:string,images:any[]){
    /* let url=`http://localhost:8080/api/images/listings/${listingId}`

    return this.httpClient.post(url,{
      images:images
    }) */
      const url = `http://localhost:8080/api/images/listings/${listingId}`;

      const formData = new FormData();
      images.forEach((file) => {
        formData.append('images', file); // "images" è il nome del campo accettato dal backend
      });
    
      return this.httpClient.post(url, formData); // Angular imposta automaticamente il Content-Type giusto
  }

  deleteListingImages(listingId:string,images:any[]){

    let url=`http://localhost:8080/api/images/listings/${listingId}`

    return this.httpClient.delete(url,{
      body:images
    })
  }


  createAgent(data:any){
    let agencyId=this.authService.getAgencyId();
    let url=`http://localhost:8080/api/agencies/${agencyId}/agents`

    //let url=`https://dietiestates25-875570932601.europe-west8.run.app/api/agencies/${agencyId}/agents`

    console.log("sono createAgent e mi è arrivato questo: ",data)
    return this.httpClient.post<{}>(url,data)
  }

  
  createManager(data:any){
    let agencyId=this.authService.getAgencyId();
    let url=`http://localhost:8080/api/agencies/${agencyId}/managers`

    //let url=`https://dietiestates25-875570932601.europe-west8.run.app/api/agencies/${agencyId}/agents`

    console.log("sono createAgent e mi è arrivato questo: ",data)
    return this.httpClient.post<{}>(url,data)
  }

  getAppointments(){
    return 
  }

  




}
