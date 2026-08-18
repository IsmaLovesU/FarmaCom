import React, { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductoFormModal from './ProductoFormModal';

const presentacionesIniciales = [
  { id_presentacion: 1, nombre: 'Caja' },
  { id_presentacion: 2, nombre: 'Blíster' },
];

const propsBase = {
  isOpen: true,
  modoEdicion: false,
  producto: null,
  codigoSugerido: 'MED004',
  categorias: [{ id_categoria: 1, nombre: 'Analgésico' }],
  casas: [{ id_casa: 1, nombre: 'Bayer', activo: true }],
  proveedores: [],
  presentaciones: presentacionesIniciales,
  cargandoDatos: false,
  guardando: false,
  errorFormulario: null,
  onClose: vi.fn(),
  onSubmit: vi.fn(),
  onCrearPresentacion: vi.fn(),
};

function ProductoFormModalConEstado(props) {
  const [presentaciones, setPresentaciones] = useState(presentacionesIniciales);

  const crearPresentacion = async (datos) => {
    const nueva = await props.onCrearPresentacion(datos);
    setPresentaciones((prev) => [...prev, nueva]);
    return nueva;
  };

  return (
    <ProductoFormModal
      {...propsBase}
      {...props}
      presentaciones={presentaciones}
      onCrearPresentacion={crearPresentacion}
    />
  );
}

describe('ProductoFormModal', () => {
  it('lista las presentaciones que vienen del catálogo dinámico, no una lista fija', () => {
    render(<ProductoFormModal {...propsBase} />);

    const select = screen.getByRole('combobox', { name: /Presentación/ });
    expect(within(select).getByText('Caja')).toBeInTheDocument();
    expect(within(select).getByText('Blíster')).toBeInTheDocument();
  });

  it('envía id_presentacion (no un string fijo) al guardar', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<ProductoFormModal {...propsBase} onSubmit={onSubmit} />);

    const [selectPresentacion, selectCategoria, selectCasa] = screen.getAllByRole('combobox');
    await user.selectOptions(selectPresentacion, '2');
    await user.selectOptions(selectCategoria, '1');
    await user.selectOptions(selectCasa, '1');
    await user.type(screen.getByPlaceholderText('Ej. Aspirina Forte'), 'Ibuprofeno Forte');
    await user.type(screen.getByPlaceholderText('Ej. Ácido Acetilsalicílico'), 'Ibuprofeno');
    await user.type(screen.getByPlaceholderText('Ej. 500 mg'), '400 mg');
    await user.type(screen.getByPlaceholderText('0.00'), '10');
    await user.type(screen.getByPlaceholderText('Ej. 6'), '6');
    await user.click(screen.getByRole('button', { name: 'Guardar producto' }));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ id_presentacion: '2' }),
    );
  });

  it('permite guardar un producto sin concentración', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<ProductoFormModal {...propsBase} onSubmit={onSubmit} />);

    const concentracion = screen.getByRole('textbox', { name: /Concentración/ });
    expect(concentracion).not.toBeRequired();

    const [selectPresentacion, selectCategoria, selectCasa] = screen.getAllByRole('combobox');
    await user.selectOptions(selectPresentacion, '1');
    await user.selectOptions(selectCategoria, '1');
    await user.selectOptions(selectCasa, '1');
    await user.type(screen.getByPlaceholderText('Ej. Aspirina Forte'), 'Alcohol en gel');
    await user.type(screen.getByPlaceholderText('Ej. Ácido Acetilsalicílico'), 'Alcohol');
    await user.type(screen.getByPlaceholderText('0.00'), '15');
    await user.type(screen.getByPlaceholderText('Ej. 6'), '6');
    await user.click(screen.getByRole('button', { name: 'Guardar producto' }));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ concentracion: '' }),
    );
  });

  it('permite crear una presentación nueva desde un modal, sin salir del formulario', async () => {
    const user = userEvent.setup();
    const onCrearPresentacion = vi.fn().mockResolvedValue({ id_presentacion: 3, nombre: 'Frasco' });
    render(<ProductoFormModalConEstado onCrearPresentacion={onCrearPresentacion} />);

    await user.click(screen.getByRole('button', { name: /Nueva presentación/ }));
    expect(screen.getByRole('heading', { name: 'Nueva presentación' })).toBeInTheDocument();

    await user.type(screen.getByPlaceholderText('Ej. Frasco, Sobre, Ampolla...'), 'Frasco');
    await user.click(screen.getByRole('button', { name: 'Crear presentación' }));

    expect(onCrearPresentacion).toHaveBeenCalledWith({ nombre: 'Frasco' });
    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: 'Nueva presentación' })).not.toBeInTheDocument();
    });
    expect(screen.getByRole('combobox', { name: /Presentación/ })).toHaveValue('3');
  });
});
