import { Component } from '@angular/core';
import { SignupComponent } from '../signup/signup.component';
import { LoginComponent } from '../login/login.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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

  toggleMode(): void {
    this.isSignupMode = !this.isSignupMode;
    this.isForgotPasswordVisible = false;
  }

  openForgotPassword(): void {
    this.isForgotPasswordVisible = true;
  }

  showToast = false;

handleForgot(): void {
  console.log('Forgot password email:', this.forgotEmail);
  this.showToast = true;

  setTimeout(() => {
    this.showToast = false;
    this.closeForgotPassword();
  }, 3000); // Toast disappears after 3 seconds
}


  closeForgotPassword(): void {
    this.isForgotPasswordVisible = false;
    this.forgotEmail = '';
  }
}
