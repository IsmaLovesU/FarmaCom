import React from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'motion/react';
import { UserX, UserCheck, X } from 'lucide-react';

export default function UsuarioEstadoModal({
  isOpen,
  usuario,
  cambiando,
  onClose,
  onConfirm,
}) {
  if (!isOpen || !usuario || typeof document === 'undefined') {
    return null;
  }

  const esActivo = usuario.estado_usuario === 'activo';
  const accion = esActivo ? 'desactivar' : 'activar';
  const Icon = esActivo ? UserX : UserCheck;

  const colorIcono = esActivo
    ? 'bg-red-100 text-red-600'
    : 'bg-green-100 text-green-700';

  const colorBoton = esActivo
    ? 'bg-red-600 hover:bg-red-700'
    : 'bg-green-600 hover:bg-green-700';

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/55 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-200"
      >
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full ${colorIcono}`}>
              <Icon className="w-4 h-4" />
            </span>
            <h3 className="text-lg font-headline font-extrabold text-primary capitalize">
              {accion} usuario
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={cambiando}
            className="text-slate-500 hover:text-slate-700 disabled:opacity-50"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <p className="text-sm text-slate-700 leading-relaxed">
            ¿Estás seguro que deseas{' '}
            <span className="font-bold">{accion}</span> al usuario
            <span className="font-bold text-primary"> {usuario.nombre_usuario}</span>?
          </p>
          <p className="text-xs text-slate-500">
            {esActivo
              ? 'El usuario no podrá iniciar sesión mientras esté inactivo.'
              : 'El usuario podrá volver a iniciar sesión.'}
          </p>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={cambiando}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 disabled:opacity-60"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={cambiando}
              className={`px-5 py-2 rounded-lg text-white text-sm font-semibold disabled:opacity-60 ${colorBoton}`}
            >
              {cambiando ? 'Guardando...' : `Sí, ${accion}`}
            </button>
          </div>
        </div>
      </motion.div>
    </div>,
    document.body,
  );
}
