import { Booking } from './Booking';

export interface Lane {
  laneNumb: number;
  bookings: Booking[];
}
