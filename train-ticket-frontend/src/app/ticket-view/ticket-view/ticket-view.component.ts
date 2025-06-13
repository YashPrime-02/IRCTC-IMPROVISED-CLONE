import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common'; // 👈 important
import emailjs from 'emailjs-com';
import * as QRCode from 'qrcode';
// @ts-ignore
import * as html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-ticket-view',
  standalone: true, // 👈 important
  imports: [CommonModule], // 👈 this enables *ngIf, *ngFor, etc.
  templateUrl: './ticket-view.component.html',
  styleUrls: ['./ticket-view.component.css']
})
export class TicketViewComponent implements OnInit {
  summary: any;
  @ViewChild('ticketRef') ticketRef!: ElementRef;

  ngOnInit(): void {
    const saved = sessionStorage.getItem('bookingSummary');
    if (saved) {
      this.summary = JSON.parse(saved);
      console.log('✅ Parsed summary:', this.summary);
      this.sendTicketEmail();
      setTimeout(() => this.downloadPDF(), 500);
    } else {
      console.warn('⚠️ No bookingSummary found in sessionStorage!');
    }
  }

  print(): void {
    window.print();
  }

  async sendTicketEmail(): Promise<void> {
    try {
      const email = this.summary?.user?.email;
      const name = this.summary?.user?.name;

      if (!email || !name) {
        throw new Error('❌ User email or name is missing!');
      }

      const qrDataUrl = await QRCode.toDataURL(JSON.stringify(this.summary));

      const templateParams = {
        to_name: name,
        to_email: email,
        train_name: this.summary.train.trainName,
        from: this.summary.train.source,
        to: this.summary.train.destination,
        date: this.summary.train.date,
        passenger_count: this.summary.passengers.length,
        amount: this.summary.totalAmount,
        qr_code: qrDataUrl
      };

      const response = await emailjs.send(
        'service_kskn3sh',
        'template_nly90ge',
        templateParams,
        'Wa0lCeJ_wk1Ep39F3'
      );

      console.log('✅ Email sent:', response.status, response.text);
    } catch (error) {
      console.error('❌ Failed to send email:', error);
    }
  }

  downloadPDF(): void {
    const element = this.ticketRef.nativeElement;
    const options = {
      filename: 'IRCTC_Ticket.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(options).from(element).save();
  }
}
