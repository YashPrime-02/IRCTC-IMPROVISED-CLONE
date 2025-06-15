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
  }

  openLogoutModal(): void {
    this.showLogoutModal = true;
  }

  cancelLogout(): void {
    this.showLogoutModal = false;
  }

  confirmLogout(): void {
    localStorage.removeItem('userData');
    this.showLogoutModal = false;
    this.router.navigate(['/']);
  }

  // ✅ Close modal when clicking on backdrop
  closeOnBackdrop(event: MouseEvent): void {
    this.cancelLogout();
  }

  // ✅ Listen for Escape key
  @HostListener('document:keydown.escape', ['$event'])
  handleEscape(event: KeyboardEvent): void {
    if (this.showLogoutModal) {
      this.cancelLogout();
    }
  }
}
