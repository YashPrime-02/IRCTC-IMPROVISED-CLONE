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

  @Output() switchToLogin = new EventEmitter<void>();

  constructor(private authService: AuthService, private router: Router) {}

onSignup(): void {
  const passwordRegex = /^(?=.*[A-Z])(?=.*[\W_]).{6,}$/;

  if (!this.name || !this.email || !this.password || this.age === null) {
    alert('⚠️ Please fill in all fields.');
    return;
  }

  if (this.age < 18) {
    alert('🚫 You must be at least 18 years old to sign up.');
    return;
  }

  if (!passwordRegex.test(this.password)) {
    alert(
      '🔒 Password must be at least 6 characters long, include 1 uppercase letter and 1 special character.'
    );
    return;
  }

  // Save to localStorage
  const userData = {
    name: this.name,
    email: this.email,
    password: this.password,
    age: this.age
  };

  localStorage.setItem('userData', JSON.stringify(userData));

  alert('✅ Signup successful. Please log in.');
  this.switchToLogin.emit();
}

}
