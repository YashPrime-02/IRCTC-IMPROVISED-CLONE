import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class HeaderComponent {
  userName: string = 'User';
  showLogoutModal = false;
  invalidUser = false;
  showToast = false;

  private readonly verifyUrl = `${environment.baseApiUrl}/auth/verify-token`; // ✅ Now dynamic

  constructor(private router: Router, private http: HttpClient) {
    this.initializeUserData();
  }

  initializeUserData(): void {
    const userData = localStorage.getItem('userData');
    const token = localStorage.getItem('token');

    if (!userData || !token || userData === 'undefined') {
      console.warn('⚠️ No valid user or token found.');
      this.invalidateSession();
      return;
    }

    try {
      const parsed = JSON.parse(userData);
      if (parsed?.name) {
        this.userName = parsed.name;
      } else {
        console.warn('⚠️ Missing name in userData.');
        this.invalidateSession();
        return;
      }
    } catch (err) {
      console.error('❌ Failed to parse userData:', err);
      this.invalidateSession();
      return;
    }

    this.checkTokenWithBackend(token);
  }

  checkTokenWithBackend(token: string): void {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<{ valid: boolean }>(this.verifyUrl, { headers }).subscribe({
      next: (res) => {
        if (!res.valid) {
          this.invalidateSession();
        }
      },
      error: () => {
        this.invalidateSession();
      }
    });
  }

  invalidateSession(): void {
    this.invalidUser = true;
    this.showLogoutModal = true;
    localStorage.removeItem('userData');
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');

    this.triggerToast('⚠️ Session expired. Redirecting to login...');
    setTimeout(() => {
      this.showLogoutModal = false;
      this.router.navigate(['/auth']);
    }, 4000);
  }

  openLogoutModal(): void {
    this.invalidUser = false;
    this.showLogoutModal = true;
  }

  cancelLogout(): void {
    this.showLogoutModal = false;
  }

  confirmLogout(): void {
    localStorage.removeItem('userData');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('token');
    this.showLogoutModal = false;
    this.router.navigate(['/auth']);
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleEscape(event: KeyboardEvent): void {
    if (this.showLogoutModal) {
      this.cancelLogout();
    }
  }

  closeOnBackdrop(event: MouseEvent): void {
    this.cancelLogout();
  }

  triggerToast(message: string): void {
    this.showToast = true;
    setTimeout(() => this.showToast = false, 4000);
  }

  goToBookingHistory(): void {
    this.router.navigate(['/booking-history']);
  }
}
