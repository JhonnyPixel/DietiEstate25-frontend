import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

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

    // simulating an HTTP request
        return new Observable((observer:any) => {
          setTimeout(() => {
            observer.next(this.events);
            observer.complete();
            }, 200);
        });
 
    /* let url=`http://localhost:8080/api/visits`

    const id=this.authService.getUserId();

    let params = new HttpParams().set('agentId', id!);
    params=params.set('start', from.toString());
    params=params.set('end', to.toString());


    return this.httpClient.get(url); */
  }

  createRequest(data:any){
    let url=`http://localhost:8080/api/visit-requests`

    return this.httpClient.post(url,data);
    
  }
}
