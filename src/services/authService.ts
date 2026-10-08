// Equivalente a src/app/services/auth.service.ts.
// signInWithEmailAndPassword, createUserWithEmailAndPassword, etc. son
// exactamente las mismas funciones del SDK web de Firebase — funcionan
// igual en React Native, solo cambia cómo se importa `auth`.

import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    sendEmailVerification,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    User,
} from 'firebase/auth';
import { useEffect, useState } from 'react';
import { auth } from './firebase';

const ADMIN_EMAIL = 'g3rm4n7115@gmail.com';

/**
 * Hook que expone el usuario actual (o null) en tiempo real,
 * equivalente al Observable user$ de Angular.
 */
export function useUsuarioActual() {
  const [usuario, setUsuario] = useState<User | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUsuario(u);
      setCargando(false);
    });
    return () => unsubscribe();
  }, []);

  const esAdmin = usuario?.email === ADMIN_EMAIL;

  return { usuario, cargando, esAdmin };
}

export const authService = {
  login(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
  },

  async register(email: string, password: string, nombre: string) {
    const credenciales = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(credenciales.user, { displayName: nombre });
    await sendEmailVerification(credenciales.user);
    return credenciales;
  },

  logout() {
    return signOut(auth);
  },

  get usuarioActual() {
    return auth.currentUser;
  },
};