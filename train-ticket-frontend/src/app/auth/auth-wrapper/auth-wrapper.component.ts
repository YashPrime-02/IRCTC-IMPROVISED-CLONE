import { Component } from '@angular/core';
import { SignupComponent } from '../signup/signup.component';
import { LoginComponent } from '../login/login.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'; // ✅ IMPORT THIS
import {
  trigger,
  transition,
  style,
  animate
} from '@angular/animations';

@Component({
  selector: 'app-auth-wrapper',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SignupComponent,
    LoginComponent
  ],
  templateUrl: './auth-wrapper.component.html',
  styleUrls: ['./auth-wrapper.component.css'],
  animations: [
    trigger('fadeSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(-20px)' }))
      ])
    ])
  ]
})
export class AuthWrapperComponent {
  isSignupMode = false;
  isForgotPasswordVisible = false;
  forgotEmail = '';

  showToast = false;
  loading = false;
  errorMessage = '';

  constructor(private http: HttpClient, private router: Router) {} // ✅ CORRECTED INJECTION

  toggleMode(): void {
    this.isSignupMode = !this.isSignupMode;
    this.isForgotPasswordVisible = false;
  }

  openForgotPassword(): void {
    this.isForgotPasswordVisible = true;
  }

  closeForgotPassword(): void {
    this.isForgotPasswordVisible = false;
    this.forgotEmail = '';
    this.errorMessage = '';
  }

  handleForgot(): void {
    if (!this.forgotEmail || !this.forgotEmail.includes('@')) {
      this.errorMessage = 'Please enter a valid email.';
      return;
    }

    this.loading = true;
    this.http.post('http://localhost:8080/api/auth/send-otp', {
      email: this.forgotEmail
    }).subscribe({
      next: () => {
        this.loading = false;
        // ✅ Navigate to OTP screen with email + action
        this.router.navigate(['/otp-verification'], {
          queryParams: { email: this.forgotEmail, action: 'forgot-password' }
        });
      },
      error: (err) => {
        this.loading = false;
        console.error('❌ Forgot password error:', err);
        this.errorMessage = 'Something went wrong while sending OTP.';
      }
    });
  }
}
