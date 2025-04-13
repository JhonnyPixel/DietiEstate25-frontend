import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NotificationService } from '../notification.service';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-notification-panel',
  imports: [FontAwesomeModule,DatePipe],
  templateUrl: './notification-panel.component.html',
  styleUrl: './notification-panel.component.scss'
})
export class NotificationPanelComponent implements OnInit{
 

  @Output() close= new EventEmitter<void>()
  @Output() openAppointmentSelect= new EventEmitter<any>()
  @Output() openDenyAppointmentModal= new EventEmitter<void>()
  @Output() notificationsNumbers=new EventEmitter<number>()

  notifications:any[]=[]

  constructor(private notifyService:NotificationService,private router:Router){}

  ngOnInit(): void {
    console.log("notifiche recuperate")
    this.notifyService.fetchNotifications().subscribe(
      (notifications) => {

        this.notifications=notifications

        this.notificationsNumbers.emit(notifications.length);

        console.log('Notifiche offline recuperate:', notifications.length);

        
        console.log('Notifiche offline recuperate:', notifications);
      },
      (error) => {
        console.error('Errore nel recupero delle notifiche offline:', error);
      }
    );
    //this.notifications=this.notifyService.getNotifications();
  }

  

  

  faX=faX

  openAppointmentModal(visitRequest:any) {
    this.openAppointmentSelect.emit(visitRequest)
  }

  openDenyAppointment(visitRequest:any) {
    this.openDenyAppointmentModal.emit(visitRequest)
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
