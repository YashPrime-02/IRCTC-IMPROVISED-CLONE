import { Component, OnInit, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Station {
  stationID: number;
  stationName: string;
  stationCode: string;
}

interface Train {
  trainName: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  sourceCode: string;
  destinationCode: string;
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
  searched: boolean = false;
  showModal: boolean = false;
  loading: boolean = false;
  selectedDate: string = ''; // Journey date

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any>('assets/train_data.json').subscribe({
      next: data => {
        this.stations = data.stations;
        this.trainsList = data.trains;
      },
      error: err => {
        console.error('❌ Error loading JSON:', err);
      }
    });
  }

  onSearch(source: string, destination: string): void {
    this.searched = false;
    this.trains = [];
    this.loading = true;
    this.showModal = false;

    setTimeout(() => {
      if (!source && !destination) {
        this.trains = this.trainsList;
      } else if (source && destination) {
        this.trains = this.trainsList.filter(
          t => t.sourceCode === source && t.destinationCode === destination
        );
      } else if (source) {
        this.trains = this.trainsList.filter(t => t.sourceCode === source);
      } else if (destination) {
        this.trains = this.trainsList.filter(t => t.destinationCode === destination);
      }

      this.searched = true;
      this.loading = false;
      this.showModal = this.trains.length > 0;
    }, 1000); // Simulate network delay
  }

  closeModal(): void {
    this.showModal = false;
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent): void {
    document.documentElement.style.setProperty('--x', `${e.clientX}px`);
    document.documentElement.style.setProperty('--y', `${e.clientY}px`);
  }
}
