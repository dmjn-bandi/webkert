import { Injectable } from '@angular/core';
import { Firestore, doc, getDoc, collection, query, where, getDocs } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { Observable, from, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { User } from '../models/User';
import { Booking } from '../models/Booking';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private firestore: Firestore,
    private authService: AuthService
  ) { }

  getUserProfile(): Observable<{
    user: User | null,
    bookings: Booking[],
  }> {
    return this.authService.currentUser.pipe(
      switchMap(authUser => {
        if (!authUser) {
          return of({
            user: null,
            bookings: [],
          });
        }

        return from(this.fetchUserWithBookings(authUser.uid));
      })
    );
  }

  private async fetchUserWithBookings(userId: string): Promise<{
  user: User | null,
  bookings: Booking[],
}> {
  try {
    const userDocRef = doc(this.firestore, 'Users', userId);
    const userSnapshot = await getDoc(userDocRef);

    if (!userSnapshot.exists()) {
      return {
        user: null,
        bookings: [],
      };
    }

    const userData = userSnapshot.data() as User;
    const user = { ...userData, id: userId };

    if (!user.bookings || user.bookings.length === 0) {
      return {
        user,
        bookings: [],
      };
    }

    const bookingsCollection = collection(this.firestore, 'Bookings');
    const q = query(bookingsCollection, where('__name__', 'in', user.bookings));
    const bookingsSnapshot = await getDocs(q);

    const bookings: Booking[] = [];
    bookingsSnapshot.forEach(doc => {
      bookings.push({ ...doc.data(), id: doc.id } as Booking);
    });

    bookings.sort((a, b) =>
      new Date(b.startTime as any).getTime() - new Date(a.startTime as any).getTime()
    );

    return {
      user,
      bookings,
    };
  } catch (error) {
    console.error('Hiba a felhasználói adatok betöltése során:', error);
    return {
      user: null,
      bookings: [],
    };
  }
}
}
