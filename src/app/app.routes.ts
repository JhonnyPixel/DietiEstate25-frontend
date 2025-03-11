import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SearchComponent } from './search/search.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { ListingViewComponent } from './listing-view/listing-view.component';
import { LeafletMapComponent } from './leaflet-map/leaflet-map.component';
import { CreateListingComponent } from './create-listing/create-listing.component';
import { RegisterComponent } from './register/register.component';
import { CalendarViewComponent } from './calendar-view/calendar-view.component';
import { AccountListComponent } from './account-list/account-list.component';
import { AddressSearchComponent } from './address-search/address-search.component';

export const routes: Routes = [
    {
        path:"login",
        title:"Login",
        component:LoginComponent
    },
    {
        path:"register",
        title:"Register",
        component:RegisterComponent
    },
    {
        path:"search",
        title:"Search",
        component:SearchComponent
    },
    {
        path:"results",
        title:"Search Results",
        component:SearchResultsComponent
    },
    {
        path:"listing/:id",
        title:"Annuncio",
        component:ListingViewComponent
    },
    {
        path:"map",
        component:LeafletMapComponent
    },
    {
        path:"calendar",
        title:"Calendario",
        component:CalendarViewComponent
    },
    {
        path:"create",
        title:"Create Listing",
        component:CreateListingComponent
    },
    {
        path:"accounts",
        title:"Accounts",
        component:AccountListComponent
    },
    {
        path:"address",
        title:"Address",
        component:AddressSearchComponent
    }
];
