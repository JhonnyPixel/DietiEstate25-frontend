import { Injectable } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private logoutSubject = new Subject<void>();
  logout$ = this.logoutSubject.asObservable(); // Observable pubblico da ascoltare

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

    return this.httpClient.post<{}>(url,{
      firstName : data.firstName,
      lastName : data.lastName,
      email : data.email,
      dob : data.dateOfBirth,
      tempPassword : data.password,
      ragioneSociale : data.ragioneSociale,
      partitaIva : data.partitaIva
    })

  }

  registerUser(data:{
    firstName:string,
    lastName:string,
    dateOfBirth:string,
    email:string,
    password:string
  }){
    let url="http://localhost:8080/api/customers"

    //let url="https://dietiestates25-875570932601.europe-west8.run.app/api/agencies"

    console.log("register: ",data)

    return this.httpClient.post<{}>(url,{
      firstName : data.firstName,
      lastName : data.lastName,
      email : data.email,
      dob : data.dateOfBirth,
      password : data.password
    })

  }

  login(data:{
    email:string,
    password:string
  }){
    let url="http://localhost:8080/api/auth/login"

    //let url="https://dietiestates25-875570932601.europe-west8.run.app/api/auth/login"

   return this.httpClient.post<{
    token:string,
    email:string,
    id:string,
    role:string
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

  getPartitaIva(){
    return localStorage.getItem("partitaIva");
  }

  getRagioneSociale(){
    return localStorage.getItem("ragioneSociale");
  }

  getEmail():string|null{
    return localStorage.getItem("email")
  }

  getRole():string|null{
    return localStorage.getItem("role")
  }

  isCustomer():boolean{
    const role=this.getRole()
    return role === "CUSTOMER"
  }

  isAgent():boolean{
    const role=this.getRole()
    return role === "AGENT"
  }

  isAdmin():boolean{
    const role=this.getRole()
    return role === "ADMIN"
  }

  isManager():boolean{
    const role=this.getRole()
    return role === "MANAGER"
  }

  setProfile(fields:any){
    Object.keys(fields).forEach(key => {
      localStorage.setItem(key,fields[key])
    });
  }

 /*  getUserData():string|null{
    return localStorage.getItem("userData")
  } */

  logout(){
    localStorage.clear()

    this.logoutSubject.next();
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
