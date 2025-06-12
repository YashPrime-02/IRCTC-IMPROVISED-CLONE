import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';

  @Output() switchToSignup = new EventEmitter<void>();
  @Output() showForgot = new EventEmitter<void>();

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    if (!this.email || !this.password) {
      alert('Please enter both email and password.');
      return;
    }

    this.authService.login(this.email, this.password).subscribe(success => {
      if (success) {
        this.router.navigate(['/train-search']); // ✅ proceed to app
      } else {
        alert('Invalid credentials');
      }
    });
  }
}
