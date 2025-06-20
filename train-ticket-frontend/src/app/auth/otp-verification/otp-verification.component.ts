import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-otp-verification',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './otp-verification.component.html',
  styleUrls: ['./otp-verification.component.css']
})
export class OtpVerificationComponent implements OnInit {
  email = '';
  otp = '';
  action: 'signup' | 'forgot-password' = 'forgot-password';
  error = '';
  successMessage = '';
  isLoading = false;

  private readonly baseApi = 'http://localhost:8080/api/auth';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || '';
      const actionParam = params['action'];
      if (actionParam === 'signup' || actionParam === 'forgot-password') {
        this.action = actionParam;
      }

      if (!this.email) this.router.navigate(['/auth']);
    });
  }

  verifyOtp(): void {
    this.error = '';
    this.successMessage = '';
    const trimmedOtp = this.otp.trim();

    if (!/^\d{6}$/.test(trimmedOtp)) {
      this.error = '⚠️ Please enter a valid 6-digit OTP.';
      return;
    }

    this.isLoading = true;

    this.http.post<{ message: string; token?: string }>(`${this.baseApi}/verify-otp`, {
      email: this.email,
      otp: trimmedOtp
    }).subscribe({
      next: (res) => {
        this.successMessage = '✅ OTP verified successfully.';

        if (this.action === 'forgot-password') {
          this.router.navigate(['/reset-password'], {
            queryParams: {
              email: this.email,
              token: res.token ?? ''
            }
          });
        } else if (this.action === 'signup') {
          setTimeout(() => this.router.navigate(['/auth']), 1000);
        }
      },
      error: (err) => {
        this.error = err.error?.message || '❌ OTP verification failed. Please try again.';
        this.isLoading = false;
      },
      complete: () => this.isLoading = false
    });
  }
}
