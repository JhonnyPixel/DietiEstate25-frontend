import { Injectable } from '@angular/core';
import { Account } from './account-list/account-list.component';
import { HttpClient,HttpParams} from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AccountsBackendService {

  constructor(private httpClient:HttpClient,private authService:AuthService) { }

  getAgents(){

    let id=this.authService.getUserId();

    let params = new HttpParams().set('managerId', id!);

    let url=`http://localhost:8080/api/agencies/${this.authService.getAgencyId()}/agents`

    return this.httpClient.get(url,{params});
  }

  getManagers(){

    let id=this.authService.getUserId();

    let params = new HttpParams().set('managerId', id!);

    let url=`http://localhost:8080/api/agencies/${this.authService.getAgencyId()}/managers`

    return this.httpClient.get(url,{params});

  }

  //metodo per aggioranre i dati del proprio profilo
  updateUser(data:any){

    let url=''

    console.log("dati dal form:",data)

    if(this.authService.isManager() || this.authService.isAdmin()){
      url=`http://localhost:8080/api/agencies/${this.authService.getAgencyId()}/managers/${this.authService.getUserId()}`;
    }else if(this.authService.isAgent()){
      url=`http://localhost:8080/api/agencies/${this.authService.getAgencyId()}/agents/${this.authService.getUserId()}`;
    }else if(this.authService.isCustomer()){
      url=`http://localhost:8080/api/customers/${this.authService.getUserId()}`;
    }

    return this.httpClient.put(url,data);

  }

  updateManager(id:string,data:any){
    let url=`http://localhost:8080/api/agencies/${this.authService.getAgencyId()}/managers/${id}`;

    return this.httpClient.put(url,data);

  }

  updateAgent(id:string,data:any){
    let url=`http://localhost:8080/api/agencies/${this.authService.getAgencyId()}/agents/${id}`;

    return this.httpClient.put(url,data);

  }

  updateCustomer(id:string,data:any){

    let url=`http://localhost:8080/api/customers/${this.authService.getUserId()}`;

    return this.httpClient.put(url,data);

  }

  deleteAgent(id:string){

    let url=`http://localhost:8080/api/agencies/${this.authService.getAgencyId()}/agents/${id}`;

    return this.httpClient.delete(url);
  }

  deleteManager(id:string){

    let url=`http://localhost:8080/api/agencies/${this.authService.getAgencyId()}/managers/${id}`;

    return this.httpClient.delete(url);

  }

  
}
