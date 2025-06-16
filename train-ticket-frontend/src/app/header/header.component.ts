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
  showLogoutModal: boolean = false;
  invalidUser: boolean = false;
  showToast: boolean = false;

  constructor(private router: Router) {
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        this.userName = parsed.name || 'User';
      } catch (err) {
        console.error('Error parsing user data:', err);
      }
    }

    this.checkUserValidity();
  }

  checkUserValidity(): void {
    if (this.userName === 'User') {
      this.invalidUser = true;
      this.showLogoutModal = true;
      this.triggerToast('Redirecting to login page...');

      setTimeout(() => {
        this.showLogoutModal = false;
        this.router.navigate(['/']);
      }, 5000);
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
    localStorage.removeItem('loggedInUser');
    this.showLogoutModal = false;
    this.router.navigate(['/']);
  }

  closeOnBackdrop(event: MouseEvent): void {
    this.cancelLogout();
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleEscape(event: KeyboardEvent): void {
    if (this.showLogoutModal) {
      this.cancelLogout();
    }
  }

  triggerToast(message: string): void {
    this.showToast = true;

    setTimeout(() => {
      this.showToast = false;
    }, 3000); // Toast duration: 3 seconds
  }
}
