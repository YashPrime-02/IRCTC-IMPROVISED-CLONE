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

  },

  {
    path: 'ticket-view',
    loadComponent: () =>
      import('./ticket-view/ticket-view/ticket-view.component').then(m => m.TicketViewComponent)
  },
  {
  path: 'booking-history',
  loadComponent: () => import('./booking/booking/booking/booking-history/booking-history.component').then(m => m.BookingHistoryComponent)
},
{
  path: 'reset-password',
  loadComponent: () =>
    import('./auth/reset-password/reset-password.component').then(m => m.ResetPasswordComponent)
},
{
  path: 'otp-verification',
  loadComponent: () =>
    import('./auth/otp-verification/otp-verification.component').then(m => m.OtpVerificationComponent)
},


  { path: '**', redirectTo: 'auth' }
];

