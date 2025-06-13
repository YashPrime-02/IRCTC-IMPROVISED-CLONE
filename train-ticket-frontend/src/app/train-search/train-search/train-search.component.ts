import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { BookingService } from '../../booking/booking.service';

interface Station {
  stationID: number;
  stationName: string;
  stationCode: string;
}

export interface Train {
  trainName: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  sourceCode: string;
  destinationCode: string;
  date?: string;
}

@Component({
  selector: 'app-train-search',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './train-search.component.html',
  styleUrls: ['./train-search.component.css']
})
export class TrainSearchComponent implements OnInit {
  @ViewChild('sourceRef') sourceRef!: ElementRef;
  @ViewChild('destinationRef') destinationRef!: ElementRef;
  @ViewChild('formBox') formBox!: ElementRef;

  stations: Station[] = [];
  trainsList: Train[] = [];
  trains: Train[] = [];

  selectedDate = '';
  selectedTime = '';
  numberOfPeople = 1;
  peopleOptions = Array.from({ length: 8 }, (_, i) => i + 1);

  sourceTouched = false;
  destinationTouched = false;
  dateTouched = false;
  timeTouched = false;

  searched = false;
  showModal = false;
  loading = false;
  loadingProgress = 0;
  selectedSource = '';
  selectedDestination = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private bookingService: BookingService
  ) {}

  ngOnInit(): void {
    this.loadTrainData();
  }

  loadTrainData(): void {
    this.http.get<any>('assets/train_data.json').subscribe({
      next: data => {
        this.stations = data.stations || [];
        this.trainsList = data.trains || [];
      },
      error: err => {
        console.error('❌ Failed to load train data:', err);
      }
    });
  }

  onSearch(source: string, destination: string): void {
    this.sourceTouched = true;
    this.destinationTouched = true;
    this.dateTouched = true;
    this.timeTouched = true;

    if (!source || !destination || !this.selectedDate || !this.selectedTime) {
      this.scrollToFirstError();
      return;
    }

    this.selectedSource = source;
    this.selectedDestination = destination;

    this.resetSearchState();

    const interval = setInterval(() => {
      if (this.loadingProgress < 100) {
        this.loadingProgress += 10;
      } else {
        clearInterval(interval);
        this.trains = this.filterTrains(source, destination);
        this.searched = true;
        this.loading = false;
        this.showModal = this.trains.length > 0;
      }
    }, 100);
  }

  filterTrains(source: string, destination: string): Train[] {
    return this.trainsList.filter(t => t.sourceCode === source && t.destinationCode === destination);
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

  bookTrain(train: Train, selectedDate: string, numberOfPeople: number): void {
    const bookingData = {
      trainName: train.trainName,
      departureTime: train.departureTime,
      arrivalTime: train.arrivalTime,
      duration: train.duration,
      date: selectedDate,
      source: this.stations.find(s => s.stationCode === this.selectedSource)?.stationName || '',
      destination: this.stations.find(s => s.stationCode === this.selectedDestination)?.stationName || '',
      numberOfPeople
    };
    console.log('✅ Navigating to booking with data:', bookingData);
    this.router.navigate(['/booking'], { state: { bookingData } });
  }

  @HostListener('document:mousemove', ['$event'])
  updateMouseCoords(e: MouseEvent): void {
    document.documentElement.style.setProperty('--x', `${e.clientX}px`);
    document.documentElement.style.setProperty('--y', `${e.clientY}px`);
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
}
