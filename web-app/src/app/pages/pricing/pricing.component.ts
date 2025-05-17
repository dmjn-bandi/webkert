import { Component, OnInit } from '@angular/core';
import { Price } from '../../shared/models/Price';
import { PriceService } from '../../shared/services/price.service';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { TimeRangeFormatPipe } from '../../shared/pipes/time-range-format.pipe';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pricing',
  standalone: true,
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss'],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    TimeRangeFormatPipe
  ]
})
export class PricingComponent implements OnInit {
  displayedColumns: string[] = ['dayOfWeek', 'timeRange', 'pricePerHour'];
  prices: Price[] = [];

  constructor(private priceService: PriceService) {}

  ngOnInit(): void {
    this.priceService.getPrices().subscribe(data => {
      this.prices = data.sort((a, b) => {
        const order = ['Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek', 'Szombat', 'Vasárnap'];
        const dayA = order.indexOf(a.dayOfWeek);
        const dayB = order.indexOf(b.dayOfWeek);
        return dayA !== dayB ? dayA - dayB : a.timeRangeStart - b.timeRangeStart;
      });
    });
  }
}
