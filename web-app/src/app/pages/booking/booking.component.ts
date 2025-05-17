import { Component, OnInit } from '@angular/core';
import { Booking } from '../../shared/models/Booking';
import { Lane } from '../../shared/models/Lane';
import { Price } from '../../shared/models/Price';
import { BookingService } from '../../shared/services/booking.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { PriceService } from '../../shared/services/price.service';
import { LaneService } from '../../shared/services/lane.service';


import {
  collection,
  collectionData,
  Firestore,
  doc,
  getDoc
} from '@angular/fire/firestore';
import { Observable, firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    MatProgressSpinnerModule,
    RouterLink,
  ]
})
export class BookingComponent implements OnInit {
  lanes: Lane[] = [];
  prices: Price[] = [];

  selectedLaneNumb: number | null = null;
  selectedDate: Date = new Date();
  selectedStartHour: number = 10;
  duration: number = 1;
  numberOfPlayers: number = 2;
  total: number = 0;
  valid_data = false;
  isLoading = false;
  showForm = true;
  showBooking = false;
  overlapWarning = false;

  constructor(
    private firestore: Firestore,
    private bookingService: BookingService,
    private priceService: PriceService,
    private laneService: LaneService

  ) {}

  async ngOnInit(): Promise<void> {

  this.laneService.getLanes().subscribe(data => {
    this.lanes = data;
  });

  this.priceService.getPrices().subscribe(data => {
    this.prices = data;
  });
  }

  get endHour(): number {
    return this.selectedStartHour + this.duration;
  }

  async calculatePrice(): Promise<number> {
  this.valid_data = false;
  this.total = 0;
  this.overlapWarning = false;

  if (!this.selectedDate || this.duration <= 0 || this.selectedLaneNumb === null) return 0;

  const start = new Date(this.selectedDate);
  start.setHours(this.selectedStartHour, 0, 0, 0);

  const end = new Date(start);
  end.setHours(start.getHours() + this.duration);

  const dayName = this.selectedDate.toLocaleDateString('hu-HU', { weekday: 'long' });
  const capitalizedDay = dayName.charAt(0).toUpperCase() + dayName.slice(1);

  const selectedLane = this.lanes.find(l => l.laneNumb === this.selectedLaneNumb);
  if (!selectedLane) return 0;

  for (const bookingId of selectedLane.bookings) {
    const docRef = doc(this.firestore, 'Bookings', bookingId);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      const existingBooking = snapshot.data() as Booking;
      const existingStart = new Date((existingBooking.startTime as any).seconds * 1000);
      const existingEnd = new Date((existingBooking.endTime as any).seconds * 1000);

      const isOverlap =
        (start >= existingStart && start < existingEnd) ||
        (end > existingStart && end <= existingEnd) ||
        (start <= existingStart && end >= existingEnd);

      if (isOverlap) {
        this.overlapWarning = true;
        return 0;
      }
    }
  }

  let priceSum = 0;
  for (let hour = this.selectedStartHour; hour < this.endHour; hour++) {
    const slot = this.prices.find(p =>
      p.dayOfWeek === capitalizedDay &&
      hour >= p.timeRangeStart &&
      hour < p.timeRangeEnd
    );

    if (!slot) {
      return 0;
    }

    priceSum += slot.pricePerHour;
  }

  this.total = priceSum;
  this.valid_data = true;
  return this.total;
}

  async makeBooking(): Promise<void> {
    await this.calculatePrice();
    if (!this.valid_data || this.selectedLaneNumb === null) return;

    const start = new Date(this.selectedDate);
    start.setHours(this.selectedStartHour, 0, 0, 0);

    const end = new Date(start);
    end.setHours(start.getHours() + this.duration);

    const newBooking: Omit<Booking, 'id'> = {
      laneNumb: this.selectedLaneNumb,
      startTime: start,
      endTime: end,
      numberOfPlayers: this.numberOfPlayers,
      price: this.total
    };

    this.isLoading = true;
    this.showForm = false;

    try {
      const booking = await this.bookingService.addBooking(newBooking);
      await this.laneService.addBookingToLane(this.selectedLaneNumb, booking.id); 

      this.showBooking = true;
    } catch (error) {
      console.error('Foglalás sikertelen:', error);
      this.showForm = true;
    } finally {
      this.isLoading = false;
    }
  }
}
