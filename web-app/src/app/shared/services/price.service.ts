import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Price } from '../models/Price';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PriceService {
  constructor(private firestore: Firestore) {}

  getPrices(): Observable<Price[]> {
    const pricesCollection = collection(this.firestore, 'Prices');
    return collectionData(pricesCollection, { idField: 'id' }) as Observable<Price[]>;
  }
}
