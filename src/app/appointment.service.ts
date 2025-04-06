import { Injectable } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  constructor(private http:HttpClient) { }

  confirmAppointment(appointment:any,id:string){

    let url=`http://localhost:8080/api/visit-requests/${id}/accept`

    let convertedDateTime=this.createISODateTime(appointment.date,appointment.hour) //converti

    let params= new HttpParams().set("dateTime",convertedDateTime);

    return this.http.post(url,null,{params})

    
  }

  denyAppointment(motivation:any,id:string){

    let url=`http://localhost:8080/api/visit-requests/${id}/reject`


    return this.http.post(url,motivation)

    
  }

  createISODateTime(date: Date, hourRange: string): string {

    console.log("creo ISOTIME ", date, hourRange);

    const hour = parseInt(hourRange.split('-')[0]);
    const dateTime = new Date(date);
    dateTime.setUTCHours(hour, 0, 0, 0);

    return dateTime.toISOString();
  }
}
