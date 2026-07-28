-- =========================
-- MIGRACIÓN: CRUD inicial de ventas en efectivo
-- =========================

BEGIN;

CREATE TABLE venta (
    id_venta          SERIAL         PRIMARY KEY,
    id_sucursal       INTEGER        NOT NULL,
    id_usuario        INTEGER        NOT NULL,
    id_cliente        INTEGER,
    metodo_pago       VARCHAR(20)    NOT NULL DEFAULT 'efectivo',
    total             NUMERIC(12,2)  NOT NULL CHECK (total > 0),
    monto_recibido    NUMERIC(12,2)  NOT NULL CHECK (monto_recibido >= total),
    cambio            NUMERIC(12,2)  NOT NULL CHECK (cambio = monto_recibido - total),
    estado            VARCHAR(20)    NOT NULL DEFAULT 'completada',
    fecha_venta       TIMESTAMPTZ    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_anulacion   TIMESTAMPTZ,
    motivo_anulacion  VARCHAR(500),

    CONSTRAINT chk_venta_metodo_pago
        CHECK (metodo_pago IN ('efectivo')),
    CONSTRAINT chk_venta_estado
        CHECK (estado IN ('completada', 'anulada')),
    CONSTRAINT chk_venta_anulacion
        CHECK (
            (estado = 'completada' AND fecha_anulacion IS NULL)
            OR
            (estado = 'anulada' AND fecha_anulacion IS NOT NULL)
        ),
    CONSTRAINT fk_venta_sucursal
        FOREIGN KEY (id_sucursal)
        REFERENCES sucursal(id_sucursal)
        ON DELETE RESTRICT,
    CONSTRAINT fk_venta_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario)
        ON DELETE RESTRICT,
    CONSTRAINT fk_venta_cliente
        FOREIGN KEY (id_cliente)
        REFERENCES cliente(id_cliente)
        ON DELETE SET NULL
);

CREATE TABLE detalle_venta (
    id_detalle_venta  SERIAL         PRIMARY KEY,
    id_venta          INTEGER        NOT NULL,
    id_lote           INTEGER        NOT NULL,
    cantidad          INTEGER        NOT NULL CHECK (cantidad > 0),
    precio_unitario   NUMERIC(12,2)  NOT NULL CHECK (precio_unitario >= 0),
    subtotal          NUMERIC(12,2)  GENERATED ALWAYS AS (cantidad * precio_unitario) STORED,

    CONSTRAINT fk_detalle_venta
        FOREIGN KEY (id_venta)
        REFERENCES venta(id_venta)
        ON DELETE RESTRICT,
    CONSTRAINT fk_detalle_venta_lote
        FOREIGN KEY (id_lote)
        REFERENCES lote(id_lote)
        ON DELETE RESTRICT,
    CONSTRAINT uq_detalle_venta_lote
        UNIQUE (id_venta, id_lote)
);

CREATE INDEX idx_venta_sucursal_fecha
    ON venta (id_sucursal, fecha_venta DESC);

CREATE INDEX idx_venta_cliente
    ON venta (id_cliente)
    WHERE id_cliente IS NOT NULL;

CREATE INDEX idx_detalle_venta_lote
    ON detalle_venta (id_lote);

COMMIT;
