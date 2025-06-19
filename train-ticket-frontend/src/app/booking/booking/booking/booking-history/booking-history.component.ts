import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../../booking.service';
// @ts-ignore
import html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-booking-history',
  standalone: true,
  templateUrl: './booking-history.component.html',
  styleUrls: ['./booking-history.component.css'],
  imports: [CommonModule, FormsModule]
})
export class BookingHistoryComponent implements OnInit {
  bookings: any[] = [];
  filteredBookings: any[] = [];
  email: string = '';

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

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('userData') || 'null');

    if (user && user.email) {
      this.email = user.email;
      this.loadBookingHistory();
    }
  }

  loadBookingHistory(): void {
    this.bookingService.getBookingsByEmail(this.email).subscribe({
      next: (res) => {
        this.bookings = res.sort(
          (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        this.filteredBookings = [...this.bookings];
        this.extractYears();
      },
      error: (err) => {
        console.error('Failed to fetch booking history:', err);
      }
    });
  }

  extractYears(): void {
    const yearSet = new Set(
      this.bookings.map(b => new Date(b.createdAt).getFullYear())
    );
    this.years = Array.from(yearSet).sort((a, b) => b - a);
  }

  filterBookings(): void {
    this.filteredBookings = this.bookings.filter(b => {
      const date = new Date(b.createdAt);
      const yearMatch = this.selectedYear ? date.getFullYear().toString() === this.selectedYear : true;
      const monthMatch = this.selectedMonth ? date.getMonth().toString() === this.selectedMonth : true;
      return yearMatch && monthMatch;
    });
  }

  deleteBooking(id: string): void {
    if (confirm('❌ Are you sure you want to delete this booking?')) {
      this.bookingService.deleteBookingById(id).subscribe({
        next: () => {
          this.bookings = this.bookings.filter(b => b.id !== id);
          this.filterBookings();
        },
        error: (err) => {
          console.error('Error deleting booking:', err);
        }
      });
    }
  }

  downloadPDF(): void {
    const element = document.getElementById('bookingHistoryPDF');
    const opt = {
      margin: 0.5,
      filename: `booking-history-${this.email}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    if (element) {
      html2pdf().set(opt).from(element).save();
    }
  }
}
