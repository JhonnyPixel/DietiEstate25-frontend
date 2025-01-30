import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SearchComponent } from './search/search.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { ListingViewComponent } from './listing-view/listing-view.component';

export const routes: Routes = [
    {
        path:"login",
        title:"Login",
        component:LoginComponent
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
        path:"listing",
        title:"Annuncio",
        component:ListingViewComponent
    }
];
