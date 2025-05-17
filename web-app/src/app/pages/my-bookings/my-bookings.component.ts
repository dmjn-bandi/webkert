import { Component } from '@angular/core';
import { User } from '../../shared/models/User';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import {Data} from '../../shared/data/user-data';

@Component({
  selector: 'app-my-bookings',
  imports: [
      CommonModule,
      MatCardModule,
  ],
  templateUrl: './my-bookings.component.html',
  styleUrl: './my-bookings.component.scss'
})
export class MyBookingsComponent {
  user: User = Data[0];
};
