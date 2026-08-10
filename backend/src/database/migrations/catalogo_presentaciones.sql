-- Convierte la presentación hardcodeada de producto en un catálogo administrable.
-- El lote continúa relacionado únicamente con producto.

BEGIN;

CREATE TABLE IF NOT EXISTS presentacion (
    id_presentacion SERIAL PRIMARY KEY,
    nombre          VARCHAR(100) NOT NULL UNIQUE
);

INSERT INTO presentacion (nombre)
SELECT DISTINCT
    CASE LOWER(TRIM(presentacion))
        WHEN 'caja' THEN 'Caja'
        WHEN 'blister' THEN 'Blíster'
        WHEN 'unidad' THEN 'Unidad'
        ELSE TRIM(presentacion)
    END
FROM producto
WHERE presentacion IS NOT NULL
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO presentacion (nombre)
VALUES ('Caja'), ('Blíster'), ('Unidad')
ON CONFLICT (nombre) DO NOTHING;

ALTER TABLE producto ADD COLUMN id_presentacion INTEGER;

UPDATE producto p
SET id_presentacion = pr.id_presentacion
FROM presentacion pr
WHERE LOWER(pr.nombre) = LOWER(
    CASE LOWER(TRIM(p.presentacion))
        WHEN 'blister' THEN 'Blíster'
        ELSE TRIM(p.presentacion)
    END
);

ALTER TABLE producto
    ALTER COLUMN id_presentacion SET NOT NULL,
    ADD CONSTRAINT fk_producto_presentacion
        FOREIGN KEY (id_presentacion)
        REFERENCES presentacion(id_presentacion)
        ON DELETE RESTRICT,
    DROP CONSTRAINT chk_producto_presentacion,
    DROP COLUMN presentacion;

DROP INDEX IF EXISTS uq_producto_identidad;

CREATE UNIQUE INDEX uq_producto_identidad
    ON producto (
        LOWER(TRIM(nombre_generico)),
        LOWER(TRIM(concentracion)),
        id_casa,
        id_presentacion
    );

COMMIT;
