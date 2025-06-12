import { Component, HostListener, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// 👇 Adjust the import path based on actual structure — assuming sibling folder named 'booking'
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
  imports: [CommonModule, FormsModule],
  templateUrl: './train-search.component.html',
  styleUrls: ['./train-search.component.css']
})
export class TrainSearchComponent implements OnInit {
  stations: Station[] = [];
  trainsList: Train[] = [];
  trains: Train[] = [];

  selectedDate = '';
  selectedTime = '';
  numberOfPeople = 1;
  peopleOptions = Array.from({ length: 8 }, (_, i) => i + 1);

  searched = false;
  showModal = false;
  loading = false;

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
    this.resetSearchState();
    setTimeout(() => {
      this.trains = this.filterTrains(source, destination);
      this.searched = true;
      this.loading = false;
      this.showModal = this.trains.length > 0;
    }, 1000);
  }

  filterTrains(source: string, destination: string): Train[] {
    if (!source && !destination) return this.trainsList;
    if (source && destination)
      return this.trainsList.filter(t => t.sourceCode === source && t.destinationCode === destination);
    if (source) return this.trainsList.filter(t => t.sourceCode === source);
    return this.trainsList.filter(t => t.destinationCode === destination);
  }

  resetSearchState(): void {
    this.trains = [];
    this.searched = false;
    this.showModal = false;
    this.loading = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  bookTrain(train: Train): void {
    if (this.selectedDate) {
      train.date = this.selectedDate;
    }
    this.bookingService.setSelectedTrain(train);
    this.router.navigate(['/ticket-view']);
  }

  @HostListener('document:mousemove', ['$event'])
  updateMouseCoords(e: MouseEvent): void {
    document.documentElement.style.setProperty('--x', `${e.clientX}px`);
    document.documentElement.style.setProperty('--y', `${e.clientY}px`);
  }
}
