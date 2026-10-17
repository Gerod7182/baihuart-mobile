// Equivalente a src/app/services/cart.service.ts.
// Actualizado para aceptar una cantidad específica al agregar (antes
// siempre sumaba de a 1), necesario para el selector de cantidad de la
// vista rápida de producto.

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Product } from '../models/types';

const CLAVE_CARRITO = 'carrito';

// AsyncStorage no avisa cuando algo cambia, así que el servicio lleva su propia
// lista de "oyentes" (por ejemplo, el contador sobre la pestaña del carrito).
type Oyente = () => void;
const oyentes = new Set<Oyente>();

function notificarCambio() {
  oyentes.forEach((oyente) => oyente());
}

async function getCarrito(): Promise<Product[]> {
  const data = await AsyncStorage.getItem(CLAVE_CARRITO);
  return data ? JSON.parse(data) : [];
}

async function setCarrito(carrito: Product[]): Promise<void> {
  await AsyncStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
  notificarCambio();
}

export const cartService = {
  async obtenerItems(): Promise<Product[]> {
    return getCarrito();
  },

  async contarItems(): Promise<number> {
    const carrito = await getCarrito();
    return carrito.reduce((acc, item) => acc + (item.cantidad ?? 0), 0);
  },

  async agregarItem(
    id: string,
    img: string,
    precio: number,
    nombre?: string,
    cantidad: number = 1
  ): Promise<void> {
    const carrito = await getCarrito();
    const existente = carrito.find((item) => item.id === id);

    if (existente) {
      existente.cantidad = (existente.cantidad ?? 0) + cantidad;
    } else {
      carrito.push({ id, img, precio, nombre, cantidad });
    }

    await setCarrito(carrito);
  },

  async eliminarItem(id: string): Promise<void> {
    const carrito = await getCarrito();
    await setCarrito(carrito.filter((item) => item.id !== id));
  },

  /**
   * Para el selector +/- directo en la pantalla del carrito. Si la
   * nueva cantidad llega a 0 o menos, el producto se quita solo —
   * así el botón "−" también sirve como "eliminar" cuando llega a 1.
   */
  async actualizarCantidad(id: string, nuevaCantidad: number): Promise<void> {
    const carrito = await getCarrito();

    if (nuevaCantidad <= 0) {
      await setCarrito(carrito.filter((item) => item.id !== id));
      return;
    }

    const existente = carrito.find((item) => item.id === id);
    if (existente) {
      existente.cantidad = nuevaCantidad;
      await setCarrito(carrito);
    }
  },

  async vaciarCarrito(): Promise<void> {
    await setCarrito([]);
  },
};

/**
 * Cantidad total de artículos en el carrito, siempre actualizada: se
 * recalcula sola cada vez que el carrito cambia desde cualquier pantalla.
 */
export function useCantidadCarrito() {
  const [cantidad, setCantidad] = useState(0);

  useEffect(() => {
    const actualizar = async () => {
      try {
        setCantidad(await cartService.contarItems());
      } catch (error) {
        console.error('No se pudo contar los artículos del carrito:', error);
      }
    };

    const oyente = () => {
      void actualizar();
    };

    oyente();
    oyentes.add(oyente);
    return () => {
      oyentes.delete(oyente);
    };
  }, []);

  return cantidad;
}
