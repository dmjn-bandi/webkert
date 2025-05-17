import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy
} from '@angular/fire/firestore';
import { Observable, from, switchMap, map, of, take, firstValueFrom } from 'rxjs';
import { Booking } from '../models/Booking';
import { AuthService } from './auth.service';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private readonly BOOKINGS_COLLECTION = 'Bookings';
  private readonly USERS_COLLECTION = 'Users';

  constructor(
    private authService: AuthService,
    private firestore: Firestore
  ) {}

  // CREATE
  async addBooking(booking: Omit<Booking, 'id'>): Promise<Booking> {
    const user = await firstValueFrom(this.authService.currentUser.pipe(take(1)));
    if (!user) throw new Error('No authenticated user');

    const bookingsCollection = collection(this.firestore, this.BOOKINGS_COLLECTION);
    const docRef = await addDoc(bookingsCollection, booking);
    const bookingId = docRef.id;

    await updateDoc(docRef, { id: bookingId });

    // Hozzáadás a felhasználó foglalásaihoz
    const userDocRef = doc(this.firestore, this.USERS_COLLECTION, user.uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      const userData = userDoc.data() as User;
      const bookings = userData.bookings || [];
      bookings.push(bookingId);
      await updateDoc(userDocRef, { bookings });
    }

    return { ...booking, id: bookingId };
  }

  // READ
  getAllBookings(): Observable<Booking[]> {
    return this.authService.currentUser.pipe(
      switchMap(async user => {
        if (!user) return of([]);
        const userDocRef = doc(this.firestore, this.USERS_COLLECTION, user.uid);
        const userDoc = await getDoc(userDocRef);
        if (!userDoc.exists()) return of([]);
        const userData = userDoc.data() as User;
        const bookingIds = userData.bookings || [];
        if (bookingIds.length === 0) return of([]);

        const bookingsCollection = collection(this.firestore, this.BOOKINGS_COLLECTION);
        const bookings: Booking[] = [];
        const batchSize = 10;

        for (let i = 0; i < bookingIds.length; i += batchSize) {
          const batch = bookingIds.slice(i, i + batchSize);
          const q = query(bookingsCollection, where('__name__', 'in', batch));
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach(doc => {
            const data = doc.data();
            bookings.push({
              ...data,
              id: doc.id,
              startTime: (data['startTime'] as any).toDate(),
              endTime: (data['endTime'] as any).toDate()
            } as Booking);
          });
        }

        return of(bookings.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime() ));
      }),
      switchMap(bookings => bookings)
    );
  }

  async getBookingById(bookingId: string): Promise<Booking | null> {
    const user = await firstValueFrom(this.authService.currentUser.pipe(take(1)));
    if (!user) return null;

    const userDocRef = doc(this.firestore, this.USERS_COLLECTION, user.uid);
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) return null;

    const userData = userDoc.data() as User;
    if (!userData.bookings?.includes(bookingId)) return null;

    const bookingDocRef = doc(this.firestore, this.BOOKINGS_COLLECTION, bookingId);
    const bookingSnap = await getDoc(bookingDocRef);
    if (!bookingSnap.exists()) return null;

    return { ...bookingSnap.data(), id: bookingId } as Booking;
  }

  // UPDATE
  async updateBooking(bookingId: string, updatedData: Partial<Booking>): Promise<void> {
    const user = await firstValueFrom(this.authService.currentUser.pipe(take(1)));
    if (!user) throw new Error('No authenticated user');

    const userDocRef = doc(this.firestore, this.USERS_COLLECTION, user.uid);
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) throw new Error('User not found');

    const userData = userDoc.data() as User;
    if (!userData.bookings?.includes(bookingId)) throw new Error('Unauthorized booking update');

    const bookingDocRef = doc(this.firestore, this.BOOKINGS_COLLECTION, bookingId);
    return updateDoc(bookingDocRef, updatedData);
  }

  // DELETE
  async deleteBooking(bookingId: string): Promise<void> {
    const user = await firstValueFrom(this.authService.currentUser.pipe(take(1)));
    if (!user) throw new Error('No authenticated user');

    const userDocRef = doc(this.firestore, this.USERS_COLLECTION, user.uid);
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) throw new Error('User not found');

    const userData = userDoc.data() as User;
    if (!userData.bookings?.includes(bookingId)) throw new Error('Unauthorized booking delete');

    const bookingDocRef = doc(this.firestore, this.BOOKINGS_COLLECTION, bookingId);
    await deleteDoc(bookingDocRef);

    const updatedBookings = userData.bookings.filter(id => id !== bookingId);
    await updateDoc(userDocRef, { bookings: updatedBookings });
  }


getBookingsByLane(laneNumb: number): Observable<Booking[]> {
  const bookingsCollection = collection(this.firestore, this.BOOKINGS_COLLECTION);
  const laneQuery = query(
    bookingsCollection,
    where('laneNumb', '==', laneNumb) 
  );

  return from(getDocs(laneQuery)).pipe(
    map(snapshot =>
      snapshot.docs
        .map(doc => {
          const data = doc.data();
          return {
            ...data,
            id: doc.id,
            startTime: (data['startTime'] as any).toDate(),
            endTime: (data['endTime'] as any).toDate()
          } as Booking;
        })
        .sort((a, b) => a.startTime.getTime() - b.startTime.getTime()) // TypeScript rendezés
    )
  );
}
}
