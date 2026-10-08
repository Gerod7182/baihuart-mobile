// Equivalente a src/app/services/firestore-crud.service.ts.
// Genérico para cualquier colección (productos, galeria, ofertas),
// igual que el servicio compartido que ya usa tu panel /admin en Angular.

import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from './firebase';

export function useColeccion<T>(nombreColeccion: string) {
  const [items, setItems] = useState<(T & { id: string })[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const ref = collection(db, nombreColeccion);
    const unsubscribe = onSnapshot(ref, (snapshot) => {
      const datos = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as (T & { id: string })[];
      setItems(datos);
      setCargando(false);
    });
    return () => unsubscribe();
  }, [nombreColeccion]);

  return { items, cargando };
}

export const crudService = {
  async guardar<T extends object>(
    nombreColeccion: string,
    datos: T,
    idEditando: string | null
  ): Promise<void> {
    if (idEditando) {
      await updateDoc(doc(db, nombreColeccion, idEditando), { ...datos });
    } else {
      await addDoc(collection(db, nombreColeccion), datos);
    }
  },

  async eliminar(nombreColeccion: string, id: string): Promise<void> {
    await deleteDoc(doc(db, nombreColeccion, id));
  },
};
