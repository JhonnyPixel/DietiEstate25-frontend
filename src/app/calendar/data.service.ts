import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {DayPilot} from "@daypilot/daypilot-lite-angular";
import {HttpClient} from "@angular/common/http";
import CalendarColumnData = DayPilot.CalendarColumnData;
import EventData = DayPilot.EventData;

@Injectable()
export class DataService {

  events: EventData[] = [
    {
      id: 1,
      start: "2025-09-01T13:00:00",
      end: "2025-09-01T15:00:00",
      text: "Event 1",
      resource: "R1",
      barColor: "#f1c232"
    },
    {
      id: 2,
      start: "2025-09-01T10:00:00",
      end: "2025-09-01T12:00:00",
      text: "Event 2",
      resource: "R1",
      barColor: "#6fa8dc"
    },
    {
      id: 3,
      start: "2025-09-01T11:00:00",
      end: "2025-09-01T14:00:00",
      text: "Esecuzione di Florindo Zecconi",
      resource: "R2",
      barColor: "#f1c232"
    },
    {
      id: 4,
      start: "2025-09-01T10:00:00",
      end: "2025-09-01T12:00:00",
      text: "Event 4",
      resource: "R3",
      barColor: "#6aa84f"
    },
    {
      id: 5,
      start: "2025-09-01T11:00:00",
      end: "2025-09-01T14:00:00",
      text: "Event 5",
      resource: "R4",
      barColor: "#6fa8dc"
    },
    {
      id: 5,
      start: "2025-09-01T13:00:00",
      end: "2025-09-01T14:30:00",
      text: "Event 6",
      resource: "R3",
      barColor: "#cc0000"
    },

  ];

  resources: CalendarColumnData[] = [
      {name: "Resource 1", id: "R1", tags: { image: "/avatars/pat-blue.jpg" } },
      {name: "Resource 2", id: "R2", tags: { image: "/avatars/pat-orange.jpg" } },
      {name: "Resource 3", id: "R3", tags: { image: "/avatars/pat-red.jpg" } },
      {name: "Resource 4", id: "R4", tags: { image: "/avatars/pat-yellow.jpg" } },
      {name: "Resource 5", id: "R5", tags: { image: "/avatars/pat-blue.jpg" } },
      {name: "Resource 6", id: "R6", tags: { image: "/avatars/pat-orange.jpg" } },
      {name: "Resource 7", id: "R7", tags: { image: "/avatars/pat-red.jpg" } },
      {name: "Resource 8", id: "R8", tags: { image: "/avatars/pat-yellow.jpg" } }
  ];

  constructor(private http: HttpClient) {
  }

  getEvents(from: DayPilot.Date, to: DayPilot.Date): Observable<any[]> {

    console.log(from,to);

    // simulating an HTTP request
    return new Observable(observer => {
      setTimeout(() => {
        observer.next(this.events);
        observer.complete();
        }, 200);
    });

    //return this.http.get("http://localhost:8080/api/visits?start=" + from.toString() + "&end=" + to.toString());
  }

  getResources(): Observable<any[]> {

    // simulating an HTTP request
    return new Observable(observer => {
      setTimeout(() => {
        observer.next(this.resources);
        observer.complete();
      }, 200);
    });

    // return this.http.get("/api/resources");
    // return this.http.get("http://localhost:4200/api/visit"); //faccio la richiesta per avere gli eventi dal backend
  }


}
