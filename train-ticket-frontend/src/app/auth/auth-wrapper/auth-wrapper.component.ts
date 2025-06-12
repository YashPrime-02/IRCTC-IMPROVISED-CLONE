import { Component } from '@angular/core';
import { SignupComponent } from '../signup/signup.component';
import { LoginComponent } from '../login/login.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  styleUrls: ['./auth-wrapper.component.css']
})
export class AuthWrapperComponent {
  isSignupMode = false;
  isForgotPasswordVisible = false;
  forgotEmail = '';

  toggleMode() {
    this.isSignupMode = !this.isSignupMode;
    this.isForgotPasswordVisible = false;
  }

  openForgotPassword() {
    this.isForgotPasswordVisible = true;
  }

  handleForgot() {
    console.log('Forgot password email:', this.forgotEmail);
    // TODO: Connect backend
    this.isForgotPasswordVisible = false;
    alert('Reset link sent to email (mock).');
  }
}
