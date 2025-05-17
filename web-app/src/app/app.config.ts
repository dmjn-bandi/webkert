import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideFirebaseApp(() => initializeApp({ projectId: "webkert-429d0", appId: "1:792582963977:web:0b49ce33228bbc440149d8", storageBucket: "webkert-429d0.firebasestorage.app", apiKey: "AIzaSyC0oc20zUcFKFtQ4jGVFQ2Df79QS5c_OAw", authDomain: "webkert-429d0.firebaseapp.com", messagingSenderId: "792582963977" })), provideAuth(() => getAuth()), provideFirestore(() => getFirestore())]
};
