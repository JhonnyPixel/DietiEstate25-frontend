import { Component,EventEmitter,Output } from '@angular/core';
import { FormBuilder, FormGroup,ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-filter-bar',
  imports:[ReactiveFormsModule],
  templateUrl: './filter-bar.component.html',
  styleUrl: './filter-bar.component.scss'
})
export class FilterBarComponent {

  @Output() filtersApplied = new EventEmitter<any>();

  selectedCategory:string="houses";

  filterConfig: { [key: string]: string[] } = {
    houses: [
        'listingType',
        'priceMin',
        'priceMax',
        'energyClassMin',
        'region',
        'city',
        'squareMetersMin',
        'squareMetersMax',
        'nRoomsMin',
        'nRoomsMax',
        'nBathroomsMin',
        'nBathroomsMax',
        'floorMin',
        'floorMax'],
    buildings: [
      'listingType',
      'priceMin',
      'priceMax',
      'region',
      'city',
      'squareMetersMin',
      'squareMetersMax'],
    garages: [
      'listingType',
      'priceMin',
      'priceMax',
      'region',
      'city',
      'squareMetersMin',
      'squareMetersMax',
      'floorMin',
      'floorMax'],
    lands: [
      'listingType',
      'priceMin',
      'priceMax',
      'region',
      'city',
      'squareMetersMin',
      'squareMetersMax',
      'building']
  };

  availableFilters: string[] = this.filterConfig["houses"]; 

  filterForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      category:['houses'],
      listingType: ['BUY'],
      priceMin: [null],
      priceMax: [null],
      energyClassMin: [''],
      region:[''],
      city: [''],
      squareMetersMin: [null],
      squareMetersMax: [null],
      nRoomsMin: [null],
      nRoomsMax: [null],
      nBathroomsMin: [null],
      nBathroomsMax: [null],
      floorMin: [null],
      floorMax: [null],
      building: [false],

    });
  }

  applyFilter() {
    const filters = this.filterForm.value;
    this.filtersApplied.emit(this.filterForm.value);
  }

  getFilters(){
    const filters = this.filterForm.value;
    return filters;
  }


  onCategoryChange(event:any) {

    this.selectedCategory = event.target.value;
    console.log(event.target.value);
    this.availableFilters=this.filterConfig[this.selectedCategory]
    //this.filterForm // Reset filtri quando cambia categoria
    this.resetFilters();
  }

  resetFilters() {
    // Aggiungi logica per resettare o disabilitare i controlli non necessari
    for (const control in this.filterForm.controls) {
      if (this.filterForm.controls.hasOwnProperty(control)) {
        if (control === 'category') {
          this.filterForm.controls[control].enable();
        } else {
          const controlEnabled = this.availableFilters.includes(control);
  
          if (controlEnabled) {
            this.filterForm.controls[control].enable();
          } else {
            this.filterForm.controls[control].disable();
            // Reset dei valori dei controlli disabilitati
            //this.filterForm.controls[control].setValue(null);
          }
        }
      }
    }
  }
}