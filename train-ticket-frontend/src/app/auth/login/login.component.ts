import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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
  showPassword = false; // 👁️ Toggle state for password visibility

  @Output() switchToSignup = new EventEmitter<void>();
  @Output() showForgot = new EventEmitter<void>();

  constructor(private router: Router) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onLogin(): void {
    // Trim inputs to avoid leading/trailing whitespace errors
    const emailTrimmed = this.email.trim();
    const passwordTrimmed = this.password.trim();

    if (!emailTrimmed || !passwordTrimmed) {
      alert('Please enter both email and password.');
      return;
    }

    const savedUser = localStorage.getItem('userData');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      if (emailTrimmed === user.email && passwordTrimmed === user.password) {
        alert('✅ Login successful!');
        this.router.navigate(['/train-search']);
      } else {
        alert('❌ Invalid credentials');
      }
    } else {
      alert('❌ No user found. Please sign up first.');
    }
  }
}
