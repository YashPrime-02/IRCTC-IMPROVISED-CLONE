// src/app/shared/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth'; // Spring Boot backend base URL

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<boolean> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', email);
      }),
      map(() => true),
      catchError(err => {
        console.error('❌ Login failed:', err);
        return of(false);
      })
    );
  }

  signup(name: string, email: string, password: string): Observable<boolean> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/signup`, { name, email, password }).pipe(
      map(() => true),
      catchError(err => {
        console.error('❌ Signup failed:', err);
        return of(false);
      })
    );
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true' && !!localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
