import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { BookingService } from '../../booking/booking.service';
import { environment } from '../../environments/environment';

interface Station {
  stationID: number;
  stationName: string;
  stationCode: string;
}

export interface Train {
  id: number;
  trainname: string;
  departuretime: string;
  arrivaltime: string;
  duration: string;
  sourcecode: string;
  destinationcode: string;
}

@Component({
  selector: 'app-train-search',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './train-search.component.html',
  styleUrls: ['./train-search.component.css']
})
export class TrainSearchComponent implements OnInit {
  @ViewChild('sourceRef') sourceRef!: ElementRef;
  @ViewChild('destinationRef') destinationRef!: ElementRef;
  @ViewChild('formBox') formBox!: ElementRef;

  stations: Station[] = [];
  trains: Train[] = [];

  selectedDate = '';
  selectedTime = '';
  numberOfPeople = 1;
  peopleOptions = Array.from({ length: 8 }, (_, i) => i + 1);

  selectedSource = '';
  selectedDestination = '';

  searched = false;
  showModal = false;
  loading = false;
  loadingProgress = 0;

  showTimeToast = false;
  showPastDateToast = false;
  sourceTouched = false;
  destinationTouched = false;
  dateTouched = false;
  timeTouched = false;

  minDate = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private bookingService: BookingService
  ) {}

  ngOnInit(): void {
    this.minDate = new Date().toISOString().split('T')[0];
    this.loadStationData();
  }

  loadStationData(): void {
    this.http.get<any>('assets/train_data.json').subscribe({
      next: data => {
        this.stations = data.stations || [];
      },
      error: err => {
        console.error('❌ Failed to load station data:', err);
      }
    });
  }

  onSearch(source: string, destination: string): void {
    this.sourceTouched = this.destinationTouched = this.dateTouched = this.timeTouched = true;

    const today = new Date().toISOString().split('T')[0];
    if (this.selectedDate < today) {
      this.showPastDateToast = true;
      setTimeout(() => this.showPastDateToast = false, 4000);
      return;
    }

    if (this.selectedDate === today && this.selectedTime < this.getMinTime()) {
      this.selectedTime = this.getMinTime();
      this.showTimeToast = true;
      setTimeout(() => this.showTimeToast = false, 4000);
    }

    if (!source || !destination || !this.selectedDate || !this.selectedTime) {
      this.scrollToFirstError();
      return;
    }

    this.selectedSource = source;
    this.selectedDestination = destination;
    this.resetSearchState();

    this.fetchTrainsFromSupabase(source, destination);
  }

  fetchTrainsFromSupabase(source: string, destination: string): void {
    const params = new HttpParams()
      .set('sourcecode', `eq.${source}`)
      .set('destinationcode', `eq.${destination}`);

    const supabaseUrl = `${environment.baseApiUrl}/trains`;

    this.http.get<Train[]>(supabaseUrl, {
      params,
      headers: {
        apikey: environment.supabaseKey,
        Authorization: `Bearer ${environment.supabaseKey}`
      }
    }).subscribe({
      next: (data) => {
        const filtered = data.filter(t => this.isTimeMatch(t.departuretime, this.selectedTime));
        this.trains = filtered;
        this.searched = true;
        this.loading = false;
        this.showModal = filtered.length > 0;
      },
      error: (err) => {
        this.loading = false;
        console.error('❌ Failed to fetch trains from Supabase:', err);
      }
    });
  }

  bookTrain(train: Train, date: string, count: number): void {
    const bookingData = {
      trainName: train.trainname,
      departureTime: train.departuretime,
      arrivalTime: train.arrivaltime,
      duration: train.duration,
      date,
      source: this.stations.find(s => s.stationCode === this.selectedSource)?.stationName || '',
      destination: this.stations.find(s => s.stationCode === this.selectedDestination)?.stationName || '',
      sourceCode: this.selectedSource,
      destinationCode: this.selectedDestination,
      numberOfPeople: count
    };
    this.router.navigate(['/booking'], { state: { bookingData } });
  }

  isTimeMatch(trainTime: string, selectedTime: string): boolean {
    const [th, tm] = trainTime.split(':').map(Number);
    const [sh, sm] = selectedTime.split(':').map(Number);
    return th > sh || (th === sh && tm >= sm);
  }

  getMinTime(): string {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  }

  resetSearchState(): void {
    this.trains = [];
    this.searched = false;
    this.showModal = false;
    this.loading = true;
    this.loadingProgress = 0;
  }

  closeModal(): void {
    this.showModal = false;
  }

  swapStations(): void {
    const src = this.sourceRef.nativeElement;
    const dest = this.destinationRef.nativeElement;
    if (!src.value || !dest.value) return;

    const temp = src.value;
    src.classList.add('swap-animation');
    dest.classList.add('swap-animation');
    setTimeout(() => {
      src.value = dest.value;
      dest.value = temp;
      src.classList.remove('swap-animation');
      dest.classList.remove('swap-animation');
    }, 300);
  }

  scrollToFirstError(): void {
    setTimeout(() => {
      const invalid = this.formBox.nativeElement.querySelector('.invalid-input');
      if (invalid) {
        invalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 50);
  }

  isDisabled(): boolean {
    return !this.selectedDate || !this.selectedTime || !this.sourceRef?.nativeElement.value || !this.destinationRef?.nativeElement.value;
  }

  @HostListener('document:mousemove', ['$event'])
  updateMouseCoords(e: MouseEvent): void {
    document.documentElement.style.setProperty('--x', `${e.clientX}px`);
    document.documentElement.style.setProperty('--y', `${e.clientY}px`);
  }
}
