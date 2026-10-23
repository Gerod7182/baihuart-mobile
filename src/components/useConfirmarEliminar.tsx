import { useState } from 'react';
import { crudService } from '../services/crudService';
import { ConfirmarModal } from './ConfirmarModal';

// Pide confirmación antes de borrar y ejecuta el borrado.
// Funciona igual en celular, navegador y escritorio (no usa Alert).
export function useConfirmarEliminar(coleccion: string, mensaje: string) {
  const [idPendiente, setIdPendiente] = useState<string | null>(null);
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState('');

  const cerrar = () => {
    setIdPendiente(null);
    setError('');
  };

  const confirmar = async () => {
    if (!idPendiente) return;
    setProcesando(true);
    setError('');
    try {
      await crudService.eliminar(coleccion, idPendiente);
      setIdPendiente(null);
    } catch (e) {
      console.error('No se pudo eliminar:', e);
      setError('No se pudo eliminar. Revisa tu conexión y tus permisos.');
    } finally {
      setProcesando(false);
    }
  };

  const modalEliminar = (
    <ConfirmarModal
      visible={idPendiente !== null}
      titulo="Eliminar"
      mensaje={error || mensaje}
      textoConfirmar="Eliminar"
      textoCancelar="Cancelar"
      procesando={procesando}
      onConfirmar={() => void confirmar()}
      onCancelar={cerrar}
    />
  );

  return { pedirEliminar: setIdPendiente, modalEliminar };
}