import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { TrainSearchComponent } from './train-search/train-search/train-search.component';
import { BookingComponent } from './booking/booking/booking.component';
import { TicketViewComponent } from './ticket-view/ticket-view/ticket-view.component';
import { AuthGuard } from './shared/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },

  { path: 'train-search', component: TrainSearchComponent, canActivate: [AuthGuard] },
  { path: 'booking', component: BookingComponent, canActivate: [AuthGuard] },
  { path: 'tickets', component: TicketViewComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'login' }
];
