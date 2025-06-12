import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth'; // Spring Boot backend base URL

  constructor(private http: HttpClient) {}

  // LOGIN METHOD
  login(email: string, password: string): Observable<boolean> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, { email, password }).pipe(
      map(response => {
        localStorage.setItem('token', response.token);
        return true;
      }),
      catchError(err => {
        console.error('Login failed:', err);
        return of(false);
      })
    );
  }

  // SIGNUP METHOD
  signup(name: string, email: string, password: string): Observable<boolean> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/signup`, { name, email, password }).pipe(
      map(response => {
        console.log('Signup successful:', response.message);
        return true;
      }),
      catchError(err => {
        console.error('Signup failed:', err);
        return of(false);
      })
    );
  }
}
