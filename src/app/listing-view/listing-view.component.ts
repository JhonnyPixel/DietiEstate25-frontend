import { Component } from '@angular/core';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { NgImageSliderModule } from 'ng-image-slider'

@Component({
  selector: 'app-listing-view',
  imports: [NgImageSliderModule],
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
}
];
}
