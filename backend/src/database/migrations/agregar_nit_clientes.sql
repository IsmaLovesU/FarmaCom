-- Agrega NIT a clientes en bases de datos existentes.
-- Es idempotente: puede ejecutarse más de una vez sin duplicar objetos.

BEGIN;

ALTER TABLE cliente
    ADD COLUMN IF NOT EXISTS nit VARCHAR(20);

CREATE UNIQUE INDEX IF NOT EXISTS uq_cliente_nit
    ON cliente (nit)
    WHERE nit IS NOT NULL;

COMMIT;
