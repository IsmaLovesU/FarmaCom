const RecurrenteService = require('./RecurrenteService');

describe('RecurrenteService', () => {
  const fetchOriginal = global.fetch;
  const secretOriginal = process.env.RECURRENTE_SECRET_KEY;
  const frontendOriginal = process.env.FRONTEND_URL;

  beforeEach(() => {
    process.env.RECURRENTE_SECRET_KEY = 'rk_test_123';
    process.env.FRONTEND_URL = 'http://localhost:5173';
    global.fetch = jest.fn();
  });

  afterEach(() => {
    global.fetch = fetchOriginal;
    process.env.RECURRENTE_SECRET_KEY = secretOriginal;
    process.env.FRONTEND_URL = frontendOriginal;
  });

  it('crea un checkout de venta con monto en centavos y moneda GTQ', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      status: 201,
      text: jest.fn().mockResolvedValue(JSON.stringify({
        id: 'ch_test_123',
        status: 'unpaid',
        checkout_url: 'https://app.recurrente.com/checkout-session/ch_test_123',
        currency: 'GTQ',
        live_mode: false,
      })),
    });

    const resultado = await RecurrenteService.crearCheckoutVenta({
      totalCentavos: 2500,
      idSucursal: 1,
      idCliente: null,
      idUsuario: 7,
    });

    expect(global.fetch).toHaveBeenCalledWith(
      'https://app.recurrente.com/api/checkouts',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'X-SECRET-KEY': 'rk_test_123',
          'Content-Type': 'application/json',
        }),
      }),
    );
    const [, opciones] = global.fetch.mock.calls[0];
    expect(JSON.parse(opciones.body)).toMatchObject({
      items: [
        {
          name: 'Venta FarmaCom',
          amount_in_cents: 2500,
          currency: 'GTQ',
          charge_type: 'one_time',
          quantity: 1,
          payment_method_types: ['card'],
        },
      ],
      success_url: 'http://localhost:5173/ventas?recurrente=exito',
      cancel_url: 'http://localhost:5173/ventas?recurrente=cancelado',
    });
    expect(resultado.id).toBe('ch_test_123');
  });

  it('rechaza checkouts menores a Q5.00', async () => {
    await expect(
      RecurrenteService.crearCheckoutVenta({
        totalCentavos: 499,
        idSucursal: 1,
        idCliente: null,
        idUsuario: 7,
      }),
    ).rejects.toMatchObject({
      status: 400,
      message: 'Recurrente requiere un monto minimo de Q5.00 para pagos en GTQ',
    });
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('incluye detalles de validacion devueltos por Recurrente', async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      status: 400,
      text: jest.fn().mockResolvedValue(JSON.stringify({
        message: 'Checkout Inválido',
        errors: {
          base: ['Debes tener al menos un método de pago activado'],
        },
      })),
    });

    await expect(
      RecurrenteService.crearCheckoutVenta({
        totalCentavos: 500,
        idSucursal: 1,
        idCliente: null,
        idUsuario: 7,
      }),
    ).rejects.toMatchObject({
      status: 400,
      message: 'Checkout Inválido: Debes tener al menos un método de pago activado',
    });
  });

  it('valida que un checkout pagado coincida con el total esperado', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      text: jest.fn().mockResolvedValue(JSON.stringify({
        id: 'ch_test_123',
        status: 'paid',
        total_in_cents: 2500,
        currency: 'GTQ',
        latest_intent: { id: 'pi_123', data: { auth_code: 'auth_123' } },
        payment_method: { card: { last4: '4242' } },
      })),
    });

    await expect(
      RecurrenteService.validarCheckoutPagado('ch_test_123', 2500),
    ).resolves.toEqual({
      referencia_pago: 'ch_test_123',
      estado_pago: 'pagado',
      autorizacion_pago: 'auth_123',
      tarjeta_ultimos4: '4242',
    });
  });

  it('rechaza un checkout que no esta pagado', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      text: jest.fn().mockResolvedValue(JSON.stringify({
        id: 'ch_unpaid',
        status: 'unpaid',
        total_in_cents: 2500,
        currency: 'GTQ',
      })),
    });

    await expect(
      RecurrenteService.validarCheckoutPagado('ch_unpaid', 2500),
    ).rejects.toMatchObject({
      status: 409,
      message: 'El pago con tarjeta aun no esta confirmado',
    });
  });
});
