import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  userName = 'User';

  constructor(private router: Router) {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const parsed = JSON.parse(userData);
      this.userName = parsed.name || 'User';
    }
  }

  logout(): void {
    localStorage.removeItem('userData');
    this.router.navigate(['/']);
  }
}
