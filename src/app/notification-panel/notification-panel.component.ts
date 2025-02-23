import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-notification-panel',
  imports: [],
  templateUrl: './notification-panel.component.html',
  styleUrl: './notification-panel.component.scss'
})
export class NotificationPanelComponent {

  @Output() close= new EventEmitter<void>()

  closeNotifiche(){
    this.close.emit()
  }

}
