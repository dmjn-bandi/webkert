import { Component } from '@angular/core';
import { Price } from '../../shared/models/Price';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Data } from '../../shared/data/pricing-data';
import { TimeRangeFormatPipe } from '../../shared/pipes/time-range-format.pipe';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-pricing',
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    TimeRangeFormatPipe
    ],
  templateUrl: './pricing.component.html',
  styleUrl: './pricing.component.scss'
})
export class PricingComponent {

  displayedColumns: string[] = ['dayOfWeek', 'timeRange', 'pricePerHour'];

  dataSource: Price[] = Data;

}
