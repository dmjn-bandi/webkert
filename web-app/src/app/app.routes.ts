import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact/contact.component').then(c => c.ContactComponent)
  },
  {
    path: 'pricing',
    loadComponent: () => import('./pages/pricing/pricing.component').then(c => c.PricingComponent)
  },
  {
    path: 'booking',
    loadComponent: () => import('./pages/booking/booking.component').then(c => c.BookingComponent)
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.component').then(c => c.HomeComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(c => c.LoginComponent)
  },
  {
    path: 'signup',
    loadComponent: () => import('./pages/signup/signup.component').then(c => c.SignupComponent)
  },
  {
    path: 'my-bookings',
    loadComponent: () => import('./pages/my-bookings/my-bookings.component').then(c => c.MyBookingsComponent)
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile.component').then(c => c.ProfileComponent)
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: '**',
    loadComponent: () => import('./shared/page-not-found/page-not-found.component').then(c => c.PageNotFoundComponent)
  }
]

