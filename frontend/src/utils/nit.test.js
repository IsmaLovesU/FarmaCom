import { describe, expect, it } from 'vitest';
import { esNitValido, normalizarNit } from './nit';

describe('utilidades de NIT', () => {
  it('elimina espacios y convierte el verificador a mayúscula', () => {
    expect(normalizarNit(' 1234567 - k ')).toBe('1234567-K');
  });

  it.each(['1234567-1', '1234567-K', '12345671', ''])('acepta el valor %s', (nit) => {
    expect(esNitValido(nit)).toBe(true);
  });

  it.each(['ABC-123', '123-XY', '12.345-6'])('rechaza el valor %s', (nit) => {
    expect(esNitValido(nit)).toBe(false);
  });
});
