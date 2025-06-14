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
  showPassword = false;

  showToast = false;
  toastMessage = '';

  @Output() switchToSignup = new EventEmitter<void>();
  @Output() showForgot = new EventEmitter<void>();

  constructor(private router: Router, private authService: AuthService) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  showToastMessage(message: string): void {
    this.toastMessage = message;
    this.showToast = true;
    setTimeout(() => this.showToast = false, 5000);
  }

  onLogin(): void {
    const emailTrimmed = this.email.trim();
    const passwordTrimmed = this.password.trim();

    if (!emailTrimmed || !passwordTrimmed) {
      this.showToastMessage('⚠️ Please enter both email and password.');
      return;
    }

    const savedUser = localStorage.getItem('userData');
    if (savedUser) {
      const user = JSON.parse(savedUser);

      if (emailTrimmed === user.email && passwordTrimmed === user.password) {
        this.showToastMessage('✅ Login successful!');
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('loggedInUser', JSON.stringify(user));

        this.router.navigate(['/train-search']);
      } else {
        this.showToastMessage('❌ Invalid credentials. Please try again.');
      }
    } else {
      this.showToastMessage('❌ No user found. Please sign up first.');
    }
  }
}
