import { Component, OnInit } from '@angular/core';
// @ts-ignore
import html2pdf from 'html2pdf.js';
import { CommonModule } from '@angular/common'; // ✅ Required
import QRCode from 'qrcode';

@Component({
  selector: 'app-ticket-view',
  standalone: true,
  templateUrl: './ticket-view.component.html',
  styleUrls: ['./ticket-view.component.css'],
  imports: [CommonModule]
})
export class TicketViewComponent implements OnInit {
  bookingData: any;
  qrCodeDataURL: string = '';

  ngOnInit(): void {
    const storedData = sessionStorage.getItem('bookingSummary');
    if (storedData) {
      this.bookingData = JSON.parse(storedData);
      console.log("✅ Booking data loaded:", this.bookingData);
      this.generateQRCode(JSON.stringify(this.bookingData));
    } else {
      console.warn("⚠️ No booking summary found in sessionStorage");
    }
  }

  generateQRCode(data: string): void {
    QRCode.toDataURL(data)
      .then(url => this.qrCodeDataURL = url)
      .catch(err => console.error('QR Generation failed', err));
  }

  downloadPDF(): void {
    const element = document.getElementById('ticketSummary');
    if (element) {
      html2pdf().from(element).save('IRCTC_Ticket.pdf');
    }
  }
}
