import { Component ,Input,EventEmitter,Output} from '@angular/core';

@Component({
  selector: 'app-result-item',
  imports: [],
  templateUrl: './result-item.component.html',
  styleUrl: './result-item.component.scss'
})
export class ResultItemComponent {


  @Input() listing:any
  @Input() isActive:boolean=false
  @Output() onItemHover = new EventEmitter<string>();

  setActive() {
    this.onItemHover.emit(this.listing.id);
  }


}
