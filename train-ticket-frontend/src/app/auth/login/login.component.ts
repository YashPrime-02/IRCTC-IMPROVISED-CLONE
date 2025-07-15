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

  this.authService.login(emailTrimmed, passwordTrimmed).subscribe({
    next: (res) => {
      console.log('✅ Login response:', res);

      const token = res?.token || res?.session?.access_token;
      const user = res?.user;

      if (token && user) {
        this.authService.saveToken(token, user);
        this.showToastMessage('✅ Login successful!');
        this.router.navigate(['/train-search']);
      } else {
        console.warn('❌ Invalid login structure:', res);
        this.showToastMessage('❌ Login failed. Try again.');
      }
    },
    error: (err) => {
      console.error('Login failed:', err);
      this.showToastMessage('❌ Invalid credentials or server error.');
    }
  });
}

}
