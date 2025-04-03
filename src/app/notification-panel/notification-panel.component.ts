import { Component, EventEmitter, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-notification-panel',
  imports: [FontAwesomeModule],
  templateUrl: './notification-panel.component.html',
  styleUrl: './notification-panel.component.scss'
})
export class NotificationPanelComponent {
 

  @Output() close= new EventEmitter<void>()
  @Output() openAppointmentSelect= new EventEmitter<void>()
  @Output() openDenyAppointmentModal= new EventEmitter<void>()

  

  faX=faX

  openAppointmentModal() {
    this.openAppointmentSelect.emit()
  }

  openDenyAppointment() {
    this.openDenyAppointmentModal.emit()
    console.log("openDeny")
  }


  closeNotifiche(){
    this.close.emit()
  }

}
