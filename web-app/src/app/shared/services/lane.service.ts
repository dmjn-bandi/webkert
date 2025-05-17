import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, getDocs, query, where, updateDoc } from '@angular/fire/firestore';
import { Lane } from '../models/Lane';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LaneService {
  constructor(private firestore: Firestore) {}

  getLanes(): Observable<Lane[]> {
    const lanesCollection = collection(this.firestore, 'Lanes');
    return collectionData(lanesCollection, { idField: 'id' }) as Observable<Lane[]>;
  }

  async addBookingToLane(laneNumb: number, bookingId: string): Promise<void> {
    const lanesCollection = collection(this.firestore, 'Lanes');
    const q = query(lanesCollection, where('laneNumb', '==', laneNumb));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      throw new Error(`Nincs ilyen laneNumb: ${laneNumb}`);
    }

    const laneDoc = snapshot.docs[0];
    const laneData = laneDoc.data() as Lane;
    const updatedBookings = [...(laneData.bookings || []), bookingId];

    const laneRef = doc(this.firestore, 'Lanes', laneDoc.id);
    await updateDoc(laneRef, { bookings: updatedBookings });
  }
}
