import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'train-ticket-frontend';

  constructor(public router: Router) {}

  showHeader(): boolean {
    return [
      '/train-search',
      '/booking',
      '/ticket-view'
    ].includes(this.router.url);
  }
}
