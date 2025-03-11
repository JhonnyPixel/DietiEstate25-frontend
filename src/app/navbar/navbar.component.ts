import { Component, EventEmitter, Output } from '@angular/core';
import { NotificationPanelComponent } from '../notification-panel/notification-panel.component';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-navbar',
  imports: [NotificationPanelComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  constructor(public authService:AuthService){}

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
