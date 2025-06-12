import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // ✅ added

// Components
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { TrainSearchComponent } from './train-search/train-search/train-search.component';
import { BookingComponent } from './booking/booking/booking.component';
import { TicketViewComponent } from './ticket-view/ticket-view/ticket-view.component';

// Guards
import { AuthGuard } from './shared/auth.guard';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    TrainSearchComponent,
    BookingComponent,
    TicketViewComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    CommonModule,
    BrowserAnimationsModule  // ✅ added here
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule {}
