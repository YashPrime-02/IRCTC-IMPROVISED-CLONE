import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private selectedTrain: any;
  private baseUrl = `${environment.baseApiUrl}/bookings`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      apikey: environment.supabaseKey,
      Authorization: `Bearer ${environment.supabaseKey}`
    });
  }

  setSelectedTrain(train: any): void {
    this.selectedTrain = train;
  }

  getSelectedTrain(): any {
    return this.selectedTrain;
  }

  createBooking(booking: any): Observable<any> {
    return this.http.post(this.baseUrl, booking, {
      headers: this.getHeaders()
    });
  }

getBookingsByEmail(email: string): Observable<any[]> {
  const safeEmail = encodeURIComponent(email.toLowerCase()); // 🛡 normalize
  const url = `${this.baseUrl}?email=eq.${safeEmail}`;
  return this.http.get<any[]>(url, {
    headers: this.getHeaders()
  });
}


  deleteBookingById(id: string): Observable<any> {
    const url = `${this.baseUrl}?id=eq.${id}`;
    return this.http.delete(url, {
      headers: this.getHeaders()
    });
  }
}
