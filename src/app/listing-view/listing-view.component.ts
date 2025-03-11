import { Component } from '@angular/core';
import { NgImageSliderModule } from 'ng-image-slider'
import { AppointmentModalComponent } from '../appointment-modal/appointment-modal.component';
import { WeatherService,WeatherForecast, WeatherCondition} from '../weather.service';
import { ActivatedRoute } from '@angular/router';
import { RestBackendService } from '../rest-backend.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faElevator,faLightbulb } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-listing-view',
  imports: [NgImageSliderModule,AppointmentModalComponent,FontAwesomeModule],
  templateUrl: './listing-view.component.html',
  styleUrl: './listing-view.component.scss'
})
export class ListingViewComponent {

   constructor(private weather:WeatherService,private route: ActivatedRoute,private rest:RestBackendService){

    //cerca prima di prendere da state per ottimizzazione
      const state = window.history.state;
      const listingData = state ? state.listingData : null;
      
      if (listingData) {
        console.log('Dati ricevuti da state:', listingData);
  
        this.listing=listingData;
  
      }
   }

   listing:any;

   loading=false;

   forecasts: WeatherForecast[] = [];

   faElevator=faElevator
   faLightbulb=faLightbulb

  ngOnInit(): void {

   
    this.route.params.subscribe(params => {
      const listingId = params['id'];
      // Se non hai già i dati dal router state, caricali dal servizio
      if (!this.listing) {
        this.loadListingDetails(listingId);
      }
    });
  

    console.log("listing view");

    this.loading = true;

    this.weather.getDetailedForecast(this.listing.location.latitude,this.listing.location.longitude)
      .subscribe({
        next: (data) => {
          console.log("dati arrivati da open meteo: ",data);
          this.forecasts = data;
          this.loading = false; 
        },
        error: (err) => {
          console.log("errore da open meteo: ",err);
          this.loading = false;
        }
      });
  }

imageOption:Object={width: '100%', height: '300px', space: 4}

imageObject: Array<object> = [{
    image: 'img/apartment1.jpeg',
    thumbImage: 'img/apartment1.jpeg',
    alt: 'alt of image'
}, {
    image: 'img/apartment2.webp', // Support base64 image
    thumbImage: 'img/apartment2.webp', // Support base64 image
    alt: 'Image alt', //Optional: You can use this key if want to show image with alt
},
{
  image: 'img/apartment2.webp', // Support base64 image
  thumbImage: 'img/apartment2.webp', // Support base64 image
  alt: 'Image alt', //Optional: You can use this key if want to show image with alt
},{
  image: 'img/apartment2.webp', // Support base64 image
  thumbImage: 'img/apartment2.webp', // Support base64 image
  alt: 'Image alt', //Optional: You can use this key if want to show image with alt
},
{
  image: 'img/apartment2.webp', // Support base64 image
  thumbImage: 'img/apartment2.webp', // Support base64 image
  alt: 'Image alt', //Optional: You can use this key if want to show image with alt
}];


isModalOpen:boolean = true;
openModal() {
  this.isModalOpen = true;
}

closeModal() {
  this.isModalOpen = false;
}

loadListingDetails(id: string): void {

  //this.rest.getListing(id) //da implementare
}

/* weatherConditions = [
  WeatherCondition.SUNNY,
  WeatherCondition.PARTLY_CLOUDY,
  WeatherCondition.CLOUDY,
  WeatherCondition.RAIN,
  WeatherCondition.THUNDERSTORM
]; */

/* getWeatherIcon(condition: WeatherCondition): string {
  switch(condition) {
    case WeatherCondition.SUNNY:
      return 'wb_sunny';
    case WeatherCondition.PARTLY_CLOUDY:
      return 'partly_cloudy_day';
    case WeatherCondition.CLOUDY:
      return 'cloud';
    case WeatherCondition.RAIN:
      return 'water_drop';
    case WeatherCondition.THUNDERSTORM:
      return 'thunderstorm';
    default:
      return 'help';
  }
} */

}
