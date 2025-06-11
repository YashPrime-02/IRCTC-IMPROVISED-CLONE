import { Component, OnInit, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common'; // ✅ Required for *ngIf, *ngFor
import { FormsModule } from '@angular/forms'; // ✅ If you use template forms

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
  standalone: true, // ✅ Only if you're using standalone components
  imports: [CommonModule, FormsModule], // ✅ Add this line
  templateUrl: './train-search.component.html',
  styleUrls: ['./train-search.component.css']
})
export class TrainSearchComponent implements OnInit {
  stations: Station[] = [];
  trainsList: Train[] = [];
  trains: Train[] = [];
  searched: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any>('assets/train_data.json').subscribe({
      next: data => {
        this.stations = data.stations;
        this.trainsList = data.trains;

        console.log("✅ Stations loaded:", this.stations);
        console.log("✅ Trains loaded:", this.trainsList);
      },
      error: err => {
        console.error('❌ Error loading JSON:', err);
      }
    });
  }

 onSearch(source: string, destination: string): void {
  this.searched = true;

  console.log("🔍 Source Selected:", source);
  console.log("🔍 Destination Selected:", destination);

  if (!source || !destination) {
    console.log("⚠️ Either source or destination is missing.");
    this.trains = [];
    return;
  }

  this.trains = this.trainsList.filter(
    t => t.sourceCode === source && t.destinationCode === destination
  );

  if (this.trains.length > 0) {
    console.log("✅ Matching Trains Found:", this.trains);
  } else {
    console.log("❌ No trains found for selected route.");
  }
}


  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent): void {
    document.documentElement.style.setProperty('--x', `${e.clientX}px`);
    document.documentElement.style.setProperty('--y', `${e.clientY}px`);
  }
}
