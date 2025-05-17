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
import { Data as PriceData } from '../../shared/data/price-data';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { Data } from '../../shared/data/lane-data';


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
    CommonModule,
    MatProgressSpinnerModule,
    RouterLink

  ],
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent {
  lanes: Lane[] = Data;

  selectedLaneNumb: number | null = null;
  selectedDate: Date = new Date();
  selectedStartHour: number = 10;
  duration: number = 1;
  numberOfPlayers: number = 2;
  total: number = 0;
  valid_data: boolean = false;
  isLoading = false;
  showForm = true;
  showBooking = false;

  prices: Price[] = PriceData;

   get calculatedPrice(): number {
    if (!this.selectedDate || this.duration <= 0) return 0;


    const dayName = this.selectedDate.toLocaleDateString('hu-HU', { weekday: 'long' });
    const capitalizedDay = dayName.charAt(0).toUpperCase() + dayName.slice(1);

     this.total = 0;

    const priceSlot = this.prices.find(p =>
      p.dayOfWeek === capitalizedDay &&
      this.selectedStartHour >= p.timeRangeStart &&
      this.selectedStartHour < p.timeRangeEnd
    );

    if(priceSlot && this.selectedLaneNumb !== null){
        if(this.selectedStartHour + this.duration <= priceSlot.timeRangeEnd) {

            this.total = priceSlot.pricePerHour * this.duration;
            this.valid_data = true;
        }
      }else{
        this.valid_data = false;
        this.total = 0;
      }

    return this.total;
  }

  get endHour(): number {
    return this.selectedStartHour + this.duration;
  }

  makeBooking(): void {
    if(this.valid_data){
    const selectedLane = this.lanes.find(l => l.laneNumb === this.selectedLaneNumb);
    if (!selectedLane) return;

    const start = new Date(this.selectedDate);
    start.setHours(this.selectedStartHour, 0, 0, 0);

    const end = new Date(start);
    end.setHours(start.getHours() + this.duration);

    const newBooking: Booking = {
      laneNumb: selectedLane.laneNumb,
      startTime: start,
      endTime: end,
      numberOfPlayers: this.numberOfPlayers,
      price: this.total
    };

    selectedLane.bookings.push(newBooking);
    this.isLoading = true;
    this.showForm = false;
    console.log('Booking made:', newBooking);
    setTimeout(() => {
      this.isLoading = false;
      this.showBooking = true;
    }, 2000);

  }
}

}
