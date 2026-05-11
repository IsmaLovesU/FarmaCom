import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'motion/react';
import { X, Phone, Mail, Plus, Trash2 } from 'lucide-react';
import useContactosProveedor from '../../../hooks/useContactosProveedor';

function ContactoItem({ label, onEliminar, eliminando }) {
  return (
    <li className="flex items-center justify-between gap-2 py-1.5">
      <span className="text-sm text-slate-700">{label}</span>
      <button
        type="button"
        onClick={onEliminar}
        disabled={eliminando}
        className="text-red-500 hover:text-red-700 disabled:opacity-40"
        aria-label="Eliminar"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </li>
  );
}

function AgregarInput({ placeholder, type = 'text', onAgregar }) {
  const [valor, setValor] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!valor.trim()) return;

    setError('');
    setGuardando(true);

    try {
      await onAgregar(valor.trim());
      setValor('');
    } catch (err) {
      setError(err.response?.data?.mensaje || 'No se pudo agregar');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="mt-2 space-y-1">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type={type}
          value={valor}
          onChange={(event) => setValor(event.target.value)}
          placeholder={placeholder}
          className="flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
        />
        <button
          type="submit"
          disabled={guardando || !valor.trim()}
          className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-white disabled:opacity-60"
        >
          <Plus className="h-3.5 w-3.5" />
          Agregar
        </button>
      </form>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

export default function ProveedorContactosModal({ isOpen, proveedor, onClose }) {
  const [eliminandoId, setEliminandoId] = useState(null);
  const {
    telefonos,
    correos,
    cargando,
    error,
    agregarTelefono,
    eliminarTelefono,
    agregarCorreo,
    eliminarCorreo,
  } = useContactosProveedor(isOpen ? proveedor?.id_proveedor : null);

  if (!isOpen || !proveedor || typeof document === 'undefined') return null;

  const handleEliminarTelefono = async (idTelefono) => {
    setEliminandoId(`tel-${idTelefono}`);
    try {
      await eliminarTelefono(idTelefono);
    } finally {
      setEliminandoId(null);
    }
  };

  const handleEliminarCorreo = async (idCorreo) => {
    setEliminandoId(`cor-${idCorreo}`);
    try {
      await eliminarCorreo(idCorreo);
    } finally {
      setEliminandoId(null);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 p-4 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h3 className="font-headline text-lg font-extrabold text-primary">
            Contactos - {proveedor.nombre}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="text-slate-500 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 px-6 py-5">
          {cargando && <p className="text-sm text-slate-500">Cargando contactos...</p>}
          {error && <p className="text-sm text-red-600">{error}</p>}

          <section>
            <div className="mb-2 flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              <h4 className="text-sm font-bold text-slate-700">Telefonos</h4>
            </div>
            {!cargando && telefonos.length === 0 && (
              <p className="text-xs text-slate-400">Sin telefonos registrados.</p>
            )}
            <ul className="divide-y divide-slate-100">
              {telefonos.map((telefono) => (
                <ContactoItem
                  key={telefono.id_telefono}
                  label={telefono.numero}
                  onEliminar={() => handleEliminarTelefono(telefono.id_telefono)}
                  eliminando={eliminandoId === `tel-${telefono.id_telefono}`}
                />
              ))}
            </ul>
            <AgregarInput placeholder="Ej: +502 1234-5678" onAgregar={agregarTelefono} />
          </section>

          <section>
            <div className="mb-2 flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              <h4 className="text-sm font-bold text-slate-700">Correos electronicos</h4>
            </div>
            {!cargando && correos.length === 0 && (
              <p className="text-xs text-slate-400">Sin correos registrados.</p>
            )}
            <ul className="divide-y divide-slate-100">
              {correos.map((correo) => (
                <ContactoItem
                  key={correo.id_email}
                  label={correo.correo}
                  onEliminar={() => handleEliminarCorreo(correo.id_email)}
                  eliminando={eliminandoId === `cor-${correo.id_email}`}
                />
              ))}
            </ul>
            <AgregarInput
              placeholder="Ej: proveedor@farma.com"
              type="email"
              onAgregar={agregarCorreo}
            />
          </section>
        </div>

        <div className="flex justify-end px-6 pb-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cerrar
          </button>
        </div>
      </motion.div>
    </div>,
    document.body,
  );
}
