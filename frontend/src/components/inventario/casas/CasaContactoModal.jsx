import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'motion/react';
import { Check, Pencil, X, Phone, Mail, Plus, Trash2, Truck } from 'lucide-react';
import useContactosCasa from '../../../hooks/useContactosCasa';

function ContactoItem({ label, type = 'text', onActualizar, onEliminar, eliminando }) {
  const [editando, setEditando] = useState(false);
  const [valor, setValor] = useState(label);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  const cancelarEdicion = () => {
    setValor(label);
    setEditando(false);
    setError('');
  };

  const guardarEdicion = async (event) => {
    event.preventDefault();
    if (!valor.trim() || valor.trim() === label) {
      cancelarEdicion();
      return;
    }

    setGuardando(true);
    setError('');
    try {
      await onActualizar(valor.trim());
      setEditando(false);
    } catch (err) {
      setError(err.response?.data?.mensaje || 'No se pudo actualizar');
    } finally {
      setGuardando(false);
    }
  };

  if (editando) {
    return (
      <li className="py-1.5">
        <form onSubmit={guardarEdicion} className="flex items-center gap-2">
          <input
            type={type}
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
          />
          <button
            type="submit"
            disabled={guardando || !valor.trim()}
            className="text-green-600 hover:text-green-700 disabled:opacity-40"
            aria-label="Guardar"
          >
            <Check className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={cancelarEdicion}
            disabled={guardando}
            className="text-slate-400 hover:text-slate-600 disabled:opacity-40"
            aria-label="Cancelar"
          >
            <X className="h-4 w-4" />
          </button>
        </form>
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </li>
    );
  }

  return (
    <li className="flex items-center justify-between gap-2 py-1.5">
      <span className="min-w-0 flex-1 break-words text-sm text-slate-700">{label}</span>
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={() => setEditando(true)}
          disabled={eliminando}
          className="text-primary hover:text-primary/80 disabled:opacity-40"
          aria-label="Editar"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={onEliminar}
          disabled={eliminando}
          className="text-red-500 hover:text-red-700 disabled:opacity-40"
          aria-label="Eliminar"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </li>
  );
}

function AgregarInput({ placeholder, type = 'text', onAgregar }) {
  const [valor, setValor] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
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
          onChange={(e) => setValor(e.target.value)}
          placeholder={placeholder}
          className="flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
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

export default function CasaContactosModal({ isOpen, casa, onClose }) {
  const [eliminandoId, setEliminandoId] = useState(null);

  const {
    telefonos,
    correos,
    proveedores,
    cargando,
    error,
    agregarTelefono,
    actualizarTelefono,
    eliminarTelefono,
    agregarCorreo,
    actualizarCorreo,
    eliminarCorreo,
  } = useContactosCasa(isOpen ? casa?.id_casa : null);

  if (!isOpen || !casa || typeof document === 'undefined') return null;

  const handleEliminarTelefono = async (idTelefono) => {
    setEliminandoId(`tel-${idTelefono}`);
    try {
      await eliminarTelefono(idTelefono);
    } finally {
      setEliminandoId(null);
    }
  };

  const handleEliminarCorreo = async (idEmail) => {
    setEliminandoId(`cor-${idEmail}`);
    try {
      await eliminarCorreo(idEmail);
    } finally {
      setEliminandoId(null);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 p-4 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-6 py-4">
          <h3 className="font-headline text-lg font-extrabold text-primary">
            {casa.nombre}
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

        {/* Body — scrollable */}
        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">
          {cargando && (
            <p className="text-sm text-slate-500">Cargando información...</p>
          )}
          {error && (
            <p className="text-sm font-medium text-red-600">{error}</p>
          )}

          {/* Teléfonos */}
          <section>
            <div className="mb-2 flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              <h4 className="text-sm font-bold text-slate-700">Teléfonos</h4>
            </div>
            {!cargando && telefonos.length === 0 && (
              <p className="text-xs text-slate-400">Sin teléfonos registrados.</p>
            )}
            <ul className="divide-y divide-slate-100">
              {telefonos.map((t) => (
                <ContactoItem
                  key={t.id_telefono}
                  label={t.numero}
                  onActualizar={(numero) => actualizarTelefono(t.id_telefono, numero)}
                  onEliminar={() => handleEliminarTelefono(t.id_telefono)}
                  eliminando={eliminandoId === `tel-${t.id_telefono}`}
                />
              ))}
            </ul>
            <AgregarInput
              placeholder="Ej: +502 2222-3333"
              onAgregar={agregarTelefono}
            />
          </section>

          {/* Correos */}
          <section>
            <div className="mb-2 flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              <h4 className="text-sm font-bold text-slate-700">Correos electrónicos</h4>
            </div>
            {!cargando && correos.length === 0 && (
              <p className="text-xs text-slate-400">Sin correos registrados.</p>
            )}
            <ul className="divide-y divide-slate-100">
              {correos.map((c) => (
                <ContactoItem
                  key={c.id_email}
                  label={c.correo}
                  type="email"
                  onActualizar={(correo) => actualizarCorreo(c.id_email, correo)}
                  onEliminar={() => handleEliminarCorreo(c.id_email)}
                  eliminando={eliminandoId === `cor-${c.id_email}`}
                />
              ))}
            </ul>
            <AgregarInput
              placeholder="Ej: contacto@laboratorio.com"
              type="email"
              onAgregar={agregarCorreo}
            />
          </section>

          {/* Proveedores asociados — solo lectura */}
          <section>
            <div className="mb-2 flex items-center gap-2">
              <Truck className="h-4 w-4 text-primary" />
              <h4 className="text-sm font-bold text-slate-700">Proveedores asociados</h4>
            </div>
            {!cargando && proveedores.length === 0 && (
              <p className="text-xs text-slate-400">
                No hay proveedores vinculados a esta casa farmacéutica.
              </p>
            )}
            {proveedores.length > 0 && (
              <ul className="divide-y divide-slate-100">
                {proveedores.map((p) => (
                  <li
                    key={p.id_proveedor}
                    className="flex items-center justify-between gap-2 py-2"
                  >
                    <span className="text-sm text-slate-700">{p.nombre}</span>
                    <span
                      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${
                        p.activo
                          ? 'border-green-200 bg-green-100 text-green-700'
                          : 'border-red-200 bg-red-100 text-red-600'
                      }`}
                    >
                      {p.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-2 text-[11px] text-slate-400">
              La vinculación de proveedores se gestiona desde el módulo de Proveedores.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-slate-100 px-6 py-4 flex justify-end">
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