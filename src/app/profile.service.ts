import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

import { environment } from '../enviroments/enviroment';


@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor( private http: HttpClient,private auth:AuthService) { }

  updateUserProfile(data:any){
    return this.http.get("http://www.google.com")
  }
  

  getUserProfile(){

    let url=environment.apiUrl

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

  uploadProfilePic(image:any,userId:string=''){
  
   if(userId === '' ){
    userId=this.auth.getUserId()!
   }

      const url = `${environment.apiUrl}/images/users/${userId}`;

      const formData = new FormData();
      formData.append('file', image); 

      return this.http.post(url, formData,{ responseType: 'text' });
  }

  deleteProfilePic(userId:string=''){

    if(userId === '' ){
      userId=this.auth.getUserId()!
    }

    const url = `${environment.apiUrl}/images/users/${userId}`;

    return this.http.delete(url)
  }

}
