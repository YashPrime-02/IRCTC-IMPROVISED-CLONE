import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainSearchComponent } from './train-search.component';

describe('TrainSearchComponent', () => {
  let component: TrainSearchComponent;
  let fixture: ComponentFixture<TrainSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrainSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
