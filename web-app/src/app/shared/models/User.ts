import { Booking } from "./Booking";

export interface User {
    name: {
      firstname: string;
      lastname: string;
    };
    email: string;
    password: string;
    bookings: Booking[];
  }
