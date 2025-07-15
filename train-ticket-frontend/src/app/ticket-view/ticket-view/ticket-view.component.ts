import { Component, OnInit } from '@angular/core';
// @ts-ignore
import html2pdf from 'html2pdf.js';
import { CommonModule } from '@angular/common';
import QRCode from 'qrcode';
import { Router } from '@angular/router';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

const supabase = createClient(environment.supabaseUrl, environment.supabaseKey);

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

  constructor(private router: Router) {}

  ngOnInit(): void {
    const sessionBooking = sessionStorage.getItem('bookingSummary');
    const storedUser = localStorage.getItem('loggedInUser');

    if (storedUser) {
      const user = JSON.parse(storedUser);
      const email = user.email;

      supabase
        .from('bookings')
        .select('*')
        .eq('email', email)
        .order('created_at', { ascending: false })
        .limit(1)
        .then(({ data, error }) => {
          if (error) {
            console.error('❌ Supabase error:', error);
            this.loadFromSession(sessionBooking, user);
            return;
          }

          if (Array.isArray(data) && data.length > 0) {
            this.bookingData = data[0];

            this.normalizeTrainData(); // ✅ Normalize train object if flat
            this.bookingData.user = {
              name: user.name || this.extractUsernameFromEmail(email),
              email
            };

            this.afterBookingDataLoaded();
          } else {
            this.loadFromSession(sessionBooking, user);
          }
        });
    } else {
      this.loadFromSession(sessionBooking);
    }
  }

  loadFromSession(sessionData: string | null, userData?: any): void {
    if (!sessionData) return;
    this.bookingData = JSON.parse(sessionData);

    this.normalizeTrainData(); // ✅ Fix train nesting for sessionStorage

    if (!this.bookingData.user && userData) {
      this.bookingData.user = {
        name: userData.name || this.extractUsernameFromEmail(userData.email),
        email: userData.email
      };
    }

    this.afterBookingDataLoaded();
  }

  normalizeTrainData(): void {
    if (!this.bookingData.train && this.bookingData.trainName) {
      this.bookingData.train = {
        trainName: this.bookingData.trainName,
        source: this.bookingData.source,
        sourceCode: this.bookingData.sourceCode,
        destination: this.bookingData.destination,
        destinationCode: this.bookingData.destinationCode,
        duration: this.bookingData.duration,
        fare: this.bookingData.totalAmount
      };
    }
  }

  afterBookingDataLoaded(): void {
  this.generateQRCode(JSON.stringify(this.bookingData));
  this.generatePNR();

  console.log('✅ bookingData:', this.bookingData);             // ADD THIS
  console.log('✅ bookingData.train:', this.bookingData?.train); // AND THIS

  const train = this.bookingData.train;
  const passengers = this.bookingData.passengers;

  if (!train || typeof train !== 'object') {
    console.warn('❌ Missing or invalid train data in bookingData:', train);
    return;
  }

  if (!Array.isArray(passengers)) {
    console.warn('❌ Missing or invalid passengers data:', passengers);
    return;
  }

  this.bookingData.passengers = passengers.map((p: any) => {
    // seatNumber logic...
    return p;
  });
}


  generateFormattedSeat(seatType: string, berthType: string = ''): string {
    const coachMap: any = {
      '1A': 'H',
      '2A': 'A',
      '3A': 'B',
      'SL': 'S',
      '2S': 'D'
    };

    const coachPrefix = coachMap[seatType] || 'S';
    const coachNum = this.getRandomSeatNumber(1, 3);
    const seatNum = seatType === '1A' ? this.getRandomSeatNumber(1, 20) : this.getRandomSeatNumber(1, 60);

    return `${coachPrefix}${coachNum}-${seatNum} ${berthType}`;
  }

  getRandomSeatNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getRandomBerth(): string {
    const berths = ['L', 'M', 'U', 'SL', 'SU'];
    return berths[Math.floor(Math.random() * berths.length)];
  }

  extractUsernameFromEmail(email: string): string {
    return email?.split('@')[0] || 'Guest';
  }

  generateQRCode(data: string): void {
    QRCode.toDataURL(data)
      .then(url => this.qrCodeDataURL = url)
      .catch(err => console.error('QR Generation failed', err));
  }

  generatePNR(): void {
    const randomPNR = Math.floor(1000000000 + Math.random() * 9000000000);
    this.pnrNumber = randomPNR.toString();
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

  copyPNR(): void {
    navigator.clipboard.writeText(this.pnrNumber).then(() => {
      this.showToast = true;
      setTimeout(() => this.showToast = false, 3000);
    });
  }
goToTrainSearch(): void {
  this.router.navigate(['/train-search']);
}

  shareTicket(): void {
    const ticketElement = document.getElementById('ticketSummary');
    if (!ticketElement) return;

    const cloned = ticketElement.cloneNode(true) as HTMLElement;
    const style = document.createElement('style');
    style.textContent = `body { background: #1e1e1e; color: white; font-family: 'Poppins'; }`;
    cloned.appendChild(style);

    const opt = {
      margin: 0,
      filename: 'IRCTC_Ticket.pdf',
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(cloned).outputPdf('blob').then((pdfBlob: Blob) => {
      const file = new File([pdfBlob], 'IRCTC_Ticket.pdf', { type: 'application/pdf' });

      if (navigator.share && navigator.canShare({ files: [file] })) {
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
