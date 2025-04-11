import { ChangeDetectorRef, Component } from '@angular/core';
import { NgImageSliderModule } from 'ng-image-slider'
import { AppointmentModalComponent } from '../appointment-modal/appointment-modal.component';
import { WeatherService,WeatherForecast, WeatherCondition} from '../weather.service';
import { ActivatedRoute } from '@angular/router';
import { RestBackendService } from '../rest-backend.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faElevator,faLightbulb,faStar,faBuilding } from '@fortawesome/free-solid-svg-icons';

import { StarRatingModule } from 'angular-star-rating';

import { FormsModule } from '@angular/forms';

import { RatingService } from '../rating.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-listing-view',
  imports: [NgImageSliderModule,NgClass,AppointmentModalComponent,FontAwesomeModule,StarRatingModule,FormsModule],
  templateUrl: './listing-view.component.html',
  styleUrl: './listing-view.component.scss'
})
export class ListingViewComponent {

   constructor(private cdr: ChangeDetectorRef,private toaster:ToastrService ,private weather:WeatherService,private rating:RatingService,private route: ActivatedRoute,private auth:AuthService,private rest:RestBackendService){

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

   imageObject: Array<object> = [];

   isFavorite:boolean=false

   faElevator=faElevator
   faLightbulb=faLightbulb
   faStar=faStar
   faBuilding=faBuilding

  userRating: number = 0; // Memorizza il voto dell'utente
  userComment: string = ''; // Memorizza il commento
  showReviewForm: boolean = false; // Controlla la visibilità del dropdown

  ngOnInit(): void {

   
    this.route.params.subscribe(params => {
      const type= params['type']
      const listingId = params['id'];
      // Se non hai già i dati dal router state, caricali dal servizio
      if (!this.listing) {
        this.loadListingDetails(type,listingId);
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

      this.setPhotos()
      
  }

imageOption:Object={width: '100%', height: '300px', space: 4}

/* imageObject: Array<object> = [{
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
}]; */


isModalOpen:boolean = false;
openModal() {
  if(!this.auth.isUserLoggedIn()){
    this.toaster.info('Devi essere loggato per usufruire di questa funzionalità','Info')
    return
  }
  this.isModalOpen = true;
}

setPhotos(){
  //setto le immagini per lo slider
  if(this.listing.photos.length>0){
    for(let photo of this.listing.photos){
      this.imageObject=this.imageObject.concat({
        image: photo,
        thumbImage: photo,
        /* alt: 'alt of image' */
      });
    }
  }
  else{
    this.imageObject=this.imageObject.concat(
      {
      image: 'img/house-placeholder.jpg',
      thumbImage: 'img/house-placeholder.jpg',
      alt: 'placeholder'
    });
  }
}

closeModal() {
  this.isModalOpen = false;
}

loadListingDetails(type:string,id: string): void {

  this.rest.getListing(type,id).subscribe(
    data=>{
      console.log("data: ",data)
      this.listing=data

      this.setPhotos()
    }
  )
}

toggleFavorite(){
  if(this.isFavorite){

    this.rest.removeStarredListing(this.listing.id).subscribe(
      data=>{
        console.log("data:",data)
        this.isFavorite=false
      }
    )

  }else{

    this.rest.addStarredListing(this.listing.id).subscribe(
      data=>{
        console.log("data:",data)
        this.isFavorite=true
      }
    )

  }
  
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

  

  toggleReviewForm() {
    this.showReviewForm = !this.showReviewForm; // Alterna la visibilità
  }

  onRatingChange(newRating: any) {
    console.log(newRating)
    this.userRating = newRating.rating; // Aggiorna il rating selezionato
  }

  submitReview() {

    if (!this.auth.isUserLoggedIn()){
      this.toaster.info('Devi essere loggato per usufruire di questa funzionalità','Info')
      return;
    }

    if (!this.userComment.trim()) {
      this.toaster.error('Per favore, inserisci un commento.','Recensione vuota')
      return;
    }

    // Qui puoi inviare il rating e il commento al backend
    console.log('Recensione inviata:', {
      rating: this.userRating,
      comment: this.userComment
    });

    this.rating.createAgentRating(this.listing.agent.id,this.userRating,this.userComment)
      .subscribe(data=>{
        console.log("dati recensioni",data);
        
        this.listing.agent.numOfReviews = this.listing.agent.numOfReviews + 1;
        this.listing.agent.averageReview = this.listing.agent.averageReview + (this.userRating/this.listing.agent.numOfReviews)

        console.log("nuovo agent",this.listing.agent)

        this.toaster.success('Grazie per il feedback.','Recensione inviata')

        this.userRating = 0;  // Resetta il form dopo l'invio

      },
    err=>{
      console.error(err);
      if(err.status===403){
        this.toaster.error('Solo gli utenti possono recensire gli agenti.','Account limitato')
      }else{
        this.toaster.error('Impossibile inviare la recensione al momento.','Errore nell invio')
      }
      
    })


    // Resetta il form dopo l'invio
    this.userComment = '';
    this.showReviewForm = false; // Chiude il dropdown dopo l'invio
  }

}
