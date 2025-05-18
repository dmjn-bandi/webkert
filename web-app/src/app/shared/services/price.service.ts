import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData,  query, orderBy, limit, getDocs } from '@angular/fire/firestore';
import { Price } from '../models/Price';
import { from, Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PriceService {
  constructor(private firestore: Firestore) {}

  getPrices(): Observable<Price[]> {
    const pricesCollection = collection(this.firestore, 'Prices');
    return collectionData(pricesCollection, { idField: 'id' }) as Observable<Price[]>;
  }

 getLowestPrice(): Observable<number | null> {
  const pricesCollection = collection(this.firestore, 'Prices');
  const q = query(pricesCollection, orderBy('pricePerHour'), limit(1));
  return from(getDocs(q)).pipe(
    map(snapshot => {
      const doc = snapshot.docs[0];
      return doc ? (doc.data()['pricePerHour'] as number) : null;
    })
  );
}

}
