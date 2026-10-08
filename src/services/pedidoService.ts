// Equivalente a src/app/services/pedido.service.ts.

import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from './firebase';
import { Pedido } from '../models/types';

export const pedidoService = {
  async crearPedido(pedido: Pedido): Promise<void> {
    const pedidosRef = collection(db, 'pedidos');
    await addDoc(pedidosRef, pedido);
  },

  /**
   * No borra el pedido (se mantiene como historial), solo lo marca como
   * 'cancelado' — igual que harías con un pedido real en cualquier
   * tienda. Usa el estado que ya tenía definido el modelo Pedido.
   */
  async cancelarPedido(id: string): Promise<void> {
    await updateDoc(doc(db, 'pedidos', id), { estado: 'cancelado' });
  },

  /**
   * Esta sí borra el documento de Firestore por completo. Solo debe
   * ofrecerse para pedidos que YA están en estado 'cancelado' — borrar
   * un pedido pendiente o entregado perdería un registro real de venta.
   */
  async eliminarPedido(id: string): Promise<void> {
    await deleteDoc(doc(db, 'pedidos', id));
  },
};

/**
 * Historial de pedidos de un usuario, más reciente primero.
 * Igual que en Angular: la primera vez puede que Firestore pida crear
 * un índice compuesto (revisa la consola/logs de Metro por un link).
 */
export function usePedidosDeUsuario(usuarioId?: string) {
  const [pedidos, setPedidos] = useState<(Pedido & { id: string })[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!usuarioId) {
      setPedidos([]);
      setCargando(false);
      return;
    }

    const pedidosRef = collection(db, 'pedidos');
    const q = query(
      pedidosRef,
      where('usuarioId', '==', usuarioId),
      orderBy('fecha', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const datos = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as (Pedido & { id: string })[];
      setPedidos(datos);
      setCargando(false);
    });

    return () => unsubscribe();
  }, [usuarioId]);

  return { pedidos, cargando };
}
