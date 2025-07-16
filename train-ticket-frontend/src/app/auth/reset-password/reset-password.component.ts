import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
  imports: [CommonModule, FormsModule]
})
export class ResetPasswordComponent implements OnInit {
  email = '';
  token = '';
  newPassword = '';
  confirmPassword = '';
  errorMessage = '';
  successMessage = '';
  isLoading = false;

  showNewPassword = false;
  showConfirmPassword = false;

  private readonly baseApi = 'https://irctc-clone-backend.onrender.com/api/auth';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || '';
      this.email = (params['email'] || '').toLowerCase();

      if (!this.token) {
        this.router.navigate(['/auth']);
      }
    });
  }

  resetPassword(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.newPassword || this.newPassword.length < 6) {
      this.errorMessage = '⚠️ Password must be at least 6 characters.';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = '⚠️ Passwords do not match.';
      return;
    }

    this.isLoading = true;

    const payload = {
      token: this.token, // ✅ moved token into body
      newPassword: this.newPassword
    };

    this.http.post(`${this.baseApi}/reset-password`, payload).subscribe({
      next: () => {
        this.successMessage = '✅ Password reset successful!';
        setTimeout(() => this.router.navigate(['/auth']), 2000);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || '❌ Reset failed. Try again.';
        this.isLoading = false;
      },
      complete: () => this.isLoading = false
    });
  }

  toggleNewPasswordVisibility(): void {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  goToLogin(): void {
    this.router.navigate(['/auth']);
  }
}
