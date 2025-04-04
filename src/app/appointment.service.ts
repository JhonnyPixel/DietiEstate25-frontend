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

  createISODateTime(date: Date, hourRange: string): string {

    console.log("creo ISOTIME ",date,hourRange)
    // Estraggo la prima ora dalla fascia oraria (es: "08-10" → "08")
    const hour = hourRange.split('-')[0];
  
    // Creo un nuovo oggetto Date basato sulla data dell'utente
    const dateTime = new Date(date);
    
    // Imposto l'ora e i minuti a 00
    dateTime.setHours(parseInt(hour, 10), 0, 0, 0);
  
    // Converto in stringa ISO 8601 (UTC)
    return dateTime.toISOString();
  }
}
