import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-appointment-modal',
  imports: [],
  templateUrl: './appointment-modal.component.html',
  styleUrl: './appointment-modal.component.scss'
})
export class AppointmentModalComponent {

  @Output() close = new EventEmitter<void>();

  closeModal(){
    this.close.emit();
  }

}
