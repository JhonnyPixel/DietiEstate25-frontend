import { Component ,Input} from '@angular/core';

@Component({
  selector: 'app-result-item',
  imports: [],
  templateUrl: './result-item.component.html',
  styleUrl: './result-item.component.scss'
})
export class ResultItemComponent {

  @Input() listing:any


}
