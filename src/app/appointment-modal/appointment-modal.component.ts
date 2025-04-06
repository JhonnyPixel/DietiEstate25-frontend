

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { WeatherForecast, WeatherCondition} from '../weather.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSun, faCloudSun, faCloud, faCloudRain, faCloudBolt } from '@fortawesome/free-solid-svg-icons';
import { FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule } from '@angular/forms';
import { VisitBackendService } from '../visit-backend.service';

import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-appointment-modal',
  imports: [DatePipe, FontAwesomeModule, FormsModule, ReactiveFormsModule],
  templateUrl: './appointment-modal.component.html',
  styleUrl: './appointment-modal.component.scss'
})
export class AppointmentModalComponent implements OnInit {

  constructor(private fb: FormBuilder,private visitService:VisitBackendService,private toaster:ToastrService) {}

  availableDate: Date[] = [];
  availableHours: string[] = [
    "08-10",
    "10-12",
    "12-14",
    "14-16",
    "16-18",
    "18-20"
  ];

  // Per tenere traccia del giorno selezionato da visualizzare
  selectedDateIndex: number | null = null;

  @Input() listingId: string = '';
  @Input() forecast: WeatherForecast[] = [];
  @Output() close = new EventEmitter<void>();

  appointmentForm: FormGroup | undefined;

  ngOnInit() {
    this.availableDate = this.generateDates(16);
    
    // Inizializza il form con una struttura diversa
    this.appointmentForm = this.fb.group({
      appointments: this.fb.array([])
    });
  }
  
  generateDates(days: number): Date[] {
    const dates: Date[] = [];
    const today = new Date();
  
    for (let i = 0; i < days; i++) {
      const newDate = new Date(today);
      newDate.setDate(today.getDate() + i);
      dates.push(newDate);
    }
  
    return dates;
  }

  getWeatherIcon(condition: WeatherCondition) {
    switch(condition) {
      case WeatherCondition.SUNNY: return faSun;
      case WeatherCondition.PARTLY_CLOUDY: return faCloudSun;
      case WeatherCondition.CLOUDY: return faCloud;
      case WeatherCondition.RAIN: return faCloudRain;
      case WeatherCondition.THUNDERSTORM: return faCloudBolt;
      default: return 'help';
    }
  }

  getIconColor(condition: WeatherCondition) {
    switch(condition) {
      case WeatherCondition.SUNNY: return "#f3d142";
      case WeatherCondition.PARTLY_CLOUDY: return "gray";
      case WeatherCondition.CLOUDY: return "gray";
      case WeatherCondition.RAIN: return "blue";
      case WeatherCondition.THUNDERSTORM: return "blue";
      default: return 'help';
    }
  }

  // Verifica se una data è selezionata
  isDateSelected(date: Date): boolean {
    return this.getAppointmentIndex(date) > -1;
  }

  // Trova l'indice di un appuntamento in base alla data
  getAppointmentIndex(date: Date): number {
    const appointments = this.getAppointmentsArray();
    return appointments.controls.findIndex(ctrl => {
      const ctrlDate = new Date(ctrl.get('date')?.value);
      return ctrlDate.getTime() === date.getTime();
    });
  }

  // Ottieni l'array degli appuntamenti
  getAppointmentsArray(): FormArray {
    return this.appointmentForm?.get('appointments') as FormArray;
  }

  // Gestisce il click su una data
  onDateClick(date: Date, index: number) {
    const appointments = this.getAppointmentsArray();
    const dateIndex = this.getAppointmentIndex(date);
    
    // Se la data non è ancora selezionata, la aggiungiamo
    if (dateIndex === -1) {
      appointments.push(this.createAppointmentFormGroup(date));
    }
    
    // Imposta l'indice della data selezionata per mostrare le fasce orarie
    this.selectedDateIndex = index;
  }
  
  // Crea un nuovo FormGroup per un appuntamento
  createAppointmentFormGroup(date: Date): FormGroup {
    return this.fb.group({
      date: date,
      hours: this.fb.array([])
    });
  }
  
  // Ottiene le ore selezionate per la data corrente
  getSelectedHoursForCurrentDate(): FormArray {
    if (this.selectedDateIndex === null) return this.fb.array([]);
    
    const date = this.availableDate[this.selectedDateIndex];
    const appointmentIndex = this.getAppointmentIndex(date);
    
    if (appointmentIndex === -1) return this.fb.array([]);
    
    return this.getAppointmentsArray().at(appointmentIndex).get('hours') as FormArray;
  }

  // Verifica se una fascia oraria è selezionata per la data corrente
  isHourSelectedForCurrentDate(hour: string): boolean {
    if (this.selectedDateIndex === null) return false;
    
    const hoursArray = this.getSelectedHoursForCurrentDate();
    return hoursArray.controls.some(ctrl => ctrl.value === hour);
  }

  // Gestisce la selezione di una fascia oraria
  onHourChange(event: any, hour: string) {
    if (this.selectedDateIndex === null) return;
    
    const hoursArray = this.getSelectedHoursForCurrentDate();
    
    if (event.target.checked) {
      hoursArray.push(this.fb.control(hour));
    } else {
      const index = hoursArray.controls.findIndex(ctrl => ctrl.value === hour);
      if (index >= 0) {
        hoursArray.removeAt(index);
      }
    }
  }

  // Verifica se almeno un'ora è stata selezionata per la data corrente
  hasSelectedHours(date: Date): boolean {
    const appointmentIndex = this.getAppointmentIndex(date);
    if (appointmentIndex === -1) return false;
    
    const hoursArray = this.getAppointmentsArray().at(appointmentIndex).get('hours') as FormArray;
    return hoursArray.length > 0;
  }

  // Rimuove una data e le sue fasce orarie
  removeDate(date: Date) {
    const index = this.getAppointmentIndex(date);
    if (index > -1) {
      this.getAppointmentsArray().removeAt(index);
      if (this.selectedDateIndex !== null && this.availableDate[this.selectedDateIndex].getTime() === date.getTime()) {
        this.selectedDateIndex = null;
      }
    }
  }

onSubmit() {
      // Filtra gli appuntamenti senza ore selezionate
  const validAppointments = this.getAppointmentsArray().controls
  .filter(appointment => (appointment.get('hours') as FormArray).length > 0);

if (validAppointments.length === 0) {
  console.log('Nessun appuntamento valido selezionato');
  this.toaster.error('Seleziona una data e un orario per favore','Nessuna data valida selezionata')
  return;
}

// Trasforma i dati nel formato richiesto dall'API
const requestData = {
  listingId: this.listingId,
  availabilities: validAppointments.map(appointment => {
    const date = new Date(appointment.get('date')?.value);
    // Formatta la data come YYYY-MM-DD
    const formattedDate = date.toISOString().split('T')[0];
    
    // Ottieni le fasce orarie selezionate
    const hoursArray = appointment.get('hours') as FormArray;
    const timeSlots = hoursArray.controls.map(ctrl => ctrl.value);
    
    return {
      day: formattedDate,
      timeSlots: timeSlots
    };
  })
};

console.log('Dati formattati per l\'invio:', requestData);

// Invia i dati al backend
  this.visitService.createRequest(requestData).subscribe(data=>{
    this.toaster.success('Richiesta inviata correttamente','Richiesta inviata')
    console.log("risultato dal backend:",data);
    this.closeModal()
  })

  } 

  closeModal() {
    this.close.emit();
  }
}