import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list'
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-menu',
  imports: [
    RouterLink,
    RouterLinkActive,
    MatListModule,
    MatIconModule
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {

  @Input() sidenav!: MatSidenav;
  @Input() isLoggedIn: boolean = false;
  @Output() logoutEvent = new EventEmitter<void>();

  constructor() {}

  closeMenu() {
    if (this.sidenav) {
      this.sidenav.close();
    }
  }

  logout() {
    localStorage.setItem('isLoggedIn', 'false');
    window.location.href = '/home';
    this.closeMenu();
  }
}
