import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ticket-view',
  templateUrl: './ticket-view.component.html',
  styleUrls: ['./ticket-view.component.css']
})
export class TicketViewComponent implements OnInit {
  summary: any;

  ngOnInit(): void {
    const saved = sessionStorage.getItem('bookingSummary');
    if (saved) {
      this.summary = JSON.parse(saved);
    }
  }

  print(): void {
    window.print();
  }
}
