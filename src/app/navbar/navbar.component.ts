import { Component, EventEmitter, Output } from '@angular/core';
import { NotificationPanelComponent } from '../notification-panel/notification-panel.component';
import { AuthService } from '../auth.service';
import { RouterLink } from '@angular/router';

import { NotificationService } from '../notification.service';

@Component({
  selector: 'app-navbar',
  imports: [NotificationPanelComponent,RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  constructor(public authService:AuthService,private notifyService:NotificationService){
    /* notifyService.getMessages().subscribe((data)=>{
      console.log("notifica arrivata: ",data)
    }) */
  }

  isNotificationPanelOpen:boolean=false
  isAgentProfile:boolean=true

  @Output() loginAdmin= new EventEmitter<boolean>()

  activateAdminLogin(){
    this.loginAdmin.emit(true)
  }

  deactiveAdminLogin(){
    this.loginAdmin.emit(false)
  }

  toggleNotifiche(){
    this.isNotificationPanelOpen=!this.isNotificationPanelOpen
  }
}
