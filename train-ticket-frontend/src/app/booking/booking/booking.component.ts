import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-booking',
  standalone: true,
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css'],
  imports: [CommonModule, FormsModule]
})
export class BookingComponent implements OnInit {
  bookingData: any;
  seatTypes: string[] = ['SL', '3A', '2A', '1A'];
  statuses: string[] = ['Confirmed', 'RAC', 'Waiting'];
  username = 'Yash';
  email = 'yash@example.com';

  passengers: any[] = [];
  errors: { name: boolean; age: boolean }[] = [];

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    const nav = history.state.bookingData || JSON.parse(sessionStorage.getItem('bookingData') || 'null');
    if (!nav) {
      this.router.navigate(['/train-search']);
      return;
    }

    this.bookingData = nav;
    sessionStorage.setItem('bookingData', JSON.stringify(this.bookingData));

    const count = Math.min(this.bookingData.numberOfPeople || 1, 7);
    for (let i = 0; i < count; i++) this.addPassenger();
  }

  addPassenger(): void {
    if (this.passengers.length >= 7) return;
    this.passengers.push({
      name: '',
      age: null,
      seatType: 'SL',
      status: this.randomStatus(),
      fare: this.calculateFare('SL')
    });
    this.errors.push({ name: false, age: false });
  }

  removePassenger(): void {
    if (this.passengers.length > 1) {
      this.passengers.pop();
      this.errors.pop();
    }
  }

  updateFare(i: number): void {
    const seat = this.passengers[i].seatType;
    this.passengers[i].fare = this.calculateFare(seat);
  }

  calculateFare(seatType: 'SL' | '3A' | '2A' | '1A'): number {
    const factorMap = { SL: 1, '3A': 2, '2A': 3, '1A': 4 };
    const base = 150;
    const distanceFactor = Math.floor(Math.random() * 5) + 5;
    return base + factorMap[seatType] * distanceFactor * 10;
  }

  randomStatus(): string {
    return this.statuses[Math.floor(Math.random() * this.statuses.length)];
  }

  calculateTotal(): number {
    return this.passengers.reduce((sum, p) => sum + p.fare, 0);
  }

  validatePassengers(): boolean {
    let isValid = true;
    this.errors = this.passengers.map(p => {
      const nameError = !p.name.trim();
      const ageError = !p.age || p.age <= 0;
      if (nameError || ageError) isValid = false;
      return { name: nameError, age: ageError };
    });
    return isValid;
  }

  confirmBooking(): void {
    if (!this.validatePassengers()) return;

    const bookingSummary = {
      user: { name: this.username, email: this.email },
      train: this.bookingData,
      passengers: this.passengers,
      totalAmount: this.calculateTotal()
    };

    sessionStorage.setItem('bookingSummary', JSON.stringify(bookingSummary));

    this.http.post('http://localhost:3000/bookings', bookingSummary).subscribe({
      next: () => this.router.navigate(['/ticket-view']),
      error: err => {
        console.error('❌ Error saving booking:', err);
        alert('Failed to save booking.');
      }
    });
  }
}
