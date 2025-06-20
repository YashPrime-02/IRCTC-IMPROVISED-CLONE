import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  email = '';
  error = '';
  isLoading = false;

  constructor(private http: HttpClient, private router: Router) {}

  handleForgot(): void {
    this.isLoading = true;
    this.error = '';

    this.http.post('http://localhost:8080/api/send-otp', { email: this.email }).subscribe({
      next: () => {
        // ✅ Redirect to OTP Verification page with email
        this.router.navigate(['/otp-verification'], { queryParams: { email: this.email } });
      },
      error: (err) => {
        this.error = err.error?.message || 'Something went wrong!';
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
