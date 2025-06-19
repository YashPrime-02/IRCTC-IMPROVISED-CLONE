import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
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
export class BookingComponent implements OnInit, OnDestroy {
  bookingData: any;
  seatTypes: string[] = ['2S', 'SL', '3A', '2A', '1A'];
  statuses: string[] = ['Confirmed', 'RAC', 'Waiting'];
  username = '';
  email = '';
  passengers: any[] = [];
  errors: { name: boolean; age: boolean }[] = [];

  countdown: number = 9 * 60;
  timerInterval: any;
  minutes: number = 9;
  seconds: number = 0;
  showWarningAnimation = false;
  showTimeoutModal = false;

  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' | 'warning' = 'warning';

  @ViewChild('audioRef') audioRef!: ElementRef;

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    const nav = history.state.bookingData || JSON.parse(sessionStorage.getItem('bookingData') || 'null');
    if (!nav) {
      this.router.navigate(['/train-search']);
      return;
    }

    const storedUser = localStorage.getItem('userData'); // ✅ FIXED key
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.email) {
        this.email = user.email;
        this.username = user.name || this.extractUsernameFromEmail(this.email);
      } else {
        this.fallbackToGuest(); // fallback
      }
    } else {
      this.fallbackToGuest(); // fallback
    }

    this.bookingData = nav;
    sessionStorage.setItem('bookingData', JSON.stringify(this.bookingData));

    const count = Math.min(this.bookingData.numberOfPeople || 1, 7);
    for (let i = 0; i < count; i++) this.addPassenger();

    this.startCountdown();
  }

  fallbackToGuest(): void {
    this.email = 'guest@example.com';
    this.username = 'Guest';
    console.warn('⚠️ Proceeding as guest. Booking may not appear in logged-in user history.');
  }

  ngOnDestroy(): void {
    clearInterval(this.timerInterval);
  }

  startCountdown(): void {
    this.updateTimeDisplay();

    this.timerInterval = setInterval(() => {
      this.countdown--;
      this.updateTimeDisplay();

      if (this.countdown === 30 && this.audioRef) {
        this.audioRef.nativeElement.play().catch(() => {});
        this.showWarningAnimation = true;
        this.showToastMessage('⏳ Only 30 seconds left!', 'warning');
      }

      if (this.countdown <= 0) {
        clearInterval(this.timerInterval);
        this.showTimeoutModal = true;
        this.showToastMessage('⏰ Session expired. Logging out...', 'error');
        localStorage.removeItem('loggedInUser');
        sessionStorage.removeItem('bookingData');
        setTimeout(() => this.router.navigate(['/']), 4000);
      }
    }, 1000);
  }

  updateTimeDisplay(): void {
    this.minutes = Math.floor(this.countdown / 60);
    this.seconds = this.countdown % 60;
  }

  showToastMessage(message: string, type: 'success' | 'error' | 'warning' = 'success') {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;
    setTimeout(() => this.showToast = false, 4000);
  }

  extractUsernameFromEmail(email: string): string {
    return email.split('@')[0];
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

  calculateFare(seatType: '2S' | 'SL' | '3A' | '2A' | '1A'): number {
    const factorMap = { '2S': 1, SL: 2, '3A': 3, '2A': 4, '1A': 5 };
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

    const train = this.bookingData;

    const bookingSummary = {
      email: this.email,
      trainName: train.trainName,
      sourceCode: train.sourceCode,
      destinationCode: train.destinationCode,
      date: train.date || new Date().toISOString().split('T')[0],
      duration: train.duration || 'Unknown',
      passengers: this.passengers.map(p => ({
        name: p.name,
        age: p.age,
        seatType: p.seatType,
        status: p.status,
        fare: p.fare
      })),
      totalAmount: this.calculateTotal(),
      bookingDate: new Date()
    };

    console.log('✅ Final booking payload to be sent to backend:', bookingSummary);

    this.http.post('http://localhost:8080/api/bookings', bookingSummary).subscribe({
      next: () => {
        clearInterval(this.timerInterval);
        sessionStorage.setItem('bookingSummary', JSON.stringify(bookingSummary));
        this.router.navigate(['/ticket-view']);
      },
      error: err => {
        console.error('❌ Error saving booking:', err);
        this.showToastMessage('Failed to save booking.', 'error');
      }
    });
  }
}
