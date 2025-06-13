import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  console.log('🛡️ AuthGuard check:', isLoggedIn);
  if (!isLoggedIn) {
    console.warn('🚫 User not authenticated, redirecting to /auth');
    this.router.navigate(['/auth']);
    return false;
  }
  return true;
}

}
