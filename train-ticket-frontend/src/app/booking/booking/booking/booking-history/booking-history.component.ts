import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../../booking.service';
// @ts-ignore
import html2pdf from 'html2pdf.js';
import { Router } from '@angular/router';

interface Booking {
  id: string;
  email: string;
  createdAt?: string;
  trainname: string;
  date: string;
  sourcecode: string;
  destinationcode: string;
  passengers: {
    name: string;
    age: number;
    seatType: string;
    status: string;
    fare: number;
  }[];
  totalamount: number;
}

@Component({
  selector: 'app-booking-history',
  standalone: true,
  templateUrl: './booking-history.component.html',
  styleUrls: ['./booking-history.component.css'],
  imports: [CommonModule, FormsModule]
})
export class BookingHistoryComponent implements OnInit {
  bookings: Booking[] = [];
  filteredBookings: Booking[] = [];
  email: string = '';
  loading = false;

  selectedMonth: string = '';
  selectedYear: string = '';

  months = [
    { name: 'January', value: '0' }, { name: 'February', value: '1' },
    { name: 'March', value: '2' }, { name: 'April', value: '3' },
    { name: 'May', value: '4' }, { name: 'June', value: '5' },
    { name: 'July', value: '6' }, { name: 'August', value: '7' },
    { name: 'September', value: '8' }, { name: 'October', value: '9' },
    { name: 'November', value: '10' }, { name: 'December', value: '11' }
  ];

  years: number[] = [];

  constructor(
    private router: Router,
    private bookingService: BookingService
  ) {}

  ngOnInit(): void {
    try {
      const userData = localStorage.getItem('userData');
      if (userData) {
        const user = JSON.parse(userData);
        if (user?.email) {
          this.email = user.email.toLowerCase(); // ✅ normalize email
        }
      }

      if (!this.email) this.email = 'guest@example.com';
      this.loadBookingHistory();

    } catch (err) {
      console.error('❌ Error parsing user data:', err);
      this.email = 'guest@example.com';
      this.loadBookingHistory();
    }
  }

  goToTrainSearch(): void {
    this.router.navigate(['/train-search']);
  }

  loadBookingHistory(): void {
    this.loading = true;
    console.log('📨 Fetching bookings for:', this.email);

    this.bookingService.getBookingsByEmail(this.email).subscribe({
      next: (res: Booking[]) => {
        console.log('📋 Bookings fetched:', res);

        this.bookings = res
          .map(b => ({
            ...b,
            createdAt: b.createdAt || new Date().toISOString()
          }))
          .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());

        this.filteredBookings = [...this.bookings];
        this.extractYears();
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Failed to fetch booking history:', err);
        this.loading = false;
      }
    });
  }

  extractYears(): void {
    const yearSet = new Set(this.bookings.map(b => new Date(b.createdAt!).getFullYear()));
    this.years = Array.from(yearSet).sort((a, b) => b - a);
  }

  filterBookings(): void {
    this.filteredBookings = this.bookings.filter(b => {
      const date = new Date(b.createdAt!);
      const year = date.getFullYear().toString();
      const month = date.getMonth().toString();

      return (!this.selectedYear || this.selectedYear === year) &&
             (!this.selectedMonth || this.selectedMonth === month);
    });
  }

  deleteBooking(id: string): void {
    const confirmDelete = confirm('❌ Are you sure you want to delete this booking?');
    if (!confirmDelete) return;

    this.bookingService.deleteBookingById(id).subscribe({
      next: () => {
        this.bookings = this.bookings.filter(b => b.id !== id);
        this.filterBookings();
      },
      error: (err) => {
        console.error('❌ Error deleting booking:', err);
      }
    });
  }

  downloadPDF(): void {
    const element = document.getElementById('bookingHistoryPDF');
    if (!element) {
      console.error('⚠️ PDF element not found.');
      return;
    }

    const options = {
      margin: 0.5,
      filename: `booking-history-${this.email}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(options).from(element).save();
  }
}
