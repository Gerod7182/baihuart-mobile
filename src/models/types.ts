// Mismos modelos exactos de baihuart-app (src/app/models/*.ts),
// unificados en un solo archivo por simplicidad en el proyecto móvil.

export interface Product {
  id: string;
  img: string;
  precio: number;
  cantidad?: number;
  nombre?: string;
  codigo?: string;
  categoria?: string;
}

export interface Producto {
  nombre: string;
  precio: number;
  img: string;
  codigo: string;
  categoria: 'camisetas' | 'stickers' | 'posters';
}

export interface ItemGaleria {
  img: string;
  categoria: 'espiritual' | 'anime' | 'pop';
  titulo: string;
  descripcion: string;
}

export interface Oferta {
  nombre: string;
  img: string;
  precioAntes: number;
  precioAhora: number;
}

export interface ItemPedido {
  productoId: string;
  nombre: string;
  img: string;
  precio: number;
  cantidad: number;
}

export interface Pedido {
  usuarioId: string;
  usuarioEmail: string;
  fecha: string;
  estado: 'pendiente' | 'entregado' | 'cancelado';
  total: number;
  items: ItemPedido[];
}
