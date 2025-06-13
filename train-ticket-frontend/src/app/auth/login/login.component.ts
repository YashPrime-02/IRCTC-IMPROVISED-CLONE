import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service'; // ✅ import auth service

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

  @Output() switchToSignup = new EventEmitter<void>();
  @Output() showForgot = new EventEmitter<void>();

  constructor(private router: Router, private authService: AuthService) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

 onLogin(): void {
  const emailTrimmed = this.email.trim();
  const passwordTrimmed = this.password.trim();

  if (!emailTrimmed || !passwordTrimmed) {
    alert('⚠️ Please enter both email and password.');
    return;
  }

  const savedUser = localStorage.getItem('userData');
  if (savedUser) {
    const user = JSON.parse(savedUser);

    // 👇 Debug logs to check saved and entered credentials
    console.log('🧾 Saved user from localStorage:', user);
    console.log('🔐 Entered login credentials:', {
      email: emailTrimmed,
      password: passwordTrimmed
    });

    if (emailTrimmed === user.email && passwordTrimmed === user.password) {
  alert('✅ Login successful!');

  // 🟢 Debug logs to verify state
  console.log('🔐 Login Success!');
  console.log('📧 Email:', user.email);
  console.log('🔑 Password:', user.password);
  console.log('🟩 isLoggedIn set to:', 'true');

  localStorage.setItem('isLoggedIn', 'true'); // 🟢 For AuthGuard
  localStorage.setItem('loggedInUser', JSON.stringify(user)); // optional

  // 🧪 Test route navigation result
  this.router.navigate(['/train-search']).then(success => {
    if (success) {
      console.log('✅ Navigation to /train-search succeeded');
    } else {
      console.error('❌ Navigation to /train-search failed');
    }
  });
}
 else {
      alert('❌ Invalid credentials. Please try again.');
    }
  } else {
    alert('❌ No user found. Please sign up first.');
  }
}

}
