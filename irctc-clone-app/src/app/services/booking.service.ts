import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Booking } from '../models/booking';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private apiUrl = 'http://localhost:3000/api/bookings';

  constructor(private http: HttpClient) {}

  book(trainId: string, seats: number, date: string): Observable<{ pnr: string }> {
    return this.http.post<{ pnr: string }>(this.apiUrl, { trainId, seats, date });
  }

  getByPnr(pnr: string): Observable<Booking> {
    return this.http.get<Booking>(`${this.apiUrl}/${pnr}`);
  }

  listMine(): Observable<Booking[]> {
    return this.http.get<Booking[]>(this.apiUrl);
  }
}
