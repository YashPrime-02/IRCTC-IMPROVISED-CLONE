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

  @Output() switchToLogin = new EventEmitter<void>();

  constructor(private authService: AuthService, private router: Router) {}

  onSignup() {
    if (!this.name || !this.email || !this.password) {
      alert('Please fill in all fields.');
      return;
    }

    this.authService.signup(this.name, this.email, this.password).subscribe({
      next: (success: boolean) => {
        if (success) {
          alert('Signup successful. Please log in.');
          this.switchToLogin.emit(); // ✅ emits to parent to toggle
        } else {
          alert('Signup failed. Try again.');
        }
      },
      error: (err) => {
        console.error('Signup error:', err);
        alert('Something went wrong during signup.');
      }
    });
  }
}
