import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { PriceService } from '../../shared/services/price.service';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    RouterLink,
    MatIconModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  title = 'home';

  isLoggedIn = false;
  lowestPrice: number | null = null;

  constructor(private priceService: PriceService) {}

  ngOnInit(): void {
    this.checkLoginStatus();
    this.loadLowestPrice();

  }

  checkLoginStatus(): void {
    this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  }

    loadLowestPrice(): void {
    this.priceService.getLowestPrice().subscribe(price => {
      this.lowestPrice = price;
    });
  }
}
