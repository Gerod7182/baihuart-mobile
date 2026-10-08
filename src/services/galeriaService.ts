// Equivalente a la parte de Firestore de src/app/pages/galeria/galeria.component.ts.
// A diferencia de productos, la galería no se filtra por categoría en la
// consulta — se traen todos los items y se filtran en el cliente, igual
// que hace el Angular original con mostrarItem().

import { collection, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ItemGaleria } from '../models/types';
import { db } from './firebase';

type ItemGaleriaConId = ItemGaleria & { id: string };

export function useGaleria() {
  const [items, setItems] = useState<ItemGaleriaConId[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const galeriaRef = collection(db, 'galeria');

    const unsubscribe = onSnapshot(galeriaRef, (snapshot) => {
      const datos = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ItemGaleriaConId[];
      setItems(datos);
      setCargando(false);
    });

    return () => unsubscribe();
  }, []);

  return { items, cargando };
}
