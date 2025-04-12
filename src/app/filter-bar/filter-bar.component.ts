import { Component,EventEmitter,Input,Output } from '@angular/core';
import { FormBuilder, FormGroup,ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-filter-bar',
  imports:[ReactiveFormsModule],
  templateUrl: './filter-bar.component.html',
  styleUrl: './filter-bar.component.scss'
})
export class FilterBarComponent {

  @Output() filtersApplied = new EventEmitter<any>();
  @Input() externalFilters:any=null;

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
      energyClassMin: [null],
      region:[null],
      city: [null],
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

  ngOnInit(){
    if(this.externalFilters){
      this.setFiltersFromExternal(this.externalFilters);
    }
  }

  applyFilter() {
    const filters = this.filterForm.value;
    /* delete filters.centerLongitude;
    delete filters.centerLatitude;
    delete filters.radius; */
    console.log("filters in filter bar:",filters);
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

  setFiltersFromExternal(values: any) {
    // Se è presente una categoria nei valori in ingresso, aggiornala prima
    if (values.category && this.filterConfig[values.category]) {
      this.selectedCategory = values.category;
      this.availableFilters = this.filterConfig[this.selectedCategory];
      this.filterForm.controls['category'].setValue(values.category);
      this.resetFilters();
    }
  
    // Imposta i valori nei controlli esistenti, solo se fanno parte dei filtri disponibili
    Object.keys(values).forEach(key => {
      if (this.filterForm.controls[key] && this.availableFilters.includes(key)) {
        this.filterForm.controls[key].setValue(values[key]);
      }
    });
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