import { Component, OnInit } from '@angular/core';
// @ts-ignore
import html2pdf from 'html2pdf.js';
import { CommonModule } from '@angular/common';
import QRCode from 'qrcode';
import { Router } from '@angular/router';

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
  pnrNumber: string = '';
  showToast = false;
  constructor(private router: Router) { }

  goToTrainSearch(): void {
    this.router.navigate(['/train-search']);
  }

  ngOnInit(): void {
    const sessionBooking = sessionStorage.getItem('bookingSummary');
    const storedUser = localStorage.getItem('loggedInUser');

    if (storedUser) {
      const user = JSON.parse(storedUser);
      const email = user.email;

      fetch(`http://localhost:8080/api/bookings?email=${email}`)
        .then(res => res.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            console.log("✅ Latest booking fetched from backend:", data[0]);
            this.bookingData = data[0];
            this.bookingData.user = { name: user.name || this.extractUsernameFromEmail(email), email };
            this.afterBookingDataLoaded();
          } else {
            console.warn("⚠️ No backend booking found. Falling back to sessionStorage...");
            this.loadFromSession(sessionBooking, user);
          }
        })
        .catch((err) => {
          console.error("❌ Error fetching from backend:", err);
          this.loadFromSession(sessionBooking, user);
        });
    } else {
      console.warn("⚠️ Guest user. Falling back to sessionStorage...");
      this.loadFromSession(sessionBooking);
    }
  }

  loadFromSession(sessionData: string | null, userData?: any): void {
    if (!sessionData) {
      console.warn("⚠️ No session data found.");
      return;
    }

    this.bookingData = JSON.parse(sessionData);

    if (!this.bookingData.user && userData) {
      this.bookingData.user = {
        name: userData.name || this.extractUsernameFromEmail(userData.email),
        email: userData.email
      };
    }

    this.afterBookingDataLoaded();
  }

  afterBookingDataLoaded(): void {
    this.generateQRCode(JSON.stringify(this.bookingData));
    this.generatePNR();

    this.bookingData.passengers = this.bookingData.passengers.map((p: any) => {
      if (p.status === 'Confirmed') {
        p.seatNumber = 'S' + this.getRandomSeatNumber(1, 60);
      } else if (p.status === 'Waiting') {
        p.seatNumber = 'W' + this.getRandomSeatNumber(1, 20);
      } else {
        p.seatNumber = null;
      }
      return p;
    });
  }

  extractUsernameFromEmail(email: string): string {
    return email?.split('@')[0] || 'Guest';
  }

  generateQRCode(data: string): void {
    QRCode.toDataURL(data)
      .then(url => this.qrCodeDataURL = url)
      .catch(err => console.error('QR Generation failed', err));
  }

  downloadPDF(): void {
    const ticketElement = document.getElementById('ticketSummary');
    if (!ticketElement) return;

    const cloned = ticketElement.cloneNode(true) as HTMLElement;

    const style = document.createElement('style');
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');
      * { font-family: 'Poppins', sans-serif !important; color: white !important; }
      .ticket-container {
        background: #1e1e1e !important;
        padding: 20px !important;
        border-radius: 12px !important;
        box-shadow: 0 0 20px rgba(255,255,255,0.1) !important;
      }
      .ticket-summary p { margin: 10px 0; font-size: 16px !important; }
      .qr-image { width: 150px !important; margin-top: 20px !important; }
      ul, li { color: white !important; }
      body { background: #121212 !important; color: white !important; }
    `;
    cloned.appendChild(style);

    const opt = {
      margin: 0,
      filename: 'IRCTC_Ticket.pdf',
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 2, useCORS: true, backgroundColor: '#1e1e1e' },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(cloned).save();
  }

  generatePNR(): void {
    const randomPNR = Math.floor(1000000000 + Math.random() * 9000000000);
    this.pnrNumber = randomPNR.toString();
  }

  getRandomSeatNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  copyPNR(): void {
    navigator.clipboard.writeText(this.pnrNumber).then(() => {
      this.showToast = true;
      setTimeout(() => this.showToast = false, 3000);
    });
  }

  shareTicket(): void {
    const ticketElement = document.getElementById('ticketSummary');
    if (!ticketElement) return;

    const cloned = ticketElement.cloneNode(true) as HTMLElement;

    const style = document.createElement('style');
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');
      * { font-family: 'Poppins', sans-serif !important; color: white !important; }
      .ticket-container {
        background: #1e1e1e !important;
        padding: 20px !important;
        border-radius: 12px !important;
        box-shadow: 0 0 20px rgba(255,255,255,0.1) !important;
      }
      .ticket-summary p { margin: 10px 0; font-size: 16px !important; }
      .qr-image { width: 150px !important; margin-top: 20px !important; }
      ul, li { color: white !important; }
      body { background: #121212 !important; color: white !important; }
    `;
    cloned.appendChild(style);

    const opt = {
      margin: 0,
      filename: 'IRCTC_Ticket.pdf',
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 2, useCORS: true, backgroundColor: '#1e1e1e' },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(cloned).outputPdf('blob').then((pdfBlob: Blob) => {
      const file = new File([pdfBlob], 'IRCTC_Ticket.pdf', { type: 'application/pdf' });

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        navigator.share({
          title: 'IRCTC Ticket',
          text: 'Here is your train ticket',
          files: [file]
        }).catch(err => console.error('❌ Share failed', err));
      } else {
        const mailBody = encodeURIComponent(`Hello,\n\nPlease find attached your IRCTC ticket.\n\nThank you!`);
        window.location.href = `mailto:?subject=IRCTC Ticket&body=${mailBody}`;
      }
    });
  }
}
