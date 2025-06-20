import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'train-ticket-frontend';

  constructor(public router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    const isAuthRoute = this.router.url.startsWith('/auth') || this.router.url === '/';
    if (this.authService.isLoggedIn() && isAuthRoute) {
      this.router.navigate(['/train-search']);
    }
  }

  showHeader(): boolean {
    const excludedRoutes = [
      '/auth/login',
      '/auth/signup',
      '/auth/forgot-password',
      '/reset-password'
    ];
    const currentPath = this.router.url.split('?')[0]; // remove query params if any
    return !excludedRoutes.includes(currentPath);
  }
}
