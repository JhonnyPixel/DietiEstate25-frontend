import { Component } from '@angular/core';
import { NgImageSliderModule } from 'ng-image-slider'
import { AppointmentModalComponent } from '../appointment-modal/appointment-modal.component';

@Component({
  selector: 'app-listing-view',
  imports: [NgImageSliderModule,AppointmentModalComponent],
  templateUrl: './listing-view.component.html',
  styleUrl: './listing-view.component.scss'
})
export class ListingViewComponent {

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

}
