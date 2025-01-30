import { Component, Input } from '@angular/core';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { Options } from '@angular-slider/ngx-slider';

@Component({
  selector: 'app-slider',
  imports: [NgxSliderModule],
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.scss'
})
export class SliderComponent {
  @Input() value: number = 100;
  @Input() options: Options = {
    floor: 0,
    ceil: 200
  };
}
