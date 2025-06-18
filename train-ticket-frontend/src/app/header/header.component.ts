import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

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

  constructor(private router: Router) {
    this.initializeUserData();
  }

  // ✅ Centralized user init
  initializeUserData(): void {
    const userData = localStorage.getItem('userData');

    if (!userData || userData === 'undefined') {
      console.warn('⚠️ No valid user data found.');
      this.invalidateSession();
      return;
    }

    try {
      const parsed = JSON.parse(userData);
      if (parsed && parsed.name) {
        this.userName = parsed.name;
      } else {
        console.warn('⚠️ Missing "name" in userData.');
        this.invalidateSession();
      }
    } catch (err) {
      console.error('❌ Error parsing user data:', err);
      this.invalidateSession();
    }

    this.checkUserValidity();
  }

  // ✅ Invalidate + redirect logic
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

  // ✅ Minimal additional check
  checkUserValidity(): void {
    const token = localStorage.getItem('token');
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    if (!token || isLoggedIn !== 'true') {
      this.invalidateSession();
    }
  }

  openLogoutModal(): void {
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
}
