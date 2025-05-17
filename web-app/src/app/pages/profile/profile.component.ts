import { Component } from '@angular/core';
import { User } from '../../shared/models/User';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { Data } from '../../shared/data/user-data';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  user: User = Data[0];

}
