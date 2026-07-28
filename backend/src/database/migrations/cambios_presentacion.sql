-- =========================
-- MIGRACIÓN: la presentación pasa a ser atributo del producto
-- Rama: feature/cambios-presentacion
-- =========================

BEGIN;

-- La vista depende de lote.*, así que hay que eliminarla antes de alterar
-- las columnas y volverla a crear al final.
DROP VIEW IF EXISTS v_lote_estado;

-- 1. Producto: concentración y presentación
ALTER TABLE producto
    ADD COLUMN concentracion VARCHAR(50),
    ADD COLUMN presentacion  VARCHAR(20);

UPDATE producto SET concentracion   = 'N/D'    WHERE concentracion IS NULL;
UPDATE producto SET presentacion    = 'unidad' WHERE presentacion IS NULL;
UPDATE producto SET nombre_generico = nombre_comercial WHERE nombre_generico IS NULL;

ALTER TABLE producto
    ALTER COLUMN concentracion   SET NOT NULL,
    ALTER COLUMN presentacion    SET NOT NULL,
    ALTER COLUMN nombre_generico SET NOT NULL,
    ADD CONSTRAINT chk_producto_presentacion
        CHECK (presentacion IN ('caja', 'blister', 'unidad'));

CREATE UNIQUE INDEX uq_producto_identidad
    ON producto (
        LOWER(TRIM(nombre_generico)),
        LOWER(TRIM(concentracion)),
        id_casa,
        presentacion
    );

CREATE INDEX idx_producto_familia
    ON producto (
        LOWER(TRIM(nombre_generico)),
        LOWER(TRIM(concentracion)),
        id_casa
    );

-- 2. Lote: los precios se mudan desde lote_presentacion
ALTER TABLE lote
    ADD COLUMN precio_venta     NUMERIC(10,2),
    ADD COLUMN margen_ganancia  NUMERIC(8,4),
    ADD COLUMN precio_mayoreo   NUMERIC(10,2),
    ADD COLUMN cantidad_mayoreo INTEGER;

UPDATE lote l
SET precio_venta     = lp.precio_venta,
    margen_ganancia  = lp.margen_ganancia,
    precio_mayoreo   = lp.precio_mayoreo,
    cantidad_mayoreo = lp.cantidad_mayoreo
FROM lote_presentacion lp
WHERE lp.id_lote = l.id_lote
  AND lp.id_presentacion = l.presentacion_ingreso;

UPDATE lote
SET precio_venta    = 0,
    margen_ganancia = 0
WHERE precio_venta IS NULL;

ALTER TABLE lote
    ALTER COLUMN precio_venta       SET NOT NULL,
    ALTER COLUMN margen_ganancia    SET NOT NULL,
    ALTER COLUMN cantidad_ingresada TYPE INTEGER USING ROUND(cantidad_ingresada),
    ALTER COLUMN stock_actual       TYPE INTEGER USING ROUND(stock_actual),
    DROP CONSTRAINT fk_lote_presentacion_ingreso,
    DROP COLUMN presentacion_ingreso,
    DROP COLUMN stock_inicial,
    ADD CONSTRAINT chk_lote_mayoreo_completo
        CHECK (
            (precio_mayoreo IS NULL AND cantidad_mayoreo IS NULL)
            OR
            (precio_mayoreo IS NOT NULL AND cantidad_mayoreo IS NOT NULL)
        );

-- 3. Promoción
ALTER TABLE promocion
    DROP CONSTRAINT fk_promocion_presentacion,
    DROP COLUMN id_presentacion;

-- 4. Tablas que dejan de existir
DROP TABLE IF EXISTS lote_presentacion;
DROP TABLE IF EXISTS presentacion;

-- 5. Vista recreada con la estructura nueva de lote
CREATE VIEW v_lote_estado AS
SELECT
    l.*,
    CASE
        WHEN l.fecha_vencimiento < CURRENT_DATE
            THEN 'vencido'
        WHEN l.fecha_vencimiento <= (CURRENT_DATE + (p.meses_alerta_vencimiento || ' months')::INTERVAL)
            THEN 'proximo_a_vencer'
        ELSE 'normal'
    END AS estado_vencimiento,
    CASE
        WHEN l.stock_actual = 0
            THEN 'agotado'
        WHEN l.stock_actual <= p.stock_minimo
            THEN 'poco_stock'
        ELSE 'normal'
    END AS estado_stock
FROM lote l
JOIN producto p ON p.id_producto = l.id_producto;

COMMIT;