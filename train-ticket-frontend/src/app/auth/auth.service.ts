import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError, Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = `${environment.baseApiUrl}/auth`; // e.g., http://localhost:5000/api/auth

  constructor(private http: HttpClient, private router: Router) {}

  // 🟢 Signup (send name for backend user creation)
  signup(name: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/signup`, { name, email, password }).pipe(
      catchError(err => {
        console.error('❌ Signup failed:', err);
        return throwError(() => err); // Forward error to component
      })
    );
  }

  // 🟢 Login (use Supabase auth)
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, { email, password }).pipe(
      catchError(err => {
        console.error('❌ Login failed:', err);
        return throwError(() => err); // Let component decide what to show
      })
    );
  }

  // ✅ Save auth data
  saveToken(token: string, user: any): void {
    try {
      localStorage.setItem('token', token);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userData', JSON.stringify(user));
    } catch (e) {
      console.error('🛑 Error saving to localStorage:', e);
    }
  }

  // 🔐 Get token
  getToken(): string | null {
    return localStorage.getItem('token') || null;
  }

  // ✅ Get user
  getUser(): any {
    const userData = localStorage.getItem('userData');
    try {
      return userData ? JSON.parse(userData) : null;
    } catch (e) {
      console.error('🛑 Error parsing user data:', e);
      return null;
    }
  }

  // 🟢 Check login state
  isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true' && !!this.getToken();
  }

  // 🚪 Logout and navigate
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    localStorage.removeItem('isLoggedIn');
    this.router.navigate(['/auth']);
  }
}
