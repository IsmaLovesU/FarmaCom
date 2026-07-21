import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Mail } from 'lucide-react';
import LoginField from './LoginField';

describe('LoginField', () => {
  it('renderiza el label, el placeholder y el ícono recibidos', () => {
    render(
      <LoginField
        id="correo"
        label="Correo"
        type="email"
        value=""
        onChange={() => {}}
        placeholder="tu@correo.com"
        icon={Mail}
      />,
    );

    expect(screen.getByLabelText('Correo')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('tu@correo.com')).toBeInTheDocument();
  });

  it('llama a onChange al escribir en el input', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <LoginField
        id="correo"
        label="Correo"
        type="email"
        value=""
        onChange={handleChange}
        placeholder="tu@correo.com"
        icon={Mail}
      />,
    );

    await user.type(screen.getByLabelText('Correo'), 'a');

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('marca el input como requerido', () => {
    render(
      <LoginField
        id="clave"
        label="Contraseña"
        type="password"
        value=""
        onChange={() => {}}
        placeholder="********"
        icon={Mail}
      />,
    );

    expect(screen.getByLabelText('Contraseña')).toBeRequired();
  });
});