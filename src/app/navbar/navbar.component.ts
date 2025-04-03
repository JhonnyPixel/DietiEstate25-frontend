import { Component, EventEmitter, Output } from '@angular/core';
import { NotificationPanelComponent } from '../notification-panel/notification-panel.component';
import { AuthService } from '../auth.service';
import { RouterLink } from '@angular/router';
import { SelectAppointmentModalComponent } from '../select-appointment-modal/select-appointment-modal.component';
import { DenyAppointmentModalComponent } from '../deny-appointment-modal/deny-appointment-modal.component';
import { NotificationService } from '../notification.service';

@Component({
  selector: 'app-navbar',
  imports: [NotificationPanelComponent,RouterLink,SelectAppointmentModalComponent,DenyAppointmentModalComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  constructor(public authService:AuthService,private notifyService:NotificationService){
    /* notifyService.getMessages().subscribe((data)=>{
      console.log("notifica arrivata: ",data)
    })  */
  }

  isNotificationPanelOpen:boolean=false
  isAgentProfile:boolean=true

  appModal:boolean=false

  denyAppModal:boolean=false

  mockData=[{ date: new Date('2025-02-10'),hours:["10-12"]}]

  @Output() loginAdmin= new EventEmitter<boolean>()

  activateAdminLogin(){
    this.loginAdmin.emit(true)
  }

  deactiveAdminLogin(){
    this.loginAdmin.emit(false)
  }

  openAppointmentModal() {
    this.appModal=true;
  }

  openDenyAppointmentModal() {
    this.denyAppModal=true;
    console.log(this.denyAppModal)
  }

  closeDenyAppointmentModal(){
    this.denyAppModal=false;
  }

  closeAppointmentModal(){
    this.appModal=false;
  }

  toggleNotifiche(){
    this.isNotificationPanelOpen=!this.isNotificationPanelOpen
  }
}
