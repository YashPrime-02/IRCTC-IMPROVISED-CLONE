import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private bookingData: any;

  constructor() {}

  setBookingData(data: any) {
    this.bookingData = data;
    localStorage.setItem('bookingData', JSON.stringify(data)); // optional for reload persistence
  }

  getBookingData() {
    if (this.bookingData) return this.bookingData;

    const data = localStorage.getItem('bookingData');
    return data ? JSON.parse(data) : null;
  }

  clearBookingData() {
    this.bookingData = null;
    localStorage.removeItem('bookingData');
  }
}
