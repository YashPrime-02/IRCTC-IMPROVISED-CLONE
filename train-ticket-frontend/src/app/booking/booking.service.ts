import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private selectedTrain: any;
  private baseUrl = 'http://localhost:8080/api/bookings';

  constructor(private http: HttpClient) {}

  setSelectedTrain(train: any): void {
    this.selectedTrain = train;
  }

  getSelectedTrain(): any {
    return this.selectedTrain;
  }

  createBooking(booking: any): Observable<any> {
    return this.http.post(this.baseUrl, booking);
  }

  getBookingsByEmail(email: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}?email=${email}`);
  }

  deleteBookingById(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
