import { Component } from '@angular/core';
import { Booking } from '../../shared/models/Booking';
import { Lane } from '../../shared/models/Lane';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { Price } from '../../shared/models/Price';
import { Data as PriceData } from '../../shared/data/pricing-data';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-booking',
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    CommonModule
  ],
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent {
  lanes: Lane[] = [
    { laneNumb: 1, bookings: [] },
    { laneNumb: 2, bookings: []},
    { laneNumb: 3, bookings: [] }
  ];

  selectedLaneNumb: number | null = null;
  selectedDate: Date = new Date();
  selectedStartHour: number = 10;
  duration: number = 1;
  numberOfPlayers: number = 2;

  prices: Price[] = PriceData;

  get calculatedPrice(): number {
    if (!this.selectedDate || this.duration <= 0) return 0;

    const dayName = this.selectedDate.toLocaleDateString('hu-HU', { weekday: 'long' });
    const capitalizedDay = dayName.charAt(0).toUpperCase() + dayName.slice(1);

    let total = 0;


    for (let hour = this.selectedStartHour; hour < this.endHour; hour++) {
      const priceSlot = this.prices.find(p =>
        p.dayOfWeek === capitalizedDay &&
        hour >= p.timeRangeStart &&
        hour < p.timeRangeEnd
      );
      if (priceSlot) {
        total += priceSlot.pricePerHour;
      }
    }

    return total;
  }

  get endHour(): number {
    return this.selectedStartHour + this.duration;
  }

  makeBooking(): void {
    const selectedLane = this.lanes.find(l => l.laneNumb === this.selectedLaneNumb);
    if (!selectedLane) return;

    const start = new Date(`${this.selectedDate}T${this.selectedStartHour.toString().padStart(2, '0')}:00`);
    const end = new Date(`${this.selectedDate}T${this.endHour.toString().padStart(2, '0')}:00`);

    const overlaps = selectedLane.bookings.some(b =>
      (start < new Date(b.endTime) && end > new Date(b.startTime))
    );

    if (overlaps) {
      alert('Ez az időpont már foglalt!');
      return;
    }

    const newBooking: Booking = {
      laneNumb: selectedLane.laneNumb,
      date: this.selectedDate,
      startTime: start,
      endTime: end,
      numberOfPlayers: this.numberOfPlayers
    };

    selectedLane.bookings.push(newBooking);
    alert('Foglalás sikeres!');
  }
}
