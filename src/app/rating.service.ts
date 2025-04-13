import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class RatingService {

  constructor(private httpClient:HttpClient) { }

  getAgentRating(id:string){
/*     let url=`http://localhost:8080/api/agent-review/${id}`

    return this.httpClient.get<{}>(url); */ //decommenta quando riccardo ha fatto l endpoint

      return new Observable(observer => {
          setTimeout(() => {
            observer.next({results:"hello"});
            observer.complete();
          }, 200);
        });
  }


  createAgentRating(id:string,value:number,comment:string){

    let url=`${environment.apiUrl}/agent-review`

    return this.httpClient.post<{}>(url,{
      agentId:id,
      value:value,
      comment:comment
    })
  }

  
}
