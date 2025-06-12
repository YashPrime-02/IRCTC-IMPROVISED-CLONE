import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private selectedTrain: any;

  constructor() {}

  setSelectedTrain(train: any): void {
    this.selectedTrain = train;
  }

  getSelectedTrain(): any {
    return this.selectedTrain;
  }
}
