import { describe, it, expect, beforeEach } from 'vitest';
import { getStoredAuth, saveSession, clearSession } from './auth';

const usuarioEjemplo = { id_usuario: 1, nombre_usuario: 'jperez', id_sucursal: 2 };

describe('utils/auth', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('saveSession + getStoredAuth', () => {
    it('guarda y recupera el estado de sesión completo', () => {
      saveSession({ usuario: usuarioEjemplo, sucursalActivaId: 2 });

      const resultado = getStoredAuth();

      expect(resultado).toEqual({ usuario: usuarioEjemplo, sucursalActivaId: 2 });
    });

    it('usa el id_sucursal del usuario si no viene sucursalActivaId', () => {
      saveSession({ usuario: usuarioEjemplo });

      const resultado = getStoredAuth();

      expect(resultado.sucursalActivaId).toBe(2);
    });
  });

  describe('getStoredAuth', () => {
    it('devuelve null si no hay nada guardado', () => {
      expect(getStoredAuth()).toBeNull();
    });

    it('devuelve null y limpia el storage si el JSON está corrupto', () => {
      localStorage.setItem('auth', '{json-invalido');

      const resultado = getStoredAuth();

      expect(resultado).toBeNull();
      expect(localStorage.getItem('auth')).toBeNull();
    });

    it('migra la clave "usuario" al nuevo formato', () => {
      localStorage.setItem('usuario', JSON.stringify(usuarioEjemplo));

      const resultado = getStoredAuth();

      expect(resultado).toEqual({ usuario: usuarioEjemplo, sucursalActivaId: 2 });
    });
  });

  describe('clearSession', () => {
    it('elimina ambas claves de storage', () => {
      saveSession({ usuario: usuarioEjemplo });
      localStorage.setItem('usuario', JSON.stringify(usuarioEjemplo));

      clearSession();

      expect(localStorage.getItem('auth')).toBeNull();
      expect(localStorage.getItem('usuario')).toBeNull();
    });
  });
});