import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RestBackendService } from '../rest-backend.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { timeStamp } from 'console';

@Component({
  selector: 'app-starred-listings',
  imports: [RouterLink,NavbarComponent],
  templateUrl: './starred-listings.component.html',
  styleUrl: './starred-listings.component.scss'
})
export class StarredListingsComponent {

  listings:any

  constructor(private rest:RestBackendService){}

  ngOnInit(){
    this.rest.getStarredListings().subscribe(
      data=>{
        console.log("dati: ",data)
        this.listings=data;
      }
    )
  }

  getListingSlug(category:string){
    const categorySlug = {
      HOUSE: 'houses',
      BUILDING: 'buildings',
      GARAGE: 'garages',
      LAND: 'lands'
    }[category as 'HOUSE' | 'BUILDING' | 'GARAGE' | 'LAND'];

    console.log(categorySlug)

    return categorySlug;
  }

  deleteListing(id:string){
    this.rest.removeStarredListing(id).subscribe(
      data=>{
        console.log("dati:",data)

        this.listings=this.listings.filter((item:any)=>{return item.id!==id})
      }
    )
  }



}
