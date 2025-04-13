import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { environment } from '../enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class VisitBackendService {

  constructor(private httpClient:HttpClient,private authService:AuthService) { }

  events=[
    {
      id: "asf7a8sfsaf24",
      customerId: "asd799fasf",
      listingId: "asfajhsf78a",
      dateTime: "2025-03-14T10:13:18.674Z"
    },
    {
      id: "nbvjkanis678",
      customerId: "asfasf688a",
      listingId: "bnjasnify880",
      dateTime: "2025-03-18T15:13:18.674Z"
    }
  ]

  getVisits(from:string,to:string){

    
 
    let url=`${environment.apiUrl}/visits`

    const id=this.authService.getUserId();

    console.log("ciaoo",id);

    let params = new HttpParams().set('agentId', id!);
    params=params.set('start', from.toString());
    params=params.set('end', to.toString());


    return this.httpClient.get(url,{params});
  }

  createRequest(data:any){
    let url=`${environment.apiUrl}/visit-requests`

    return this.httpClient.post(url,data);
    
  }
}
