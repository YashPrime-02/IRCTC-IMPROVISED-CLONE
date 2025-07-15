import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, of, Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = `${environment.baseApiUrl}/auth`; // ✅ Will resolve to /api/auth

  constructor(private http: HttpClient, private router: Router) {}

  // 🟢 Signup
  signup(name: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/signup`, { name, email, password });
  }

  // 🟢 Login
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, { email, password }).pipe(
      catchError(err => {
        console.error('Login failed:', err);
        return of(null);
      })
    );
  }

  // ✅ Save token and user
  saveToken(token: string, user: any): void {
    try {
      localStorage.setItem('token', token);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userData', JSON.stringify(user));
    } catch (e) {
      console.error('Error saving auth data to localStorage:', e);
    }
  }

  // 🔐 Get JWT
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // ✅ Get User
  getUser(): any {
    const userData = localStorage.getItem('userData');
    try {
      return userData ? JSON.parse(userData) : null;
    } catch (e) {
      console.error('Error parsing user data:', e);
      return null;
    }
  }

  // 🟢 Check Login
  isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true' && !!this.getToken();
  }

  // 🚪 Logout
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    localStorage.removeItem('isLoggedIn');
    this.router.navigate(['/auth']);
  }
}
