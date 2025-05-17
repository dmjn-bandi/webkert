import { Component, OnInit } from '@angular/core';
import { Booking } from '../../shared/models/Booking';
import { BookingService } from '../../shared/services/booking.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { PriceFtPipe } from '../../shared/pipes/price-ft.pipe';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.scss'],
  imports: [
    CommonModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    PriceFtPipe
  ]
})

export class MyBookingsComponent implements OnInit {
  bookings: Booking[] = [];
  editingId: string | null = null;
  editedPlayers: { [bookingId: string]: number } = {};

isPast(booking: Booking): boolean {
  const now = new Date();
  return new Date(booking.startTime).getTime() < now.getTime();
}

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.bookingService.getAllBookings().subscribe(bookings => {
      this.bookings = bookings;
    });
  }

  enableEdit(booking: Booking): void {
    this.editingId = booking.id;
    this.editedPlayers[booking.id] = booking.numberOfPlayers;
  }

  cancelEdit(): void {
    this.editingId = null;
  }

  async savePlayers(booking: Booking): Promise<void> {
    const updatedPlayers = this.editedPlayers[booking.id];
    if (updatedPlayers > 0 && booking.id) {
      await this.bookingService.updateBooking(booking.id, { numberOfPlayers: updatedPlayers });
      booking.numberOfPlayers = updatedPlayers;
    }
    this.editingId = null;
  }

  async deleteBooking(bookingId: string): Promise<void> {
    await this.bookingService.deleteBooking(bookingId);
    this.bookings = this.bookings.filter(b => b.id !== bookingId);
  }
}
