import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NotificationService } from '../notification.service';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notification-panel',
  imports: [FontAwesomeModule],
  templateUrl: './notification-panel.component.html',
  styleUrl: './notification-panel.component.scss'
})
export class NotificationPanelComponent implements OnInit{
 

  @Output() close= new EventEmitter<void>()
  @Output() openAppointmentSelect= new EventEmitter<any>()
  @Output() openDenyAppointmentModal= new EventEmitter<void>()

  notifications:any[]=[]

  constructor(private notifyService:NotificationService,private router:Router){}

  ngOnInit(): void {
    this.notifications=this.notifyService.getNotifications();
  }

  

  

  faX=faX

  openAppointmentModal(visitRequest:any) {
    this.openAppointmentSelect.emit(visitRequest)
  }

  openDenyAppointment() {
    this.openDenyAppointmentModal.emit()
    console.log("openDeny")
  }

  clickApartmentNotification(listing:any){
    this.router.navigate(['/listing', listing.id],{
      state:{listingData:listing}
    });
  }


  closeNotifiche(){
    this.close.emit()
  }

}
