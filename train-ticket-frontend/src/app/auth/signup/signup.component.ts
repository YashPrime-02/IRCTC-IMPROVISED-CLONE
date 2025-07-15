import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  name = '';
  email = '';
  password = '';
  age: number | null = null;

  showToast = false;
  toastMessage = '';

  @Output() switchToLogin = new EventEmitter<void>();

  constructor(private authService: AuthService, private router: Router) {}

  showToastMessage(message: string): void {
    this.toastMessage = message;
    this.showToast = true;
    setTimeout(() => this.showToast = false, 3000);
  }

  onSignup(): void {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[\W_]).{6,}$/;

    if (!this.name || !this.email || !this.password || this.age === null) {
      this.showToastMessage('⚠️ Please fill in all fields.');
      return;
    }

    if (this.age < 18) {
      this.showToastMessage('🚫 You must be at least 18 years old to sign up.');
      return;
    }

    if (!passwordRegex.test(this.password)) {
      this.showToastMessage(
        '🔒 Password must be at least 6 characters long, include 1 uppercase letter and 1 special character.'
      );
      return;
    }

    this.authService.signup(this.name, this.email, this.password).subscribe({
      next: (res) => {
        console.log('✅ Signup success:', res); // ✅ log for debug
        this.showToastMessage('✅ Signup successful! Please log in.');
        setTimeout(() => this.switchToLogin.emit(), 3000);
      },
      error: (err) => {
        console.error('❌ Signup failed:', err);
        if (err.error?.message === 'User already exists!') {
          this.showToastMessage('⚠️ Email already in use. Try logging in.');
        } else {
          this.showToastMessage('❌ Signup failed. Please try again.');
        }
      }
    });
  }
}
