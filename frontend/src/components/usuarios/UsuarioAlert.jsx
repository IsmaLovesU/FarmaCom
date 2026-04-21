import React from 'react';

export default function UsuarioAlert({ mensaje }) {
  if (!mensaje) {
    return null;
  }

  return (
    <div className="bg-error-container/40 border border-error/20 rounded-xl px-4 py-3 text-sm text-on-error-container font-medium">
      {mensaje}
    </div>
  );
}
