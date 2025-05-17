import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BookingService } from '../../shared/services/booking.service';
import { LaneService } from '../../shared/services/lane.service';
import { Booking } from '../../shared/models/Booking';
import { Lane } from '../../shared/models/Lane';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule as RFM } from '@angular/forms';

@Component({
  selector: 'app-availability-checker',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatButtonModule,
    FormsModule,
    RFM
  ],
  templateUrl: './availability-checker.component.html',
  styleUrls: ['./availability-checker.component.scss']
})
export class AvailabilityCheckerComponent implements OnInit {
  form!: FormGroup;


  lanes: Lane[] = [];
  bookings: Booking[] = [];
  hours = Array.from({ length: 14 }, (_, i) => i + 10);
  displayedColumns: string[] = [];


  constructor(
    private fb: FormBuilder,
    private laneService: LaneService,
    private bookingService: BookingService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
    date: [new Date()]
  });
this.displayedColumns = ['lane', ...this.hours.map(h => h.toString())];

    this.laneService.getLanes().subscribe(data => {
      this.lanes = data;
    });
  }

async checkAvailability() {
  const selectedDate = this.form.value.date!;
  const startOfDay = new Date(selectedDate);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(selectedDate);
  endOfDay.setHours(23, 59, 59, 999);

  const all: Booking[] = [];
  for (const lane of this.lanes) {
    const laneBookings = await this.bookingService.getBookingsByLane(lane.laneNumb).toPromise();
    if (!laneBookings) continue;

   all.push(...laneBookings.filter(b => {
  const start = new Date(b.startTime);
  return start >= startOfDay && start <= endOfDay;
}));
  }

  this.bookings = all;
}

 isHourBooked(laneNumb: number, hour: number): boolean {
  return this.bookings.some(b => {
    const start = new Date(b.startTime);
    const end = new Date(b.endTime);
    return b.laneNumb === laneNumb && hour >= start.getHours() && hour < end.getHours();
  });
}
}
