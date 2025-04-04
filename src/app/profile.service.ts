import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor( private http: HttpClient,private auth:AuthService) { }

  updateUserProfile(data:any){
    return this.http.get("http://www.google.com")
  }

  getUserProfile(){

    let url="http://localhost:8080/api"

    const id=this.auth.getUserId()
    const agencyId=this.auth.getAgencyId()

    if(this.auth.isCustomer()){
      url= url + `/customers/${id}`
    }else if(this.auth.isAgent()){
       url= url + `/agencies/${agencyId}/agents/${id}`
    }else if(this.auth.isManager() || this.auth.isAdmin()){
       url= url + `/agencies/${agencyId}/managers/${id}`
    }

    return this.http.get<any>(url)
  }

}
