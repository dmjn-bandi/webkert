import { Booking } from "./Booking";

export interface User {
    id: string;
    name: {
      firstname: string;
      lastname: string;
    };
    email: string;
    password: string;
    bookings: String[];
  }
