import { Injectable } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient:HttpClient) { }

  registerAdmin(data:{
    firstName:string,
    lastName:string,
    dateOfBirth:string,
    email:string,
    password:string,
    ragioneSociale:string,
    partitaIva:string
  }){
    let url="http://localhost:8080/api/agencies"

    //let url="https://dietiestates25-875570932601.europe-west8.run.app/api/agencies"

    console.log("register: ",data)

    this.httpClient.post<{}>(url,{
      firstName : data.firstName,
      lastName : data.lastName,
      email : data.email,
      dob : data.dateOfBirth,
      tempPassword : data.password,
      ragioneSociale : data.ragioneSociale,
      partitaIva : data.partitaIva
    }).subscribe(data=>{
      console.log(data)
    })

  }

  loginAdmin(data:{
    email:string,
    password:string
  }){
    let url="http://localhost:8080/api/auth/login"

    //let url="https://dietiestates25-875570932601.europe-west8.run.app/api/auth/login"

   return this.httpClient.post<{
    token:string,
    email:string,
    id:string
   }>(url,{
      email : data.email,
      password : data.password,
    })

  }

  getToken():string|null{
    return localStorage.getItem("token")
  }

  
  getUserId():string|null{
    return localStorage.getItem("id")
  }

  getAgencyId():string|null{
    return localStorage.getItem("agencyId")
  }

  getAgency(userId:string){
    let url="http://localhost:8080/api/agencies"

    //let url="https://dietiestates25-875570932601.europe-west8.run.app/api/agencies"
    let params = new HttpParams().set('userId', userId);

    return this.httpClient.get<{
      ragioneSociale:string,
      partitaIva:string,
      id:string
     }>(url,{params})
  }

  isUserLoggedIn(){
    return (localStorage.getItem("token") != null)
  }

  
}
