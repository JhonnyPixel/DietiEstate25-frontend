import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup,ReactiveFormsModule } from '@angular/forms';
import { DatePipe,NgClass } from '@angular/common';

interface AppointmentSlot {
  day: Date;
  timeSlots: string[];
}

@Component({
  selector: 'app-select-appointment-modal',
  imports: [DatePipe,NgClass,ReactiveFormsModule],
  templateUrl: './select-appointment-modal.component.html',
  styleUrl: './select-appointment-modal.component.scss'
})
export class SelectAppointmentModalComponent {
  @Input() userAppointments: AppointmentSlot[] = [];
  @Output() appointmentSelected = new EventEmitter<{date: Date, hour: string}>();
  @Output() modalClosed = new EventEmitter<void>();

  agentAppointmentForm: FormGroup | null = null;
  userSelectedDates: Date[] = [];
  selectedDateIndex: number | null = null;
  selectedDate: Date | null = null;
  selectedHour: string | null = null;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.agentAppointmentForm = this.fb.group({
      selectedTimeSlot: ['']
    });

    // Estrai le date uniche dagli appuntamenti dell'utente
    this.userSelectedDates = this.userAppointments.map(slot => slot.day);
  }

  onDateClick(date: Date, index: number): void {
    this.selectedDateIndex = index;
    this.selectedDate = date;
    this.selectedHour = null; // Reset dell'ora selezionata quando si cambia data
    
    // Reset del valore del form quando si cambia data
    if (this.agentAppointmentForm) {
      this.agentAppointmentForm.get('selectedTimeSlot')?.setValue(null);
    }
  }

  isDateSelected(date: Date): boolean {
    return this.selectedDate !== null && 
           this.selectedDate.getDate() === date.getDate() && 
           this.selectedDate.getMonth() === date.getMonth() && 
           this.selectedDate.getFullYear() === date.getFullYear();
  }

  hasHoursForDate(date: Date): boolean {
    const hours = this.getHoursForDate(date);
    return hours.length > 0;
  }

  getHoursCountText(date: Date): string {
    const count = this.getHoursForDate(date).length;
    return count === 1 ? '1 fascia oraria' : `${count} fasce orarie`;
  }

  getHoursForDate(date: Date): string[] {
    const appointment = this.userAppointments.find(slot => 
      slot.day.getDate() === date.getDate() && 
      slot.day.getMonth() === date.getMonth() && 
      slot.day.getFullYear() === date.getFullYear()
    );
    
    return appointment ? appointment.timeSlots : [];
  }

  onHourSelect(hour: string): void {
    this.selectedHour = hour;
  }

  isHourSelected(hour: string): boolean {
    return this.selectedHour === hour;
  }

  onConfirmAppointment(): void {
    if (this.selectedDate && this.selectedHour) {
      this.appointmentSelected.emit({
        date: this.selectedDate,
        hour: this.selectedHour
      });
      this.closeModal();
    }
  }

  closeModal(): void {
    this.modalClosed.emit();
  }
}
