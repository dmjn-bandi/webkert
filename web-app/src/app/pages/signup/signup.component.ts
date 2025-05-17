import { Component } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import {  RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { User } from '../../shared/models/User';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    RouterLink
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  signUpForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    rePassword: new FormControl('', [Validators.required]),
    name: new FormGroup({
      firstname: new FormControl('', [Validators.required, Validators.minLength(2)]),
      lastname: new FormControl('', [Validators.required, Validators.minLength(2)])
    })
  });

  isLoading = false;
  showForm = true;
  signupError = '';

  constructor() {}

  signup(): void {
    if (this.signUpForm.invalid) {
      this.signupError = 'Kérem javítson ki minden mezőt!';
      return;
    }

    const password = this.signUpForm.get('password');
    const rePassword = this.signUpForm.get('rePassword');

    if (password?.value !== rePassword?.value) {
      return;
    }

    this.isLoading = true;
    this.showForm = false;

    const newUser: User = {
      name: {
        firstname: this.signUpForm.value.name?.firstname || '',
        lastname: this.signUpForm.value.name?.lastname || ''
      },
      email: this.signUpForm.value.email || '',
      password: this.signUpForm.value.password || '',
      bookings: [],
    };


    localStorage.setItem('isLoggedIn', 'true');


    setTimeout(() => {
      window.location.href = '/home';
    }, 2000);
  }
}
