import { Component} from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { SliderComponent } from '../slider/slider.component';
import { NgxSliderModule, Options} from '@angular-slider/ngx-slider';


@Component({
  selector: 'app-search',
  imports: [NavbarComponent,SliderComponent,NgxSliderModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {

   value: number = 80;
   highValue:number =90; 
   options: Options = {
    floor: 0,
    ceil: 200
  };
}
