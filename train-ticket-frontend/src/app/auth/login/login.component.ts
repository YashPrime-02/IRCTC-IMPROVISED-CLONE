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

  @Output() switchToSignup = new EventEmitter<void>();
  @Output() showForgot = new EventEmitter<void>();

  constructor(private router: Router) {}

 onLogin(): void {
  if (!this.email || !this.password) {
    alert('Please enter both email and password.');
    return;
  }

  const savedUser = localStorage.getItem('userData');
  if (savedUser) {
    const user = JSON.parse(savedUser);
    if (this.email === user.email && this.password === user.password) {
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
