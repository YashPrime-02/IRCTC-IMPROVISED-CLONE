import { Routes } from '@angular/router';
import { AuthWrapperComponent } from './auth/auth-wrapper/auth-wrapper.component';
import { TrainSearchComponent } from './train-search/train-search/train-search.component';
import { BookingComponent } from './booking/booking/booking.component';
import { TicketViewComponent } from './ticket-view/ticket-view/ticket-view.component';
import { AuthGuard } from './shared/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: 'auth', component: AuthWrapperComponent },

  { path: 'train-search', component: TrainSearchComponent, canActivate: [AuthGuard] },
  { path: 'booking', component: BookingComponent, canActivate: [AuthGuard] },
  { path: 'tickets', component: TicketViewComponent, canActivate: [AuthGuard] },

  { path: '**', redirectTo: 'auth' }
];
