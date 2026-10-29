// Medidas para adaptar la app a pantallas grandes (laptop / escritorio).
// En el celular todo sigue funcionando igual que antes.

// Ancho máximo del contenido; en ventanas más anchas queda centrado.
export const ANCHO_MAXIMO = 1280;

// Desde este ancho (en px) las filas horizontales pasan a cuadrícula.
export const ANCHO_ESCRITORIO = 900;

// Cuántas columnas caben según el ancho de la ventana.
export function calcularColumnas(ancho: number): number {
  if (ancho >= 1200) return 5;
  if (ancho >= 900) return 4;
  if (ancho >= 600) return 3;
  return 2;
}

// Ancho de cada celda en %, dejando espacio para la separación entre columnas.
export function anchoCelda(columnas: number): `${number}%` {
  return `${100 / columnas}%`;
}

// Para el contenido de una lista: ocupa todo el ancho hasta el máximo y se centra.
export const contenidoCentrado = {
  width: '100%',
  maxWidth: ANCHO_MAXIMO,
  alignSelf: 'center',
} as const;