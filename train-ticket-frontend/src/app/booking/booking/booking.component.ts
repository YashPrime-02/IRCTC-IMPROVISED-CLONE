import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import confetti from 'canvas-confetti';
import { environment } from '../../environments/environment';
@Component({
  selector: 'app-booking',
  standalone: true,
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css'],
  imports: [CommonModule, FormsModule],
})
export class BookingComponent implements OnInit, OnDestroy {
  bookingData: any;
  seatTypes: string[] = ['2S', 'SL', '3A', '2A', '1A'];
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

  waitingStartNumber = 0;
  statusCounter = 0;

  @ViewChild('audioRef') audioRef!: ElementRef;

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    const nav = history.state.bookingData || JSON.parse(sessionStorage.getItem('bookingData') || 'null');
    if (!nav) {
      this.router.navigate(['/train-search']);
      return;
    }

    const storedUser = localStorage.getItem('userData');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.email = user.email || 'guest@example.com';
      this.username = user.name || this.extractUsernameFromEmail(this.email);
    } else {
      this.email = 'guest@example.com';
      this.username = 'Guest';
    }

    this.bookingData = nav;
    sessionStorage.setItem('bookingData', JSON.stringify(this.bookingData));

    const count = Math.min(this.bookingData.numberOfPeople || 1, 7);
    for (let i = 0; i < count; i++) this.addPassenger();

    this.startCountdown();
  }

  ngOnDestroy(): void {
    clearInterval(this.timerInterval);
  }

  extractUsernameFromEmail(email: string): string {
    return email.split('@')[0];
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
    setTimeout(() => (this.showToast = false), 4000);
  }

  calculateFare(seatType: '2S' | 'SL' | '3A' | '2A' | '1A'): number {
    const factorMap = { '2S': 1, SL: 2, '3A': 3, '2A': 4, '1A': 5 };
    const base = 120 + Math.floor(Math.random() * 100);
    const distanceFactor = Math.floor(Math.random() * 5) + 5;
    return base + factorMap[seatType] * distanceFactor * 10;
  }

  generateStatusForPassenger(index: number): string {
    if (index === 0) {
      const firstStatus = this.randomStatus();
      if (firstStatus === 'WL') {
        this.waitingStartNumber = Math.floor(Math.random() * 10) + 10;
        this.statusCounter = this.waitingStartNumber;
        return `WL${this.statusCounter}`;
      } else {
        return firstStatus;
      }
    } else {
      const first = this.passengers[0]?.status;
      if (first?.startsWith('WL')) {
        this.statusCounter++;
        return `WL${this.statusCounter}`;
      } else {
        const roll = Math.random();
        if (roll < 0.5) return 'Confirmed';
        else if (roll < 0.8) return 'RAC';
        else {
          this.statusCounter++;
          return `WL${this.statusCounter}`;
        }
      }
    }
  }

  randomStatus(): string {
    const statuses = ['Confirmed', 'RAC', 'WL'];
    return statuses[Math.floor(Math.random() * statuses.length)];
  }

  addPassenger(): void {
    if (this.passengers.length >= 7) return;

    const index = this.passengers.length;
    const status = this.generateStatusForPassenger(index);
    const seatType = 'SL';

    this.passengers.push({
      name: '',
      age: null,
      seatType,
      status,
      fare: this.calculateFare(seatType)
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

  validatePassengers(): boolean {
    let isValid = true;

    this.errors = this.passengers.map(p => {
      const nameError = !p.name.trim() || /\d/.test(p.name);
      const ageError = !p.age || p.age < 12;

      if (nameError || ageError) isValid = false;

      return { name: nameError, age: ageError };
    });

    if (!isValid) {
      this.showToastMessage('⚠️ Passengers must be 12+ years and have valid names.', 'warning');
    }

    return isValid;
  }

  calculateTotal(): number {
    return this.passengers.reduce((sum, p) => sum + p.fare, 0);
  }

  launchConfetti(): void {
    const duration = 2 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }

confirmBooking(): void {
  if (!this.validatePassengers()) return;

  const train = this.bookingData;

  // ✅ Flattened structure to match Supabase table
  const bookingSummary = {
    email: this.email,
    trainname: train.trainName,
    sourcecode: train.sourceCode,
    destinationcode: train.destinationCode,
    date: train.date || new Date().toISOString().split('T')[0],
    duration: train.duration || 'Unknown',
    passengers: this.passengers.map(p => ({
      name: p.name,
      age: p.age,
      seatType: p.seatType,
      status: p.status,
      fare: p.fare
    })),
    totalamount: this.calculateTotal(),
    bookingdate: new Date().toISOString()
  };

  // ✅ POST to Supabase REST API
  const supabaseUrl = `${environment.baseApiUrl}/bookings`;

  this.http.post(supabaseUrl, bookingSummary, {
    headers: {
      apikey: environment.supabaseKey,
      Authorization: `Bearer ${environment.supabaseKey}`,
      'Content-Type': 'application/json'
    }
  }).subscribe({
    next: () => {
      clearInterval(this.timerInterval);

      // ✅ Save same structure to sessionStorage for ticket-view use
      sessionStorage.setItem('bookingSummary', JSON.stringify(bookingSummary));

      this.launchConfetti();
      this.router.navigate(['/ticket-view']);
    },
    error: err => {
      console.error('❌ Supabase booking error:', err);
      this.showToastMessage('Failed to save booking to Supabase.', 'error');
    }
  });
}


}
