import {Component, ViewChild, AfterViewInit} from "@angular/core";
import {DayPilot, DayPilotCalendarComponent, DayPilotModule,DayPilotMonthComponent,DayPilotNavigatorComponent} from "@daypilot/daypilot-lite-angular";
import {DataService} from "./data.service";
import {forkJoin} from "rxjs";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RestBackendService } from "../rest-backend.service";
import { VisitBackendService } from "../visit-backend.service";
import EventData = DayPilot.EventData;

@Component({
  selector: 'calendar-component',
  standalone: true,
  imports:[CommonModule,FormsModule,DayPilotModule],
  template: `
  <!-- <daypilot-calendar [config]="config" #calendar></daypilot-calendar> -->
  <div class="container">
      <div class="navigator">
        <daypilot-navigator [config]="configNavigator" [events]="events" [(date)]="date" (dateChange)="changeDate($event)" #navigator></daypilot-navigator>
      </div>
      <div class="content">
        <div class="buttons">
        <button (click)="viewDay()" [class]="this.configNavigator.selectMode == 'Day' ? 'selected' : ''">Day</button>
        <button (click)="viewWeek()" [class]="this.configNavigator.selectMode == 'Week' ? 'selected' : ''">Week</button>
        <button (click)="viewMonth()" [class]="this.configNavigator.selectMode == 'Month' ? 'selected' : ''">Month</button>
        </div>

        <daypilot-calendar [config]="configDay" [events]="events" #day></daypilot-calendar>
        <daypilot-calendar [config]="configWeek" [events]="events" #week></daypilot-calendar>
        <daypilot-month [config]="configMonth" [events]="events" #month></daypilot-month>
      </div>
    </div>
  `,
  styles: [`
    .container {
      display: flex;
      flex-direction: row;
    }

    .navigator {
      margin-right: 10px;
    }

    .content {
      flex-grow: 1;
    }

    .buttons {
      margin-bottom: 10px;
      display: inline-flex;
    }

    button {
      background-color:rgb(255, 139, 31);
      color: white;
      border: 0;
      padding: .5rem 1rem;
      width: 80px;
      font-size: 15px;
      font-weight: 500;
      cursor: pointer;
      margin-right: 1px;
      transition: all 0.2s;
      box-shadow: 0 4px 6px rgba(0,0,0,0.08);
      box-sizing: border-box;
    }

    button:last-child {
      margin-right: 0;
    }

    button.selected {
      background-color: rgb(198, 109, 25);
      box-shadow: 0 3px 5px rgba(0,0,0,0.1);
    }

    button:first-child {
      border-top-left-radius: 30px;
      border-bottom-left-radius: 30px;
    }

    button:last-child {
      border-top-right-radius: 30px;
      border-bottom-right-radius: 30px;
    }

    button:hover {
      background-color: rgb(214, 117, 26);
      box-shadow: 0 5px 7px rgba(0,0,0,0.1);
    }

    button:active {
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    `]
})
export class CalendarComponent implements AfterViewInit {

  @ViewChild("day") day!: DayPilotCalendarComponent;
  @ViewChild("week") week!: DayPilotCalendarComponent;
  @ViewChild("month") month!: DayPilotMonthComponent;
  @ViewChild("navigator") nav!: DayPilotNavigatorComponent;

  events: DayPilot.EventData[] = [];

  date = DayPilot.Date.today();

  contextMenu = new DayPilot.Menu({
    items: [
      {
        text: "Delete",
        onClick: args => {
          const event = args.source;
          const dp = event.calendar;
          dp.events.remove(event);
        }
      },
      {
        text: "Edit...",
        onClick: async args => {
          const event = args.source;
          const dp = event.calendar;

          const modal = await DayPilot.Modal.prompt("Edit event text:", event.data.text);
          dp.clearSelection();
          if (!modal.result) { return; }
          event.data.text = modal.result;
          dp.events.update(event);
        }
      },
      {
        text: "-"
      },
      {
        text: "Red",
        onClick: args => {
          const event = args.source;
          const dp = event.calendar;
          event.data.backColor = "#cc0000";
          dp.events.update(event);
        }
      },
      {
        text: "Green",
        onClick: args => {
          const event = args.source;
          const dp = event.calendar;
          event.data.backColor = "#cc0000";

          dp.events.update(event);
        }
      },
      {
        text: "Blue",
        onClick: args => {
          const event = args.source;
          const dp = event.calendar;
          event.data.backColor = "#cc0000";

          dp.events.update(event);
        }
      },
      {
        text: "Yellow",
        onClick: args => {
          const event = args.source;
          const dp = event.calendar;
          event.data.backColor = "#cc0000";

          dp.events.update(event);
        }
      },

      {
        text: "Gray",
        onClick: args => {
          const event = args.source;
          const dp = event.calendar;
          event.data.backColor = "#cc0000";

          dp.events.update(event);
        }
      }
    ]
  });

  configNavigator: DayPilot.NavigatorConfig = {
    showMonths: 3,
    cellWidth: 25,
    cellHeight: 25,
    onVisibleRangeChanged: args => {
      this.loadEvents();
    }
  };

  selectTomorrow() {
    this.date = DayPilot.Date.today().addDays(1);
  }

  changeDate(date: DayPilot.Date): void {
    this.configDay.startDate = date;
    this.configWeek.startDate = date;
    this.configMonth.startDate = date;
  }

  configDay: DayPilot.CalendarConfig = {
    durationBarVisible: false,
    contextMenu: this.contextMenu,
    eventMoveHandling:"Disabled",
    eventResizeHandling:"Disabled",
    onTimeRangeSelected: this.onTimeRangeSelected.bind(this),
    onBeforeEventRender: this.onBeforeEventRender.bind(this),
    /* onEventClick: this.onEventClick.bind(this), */
  };

  configWeek: DayPilot.CalendarConfig = {
    viewType: "Week",
    durationBarVisible: false,
    contextMenu: this.contextMenu,
    eventMoveHandling:"Disabled",
    eventResizeHandling:"Disabled",
    onTimeRangeSelected: this.onTimeRangeSelected.bind(this),
    onBeforeEventRender: this.onBeforeEventRender.bind(this),
    /* onEventClick: this.onEventClick.bind(this), */
  };

  configMonth: DayPilot.MonthConfig = {
    contextMenu: this.contextMenu,
    eventBarVisible: false,
    eventMoveHandling:"Disabled",
    eventResizeHandling:"Disabled",
    onTimeRangeSelected: this.onTimeRangeSelected.bind(this),
    /* onEventClick: this.onEventClick.bind(this), */
  };

  constructor(private ds: DataService,private visitBackend:VisitBackendService) {
    this.viewWeek();
  }

  ngAfterViewInit(): void {
    this.loadEvents(); //qui carica gli eventi (per ora è simulato)
  }

  loadEvents(): void {
    const from = this.nav.control.visibleStart();
    const to = this.nav.control.visibleEnd();
   /*  this.ds.getEvents(from, to).subscribe(result => {
      this.events = result;
    }); */

    this.visitBackend.getVisits(from.toString(), to.toString()).subscribe((data:any) => {
      console.log(data);
  
      // Creiamo un array di eventi per DayPilot
      let events: EventData[] = [];
      
      // Iteriamo su ogni elemento nell'array restituito dal backend
      data.forEach((item:any, index:any) => {
        /* // Creiamo un oggetto Date dal dateTime ricevuto
        const startDate = new Date(item.dateTime);
        
        // Creiamo la data di fine aggiungendo 2 ore
        const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);
        
        // Formattiamo le date nel formato richiesto da DayPilot "YYYY-MM-DDTHH:MM:SS"
        const startDateTime = startDate.toISOString().substring(0, 19);
        const endDateTime = endDate.toISOString().substring(0, 19);
        
        // Creiamo l'evento DayPilot
        const event: EventData = {
          id: index + 1, // Oppure potresti usare item.id se è un numero
          start: startDateTime,
          end: endDateTime,
          text: `Prenotazione ${item.listingId}`,
        };
        
        events.push(event); */

      // Otteniamo la stringa datetime direttamente (senza conversione)
    const startDateTime = item.dateTime;
    
    // Per calcolare l'end time, analizziamo la stringa e aggiungiamo 2 ore
    // senza passare per oggetti Date che potrebbero causare problemi di timezone
    const startParts = startDateTime.split('T');
    const datePart = startParts[0]; // es. "2025-04-06"
    const timePart = startParts[1]; // es. "16:00:00"
    
    // Estrai ore, minuti, secondi
    const timeComponents = timePart.split(':');
    let hours = parseInt(timeComponents[0]);
    const minutes = timeComponents[1];
    const seconds = timeComponents[2];
    
    // Aggiungi 2 ore
    hours = (hours + 2) % 24;
    
    // Costruisci la nuova stringa di fine
    // Assicuriamoci che l'ora abbia sempre due cifre
    const formattedHours = hours.toString().padStart(2, '0');
    const endDateTime = `${datePart}T${formattedHours}:${minutes}:${seconds}`;
    
    // Creiamo l'evento DayPilot
    const event: EventData = {
      id: index + 1, // Oppure potresti usare item.id se è un numero
      start: startDateTime,
      end: endDateTime,
      text: `Visita per ${item.listing.title}`,
      // Eventuali altre proprietà dell'evento...
      tags: {
        listingImageUrl: item.listing.photos && item.listing.photos.length > 0 
                        ? item.listing.photos[0].url 
                        : '/img/house-placeholder.svg' // Immagine predefinita
      }
    };
    
    events.push(event);
      });
      
      // Ora events contiene tutti gli eventi nel formato richiesto da DayPilot
      console.log(events);
      
      // Qui puoi aggiungere il codice per aggiornare il calendario con gli eventi
      // Ad esempio: this.calendar.update({events: events});
      this.events=events;
    });
   
  }

  // Funzione per generare un colore casuale
getRandomColor(): string {
  const colors = ["#f1c232", "#6fa8dc", "#6aa84f", "#cc0000", "#9fc5e8", "#d5a6bd"];
  return colors[Math.floor(Math.random() * colors.length)];
}

  viewDay():void {
    this.configNavigator.selectMode = "Day";
    this.configDay.visible = true;
    this.configWeek.visible = false;
    this.configMonth.visible = false;
  }

  viewWeek():void {
    this.configNavigator.selectMode = "Week";
    this.configDay.visible = false;
    this.configWeek.visible = true;
    this.configMonth.visible = false;
  }

  viewMonth():void {
    this.configNavigator.selectMode = "Month";
    this.configDay.visible = false;
    this.configWeek.visible = false;
    this.configMonth.visible = true;
  }

  onBeforeEventRender(args: any) {
      const dp = args.control;
      args.data.areas = [
        {
          top: 3,
          right: 3,
          width: 20,
          height: 20,
          symbol: "assets/icons/daypilot.svg#minichevron-down-2",
          fontColor: "#fff",
          toolTip: "Show context menu",
          action: "ContextMenu",
        },
        {
          top: 3,
          right: 25,
          width: 20,
          height: 20,
          symbol: "assets/icons/daypilot.svg#x-circle",
          fontColor: "#fff",
          action: "None",
          toolTip: "Delete event",
          onClick: async (args: any)   => {
            dp.events.remove(args.source);
          }
        }
      ];

      const imageUrl = args.data.tags?.listingImageUrl || `https://picsum.photos/36/36?random=${args.data.id}`;

      args.data.areas.push({
        bottom: 5,
        left: 5,
        width: 36,
        height: 36,
        action: "None",
        image: imageUrl,
        style: "border-radius: 50%; border: 2px solid #fff; overflow: hidden;",
      });
  }

  async onTimeRangeSelected(args: any) {
    const modal = await DayPilot.Modal.prompt("Create a new event:", "Event 1");
    const dp = args.control;
    dp.clearSelection();
    if (!modal.result) { return; }
    dp.events.add(new DayPilot.Event({
      start: args.start,
      end: args.end,
      id: DayPilot.guid(),
      text: modal.result
    }));
  }

  /* async onEventClick(args: any) {
    const form = [
      {name: "Text", id: "text"},
      {name: "Start", id: "start", dateFormat: "MM/dd/yyyy", type: "datetime"},
      {name: "End", id: "end", dateFormat: "MM/dd/yyyy", type: "datetime"},
      {name: "Color", id: "backColor", type: "select", options: this.ds.getColors()},
    ];

    const data = args.e.data;

    const modal = await DayPilot.Modal.form(form, data);

    if (modal.canceled) {
      return;
    }

    const dp = args.control;

    dp.events.update(modal.result);
  } */

}

