import { Component } from '@angular/core';
import { CalendarComponent } from '../calendar/calendar.component';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-calendar-view',
  imports: [CalendarComponent,NavbarComponent],
  templateUrl: './calendar-view.component.html',
  styleUrl: './calendar-view.component.scss'
})
export class CalendarViewComponent {

}
