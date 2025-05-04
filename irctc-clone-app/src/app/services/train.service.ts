import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Train } from '../models/train';

@Injectable({ providedIn: 'root' })
export class TrainService {
  private apiUrl = 'http://localhost:3000/api/trains';

  constructor(private http: HttpClient) {}

  search(from: string, to: string, date: string): Observable<Train[]> {
    return this.http.get<Train[]>(`${this.apiUrl}?from=${from}&to=${to}&date=${date}`);
  }

  // Admin-only methods
  listAll(): Observable<Train[]> {
    return this.http.get<Train[]>(this.apiUrl);
  }
  create(train: Train) {
    return this.http.post(this.apiUrl, train);
  }
  update(id: string, train: Train) {
    return this.http.put(`${this.apiUrl}/${id}`, train);
  }
  delete(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
