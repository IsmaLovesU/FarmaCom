-- =========================
-- Pagos con tarjeta via Recurrente
-- =========================

BEGIN;

ALTER TABLE venta
    ADD COLUMN IF NOT EXISTS proveedor_pago VARCHAR(30),
    ADD COLUMN IF NOT EXISTS referencia_pago VARCHAR(120),
    ADD COLUMN IF NOT EXISTS estado_pago VARCHAR(30),
    ADD COLUMN IF NOT EXISTS autorizacion_pago VARCHAR(120),
    ADD COLUMN IF NOT EXISTS tarjeta_ultimos4 CHAR(4);

ALTER TABLE venta
    DROP CONSTRAINT IF EXISTS chk_venta_metodo_pago,
    ADD CONSTRAINT chk_venta_metodo_pago
        CHECK (metodo_pago IN ('efectivo', 'tarjeta'));

ALTER TABLE venta
    DROP CONSTRAINT IF EXISTS chk_venta_pago_tarjeta,
    ADD CONSTRAINT chk_venta_pago_tarjeta
        CHECK (
            (
                metodo_pago = 'efectivo'
                AND proveedor_pago IS NULL
                AND referencia_pago IS NULL
                AND estado_pago IS NULL
                AND autorizacion_pago IS NULL
                AND tarjeta_ultimos4 IS NULL
            )
            OR
            (
                metodo_pago = 'tarjeta'
                AND proveedor_pago IS NOT NULL
                AND referencia_pago IS NOT NULL
                AND estado_pago = 'pagado'
                AND monto_recibido = total
                AND cambio = 0
            )
        );

CREATE UNIQUE INDEX IF NOT EXISTS uq_venta_referencia_pago
    ON venta (proveedor_pago, referencia_pago)
    WHERE referencia_pago IS NOT NULL;

COMMIT;
