import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { WeatherForecast, WeatherCondition} from '../weather.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSun,faCloudSun,faCloud,faCloudRain,faCloudBolt } from '@fortawesome/free-solid-svg-icons';
import { FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule } from '@angular/forms'


@Component({
  selector: 'app-appointment-modal',
  imports: [DatePipe,FontAwesomeModule,FormsModule,ReactiveFormsModule],
  templateUrl: './appointment-modal.component.html',
  styleUrl: './appointment-modal.component.scss'
})
export class AppointmentModalComponent implements OnInit {

  constructor(private fb: FormBuilder) {}

  availableDate:Date[]=[new Date(2025,2,15),new Date(2025,2,18)];
  availableHours:string[]=[
    "08-10",
    "10-12",
    "12-14",
    "14-16",
    "16-18",
    "18-20"
  ];

  @Input() forecast:WeatherForecast[]=[];

  @Output() close = new EventEmitter<void>();

  appointmentForm: FormGroup|undefined;

  ngOnInit() {
    this.availableDate = this.generateDates(16);

    this.appointmentForm = this.fb.group({
      selectedDates: this.fb.array([]),
      selectedHours: this.fb.array([])
    });
  }
  
  generateDates(days: number): Date[] {
    const dates: Date[] = [];
    const today = new Date(); // Data di oggi
  
    for (let i = 0; i < days; i++) {
      const newDate = new Date(today); // Clona la data di oggi
      newDate.setDate(today.getDate() + i); // Aggiunge i giorni
      dates.push(newDate);
    }
  
    return dates;
  }

  getWeatherIcon(condition: WeatherCondition){
    switch(condition) {
      case WeatherCondition.SUNNY:
        return faSun;
      case WeatherCondition.PARTLY_CLOUDY:
        return faCloudSun;
      case WeatherCondition.CLOUDY:
        return faCloud;
      case WeatherCondition.RAIN:
        return faCloudRain;
      case WeatherCondition.THUNDERSTORM:
        return faCloudBolt;
      default:
        return 'help';
    }
  }

  getIconColor(condition: WeatherCondition){
    switch(condition) {
      case WeatherCondition.SUNNY:
        return "#f3d142";
      case WeatherCondition.PARTLY_CLOUDY:
        return "gray";
      case WeatherCondition.CLOUDY:
        return "gray";
      case WeatherCondition.RAIN:
        return "blue";
      case WeatherCondition.THUNDERSTORM:
        return "blue";
      default:
        return 'help';
    }
  }

  // Metodi per gestire i checkbox delle date
  onDateChange(event: any, date: Date) {
    const selectedDates = this.appointmentForm!.get('selectedDates') as FormArray;
    
    if (event.target.checked) {
      selectedDates.push(this.fb.control(date));
    } else {
      const index = selectedDates.controls.findIndex(ctrl => 
        new Date(ctrl.value).getTime() === date.getTime());
      if (index >= 0) {
        selectedDates.removeAt(index);
      }
    }
  }
  
  // Metodi per gestire i checkbox delle ore
  onHourChange(event: any, hour: string) {
    const selectedHours = this.appointmentForm!.get('selectedHours') as FormArray;
    
    if (event.target.checked) {
      selectedHours.push(this.fb.control(hour));
    } else {
      const index = selectedHours.controls.findIndex(ctrl => ctrl.value === hour);
      if (index >= 0) {
        selectedHours.removeAt(index);
      }
    }
  }

  

  onSubmit(){
    console.log('Form value:', this.appointmentForm!.value);
    // Qui puoi gestire i valori del form come necessario
    // Ad esempio, inviare i dati a un servizio
    // this.bookingService.saveAppointment(formValue);
  }


  

  closeModal(){
    this.close.emit();
  }

}
