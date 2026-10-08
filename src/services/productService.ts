// Equivalente a src/app/services/product.service.ts.
// Angular usa un Observable (RxJS); en React usamos onSnapshot directo
// dentro de un hook, que es el patrón equivalente en este ecosistema.

import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from './firebase';
import { Product } from '../models/types';

/**
 * Hook que trae en tiempo real todos los productos de Firestore que
 * pertenecen a una categoría dada (camisetas, stickers, posters).
 * Si agregas un producto desde /admin en la web, aparece solo aquí
 * también, sin recargar — mismo comportamiento que collectionData
 * en Angular.
 */
export function useProductosPorCategoria(categoria: string) {
  const [productos, setProductos] = useState<Product[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const productosRef = collection(db, 'productos');
    const q = query(productosRef, where('categoria', '==', categoria));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const datos = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];
      setProductos(datos);
      setCargando(false);
    });

    // Se desconecta el listener al desmontar el componente,
    // evita fugas de memoria (equivalente al unsubscribe de RxJS)
    return () => unsubscribe();
  }, [categoria]);

  return { productos, cargando };
}
