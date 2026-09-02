-- =========================
-- Pagos POS con Recurrente y confirmacion por webhook
-- =========================

BEGIN;

CREATE TABLE IF NOT EXISTS pago_pos (
    id_pago_pos           SERIAL PRIMARY KEY,
    external_id           VARCHAR(120) NOT NULL UNIQUE,
    id_sucursal           INTEGER NOT NULL,
    id_usuario            INTEGER NOT NULL,
    id_cliente            INTEGER,
    terminal_id           VARCHAR(120) NOT NULL,
    total                 NUMERIC(12,2) NOT NULL CHECK (total > 0),
    detalles              JSONB NOT NULL CHECK (jsonb_typeof(detalles) = 'array'),
    comando_recurrente_id VARCHAR(120),
    evento_recurrente_id  VARCHAR(120) UNIQUE,
    referencia_pago       VARCHAR(120),
    estado_pago           VARCHAR(30),
    autorizacion_pago     VARCHAR(120),
    tarjeta_ultimos4      CHAR(4),
    estado                VARCHAR(20) NOT NULL DEFAULT 'pendiente',
    id_venta              INTEGER UNIQUE,
    creado_en             TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en        TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_pago_pos_estado
        CHECK (estado IN ('pendiente', 'procesando', 'pagado', 'fallido', 'cancelado', 'rechazado')),
    CONSTRAINT fk_pago_pos_sucursal
        FOREIGN KEY (id_sucursal)
        REFERENCES sucursal(id_sucursal)
        ON DELETE RESTRICT,
    CONSTRAINT fk_pago_pos_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario)
        ON DELETE RESTRICT,
    CONSTRAINT fk_pago_pos_cliente
        FOREIGN KEY (id_cliente)
        REFERENCES cliente(id_cliente)
        ON DELETE SET NULL,
    CONSTRAINT fk_pago_pos_venta
        FOREIGN KEY (id_venta)
        REFERENCES venta(id_venta)
        ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_pago_pos_estado
    ON pago_pos (estado, creado_en DESC);

COMMIT;
