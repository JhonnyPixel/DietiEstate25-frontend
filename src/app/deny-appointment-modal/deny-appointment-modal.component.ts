import { Component, Output,EventEmitter } from '@angular/core';

import { FormsModule } from '@angular/forms';

import { NgClass } from '@angular/common';

@Component({
  selector: 'app-deny-appointment-modal',
  imports: [FormsModule,NgClass],
  templateUrl: './deny-appointment-modal.component.html',
  styleUrl: './deny-appointment-modal.component.scss'
})
export class DenyAppointmentModalComponent {

  @Output() onModalClose = new EventEmitter<void>();
  

  denyDescription:string=''

  closeModal(){
    this.onModalClose.emit()
  }

  submitDeny(){
    console.log("denied",this.denyDescription)
    this.closeModal()
  }



}
