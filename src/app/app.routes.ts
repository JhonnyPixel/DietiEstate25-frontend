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
import { MylistingsComponent } from './mylistings/mylistings.component';
import { ProfileComponent } from './profile/profile.component';
import { authorizationGuard } from './authorization.guard';
import { agentRoleGuard } from './agent-role.guard';
import { managerRoleGuard } from './manager-role.guard';
import { StarredListingsComponent } from './starred-listings/starred-listings.component';

export const routes: Routes = [
    {   
        path: '',
        redirectTo: 'search',
        pathMatch: 'full' 
    },
    {
        path:"login",
        title:"Login",
        component:LoginComponent
    },
    {
        path:"register/:type",
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
        path:"listing/:type/:id",
        title:"Annuncio",
        component:ListingViewComponent
    },
    {
        path:"calendar",
        title:"Calendario",
        component:CalendarViewComponent,
        canActivate:[authorizationGuard,agentRoleGuard]
    },
    {
        path:"create",
        title:"Create Listing",
        component:CreateListingComponent,
        canActivate:[authorizationGuard,agentRoleGuard]
    },
    {
        path:"accounts",
        title:"Accounts",
        component:AccountListComponent,
        canActivate:[authorizationGuard,managerRoleGuard]
    },
    {
        path:"mylistings",
        title:"mylistings",
        component:MylistingsComponent,
        canActivate:[authorizationGuard,agentRoleGuard]
    },
    {
        path:"myprofile",
        title:"myprofile",
        component:ProfileComponent,
        canActivate:[authorizationGuard]
    },
    {
        path:"starred",
        title:"starred",
        component:StarredListingsComponent,
        canActivate:[authorizationGuard]
    },
    {   
        path: '**',
        redirectTo: 'search'
    },
];
