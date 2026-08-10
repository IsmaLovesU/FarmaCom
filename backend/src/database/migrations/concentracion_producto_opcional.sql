-- Permite registrar productos que no requieren concentración.
-- Los valores vacíos y el marcador histórico N/D se normalizan a NULL.

BEGIN;

ALTER TABLE producto
    ALTER COLUMN concentracion DROP NOT NULL;

UPDATE producto
SET concentracion = NULL
WHERE TRIM(concentracion) = ''
   OR UPPER(TRIM(concentracion)) = 'N/D';

DROP INDEX IF EXISTS uq_producto_identidad;

CREATE UNIQUE INDEX uq_producto_identidad
    ON producto (
        LOWER(TRIM(nombre_generico)),
        COALESCE(LOWER(TRIM(concentracion)), ''),
        id_casa,
        id_presentacion
    );

DROP INDEX IF EXISTS idx_producto_familia;

CREATE INDEX idx_producto_familia
    ON producto (
        LOWER(TRIM(nombre_generico)),
        COALESCE(LOWER(TRIM(concentracion)), ''),
        id_casa
    );

COMMIT;
