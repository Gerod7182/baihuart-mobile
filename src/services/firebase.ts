// Instala primero:
//   npx expo install firebase @react-native-async-storage/async-storage
//
// Usa el SDK web de Firebase (no @react-native-firebase) porque es más
// simple de configurar con Expo y funciona igual de bien para Firestore
// y Auth. Mismas credenciales que src/environments/environment.ts en
// baihuart-app — es el mismo proyecto de Firebase, mismos datos.

import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: 'AIzaSyCK9x9FNmWvkp7jpW6JHeYswL_XjpwjWcU',
  authDomain: 'baihuart-store.firebaseapp.com',
  projectId: 'baihuart-store',
  storageBucket: 'baihuart-store.firebasestorage.app',
  messagingSenderId: '96373904930',
  appId: '1:96373904930:web:62e000ea52ae074344dc7b',
};

// Evita re-inicializar la app si el archivo se recarga en caliente (hot reload)
export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);

// En web (npm run web) getAuth basta; en Android/iOS nativo hace falta
// persistencia manual con AsyncStorage para que la sesión sobreviva
// al cerrar la app (en la web Angular esto lo hacía el navegador solo).
export const auth =
  Platform.OS === 'web'
    ? getAuth(app)
    : initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
      });
