import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NotificationPanelComponent } from '../notification-panel/notification-panel.component';
import { AuthService } from '../auth.service';
import { RouterLink,Router } from '@angular/router';
import { SelectAppointmentModalComponent } from '../select-appointment-modal/select-appointment-modal.component';
import { DenyAppointmentModalComponent } from '../deny-appointment-modal/deny-appointment-modal.component';
import { NotificationService } from '../notification.service';
import { AppointmentService } from '../appointment.service';
import { NgClass } from '@angular/common';

import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-navbar',
  imports: [NotificationPanelComponent,NgClass,RouterLink,SelectAppointmentModalComponent,DenyAppointmentModalComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit{

  constructor(public authService:AuthService,public router:Router,private toaster:ToastrService,private notifyService:NotificationService,private appointmentService:AppointmentService){
    /* notifyService.getMessages().subscribe((data)=>{
      console.log("notifica arrivata: ",data)
    })  */


  }

  ngOnInit(): void {
    if(this.authService.isUserLoggedIn()){
    this.notifyService.getSettaggi().subscribe(
      data=>{
        console.log(data);
        this.starredListings=data.starredListings
        this.visit=data.visit
        this.recommendedListings=data.recommendedListings
      }
    )
  }
  }

  

  isNotificationPanelOpen:boolean=false
  
  notificationNumber:number=0

  appModal:boolean=false

  denyAppModal:boolean=false

  //mockData=[{ date: new Date('2025-02-10'),hours:["10-12"]}]

  visitRequest:any={};

  openAppointmentModal(visitRequest:any) {

    const converted: any[] = visitRequest.availabilities.map(({ day, timeSlots }:any) => ({
      day: new Date(day),
      timeSlots,
    }));

    this.visitRequest=visitRequest;

    this.visitRequest.availabilites=converted;


    this.appModal=true;
  }

  openDenyAppointmentModal(visitRequest:any) {

    this.visitRequest=visitRequest;
    this.denyAppModal=true;
    console.log(this.denyAppModal)
  }

  closeDenyAppointmentModal(){
    this.denyAppModal=false;
  }

  closeAppointmentModal(){
    this.appModal=false;
  }

  confirmAppointment(appointment:any){
    console.log("appuntamento confermato:",appointment)
    this.appointmentService.confirmAppointment(appointment,this.visitRequest.id).subscribe(
      data=>{
        console.log("Appuntamento creato con successo nel backend: ",data)
        this.toaster.success("appuntamento confermato al giorno selezionato")
      },
      error=>{
        
        if(error.error.status===404){
          console.log("Richiesta già gestita")
          this.toaster.error("Richiesta già gestita")
        }else{
          this.toaster.error("Impossibile inviare la richiesta al momento")
        }
      }
    )
  }

  DenyAppointment(motivation:any){
    console.log("appuntamento rifiutato:",motivation)
    this.appointmentService.denyAppointment(motivation,this.visitRequest.id).subscribe(
      data=>{
        console.log("Appuntamento rifiutato con successo nel backend: ",data)
        this.toaster.success("Rifiuto confermato con successo")
      },
      error=>{
        
        if(error.error.status===404){
          console.log("Richiesta già gestita")
          this.toaster.error("Richiesta già gestita")
        }else{
          this.toaster.error("Impossibile inviare la richiesta al momento")
        }
      }
    )
  }

  toggleNotifiche(){
    this.isNotificationPanelOpen=!this.isNotificationPanelOpen


  }

  // Variabile per gestire lo stato del dropdown
isSettingsDropdownOpen = false;

// Variabili per i tre tipi di notifiche
starredListings= true;
visit = true;
recommendedListings = true;

// Funzione per aprire/chiudere il dropdown delle impostazioni
toggleSettingsDropdown() {
  this.isSettingsDropdownOpen = !this.isSettingsDropdownOpen;
}

// Funzioni per gestire i toggle
toggleStarredListings() {
  this.starredListings
   = !this.starredListings
  ;
}

toggleVisit() {
  this.visit = !this.visit;
}

toggleRecommendedListings() {
  this.recommendedListings = !this.recommendedListings;
}

// Funzione per applicare le impostazioni
applyNotificationSettings() {
  // Implementa qui la logica per salvare le impostazioni
  console.log('Impostazioni notifiche salvate:', {
    starredListings: this.starredListings
    ,
    visit: this.visit,
    recommendedListings: this.recommendedListings
  });

  this.notifyService.modifyNotificationSettings({
    starredListings:this.starredListings,
    visit: this.visit,
    recommendedListings: this.recommendedListings
  }).subscribe(
    data=>{
      console.log("results:",data)
    }
  )
  
  // Chiudi il dropdown dopo aver applicato le impostazioni
  this.isSettingsDropdownOpen = false;
}
}
