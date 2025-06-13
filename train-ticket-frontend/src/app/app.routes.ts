import { Routes } from '@angular/router';
import { AuthWrapperComponent } from './auth/auth-wrapper/auth-wrapper.component';
import { TrainSearchComponent } from './train-search/train-search/train-search.component';
import { BookingComponent } from './booking/booking/booking.component';
import { TicketViewComponent } from './ticket-view/ticket-view/ticket-view.component';
import { AuthGuard } from './shared/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: 'auth', component: AuthWrapperComponent },

  {
    path: 'train-search',loadComponent: () => import('./train-search/train-search/train-search.component').then(m => m.TrainSearchComponent),

  },

  {
    path: 'booking',
    loadComponent: () =>
      import('./booking/booking/booking.component').then(m => m.BookingComponent),
    canActivate: [AuthGuard]
  },

  {
    path: 'ticket-view',
    loadComponent: () =>
      import('./ticket-view/ticket-view/ticket-view.component').then(m => m.TicketViewComponent)
  },

  { path: '**', redirectTo: 'auth' }
];

