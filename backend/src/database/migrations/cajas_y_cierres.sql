-- =========================
-- Cajas físicas y cierre por sesión/turno
-- =========================

BEGIN;

CREATE TABLE caja (
    id_caja        SERIAL        PRIMARY KEY,
    id_sucursal    INTEGER       NOT NULL,
    nombre         VARCHAR(100)  NOT NULL,
    activa         BOOLEAN       NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMPTZ   NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_caja_sucursal
        FOREIGN KEY (id_sucursal)
        REFERENCES sucursal(id_sucursal)
        ON DELETE RESTRICT
);

CREATE UNIQUE INDEX uq_caja_sucursal_nombre
    ON caja (id_sucursal, LOWER(nombre));

CREATE TABLE sesion_caja (
    id_sesion_caja          SERIAL         PRIMARY KEY,
    id_caja                 INTEGER        NOT NULL,
    id_usuario_apertura     INTEGER        NOT NULL,
    id_usuario_cierre       INTEGER,
    fecha_operacion         DATE           NOT NULL
        DEFAULT ((CURRENT_TIMESTAMP AT TIME ZONE 'America/Guatemala')::DATE),
    turno                   VARCHAR(20)    NOT NULL,
    fecha_hora_apertura     TIMESTAMPTZ    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_hora_cierre       TIMESTAMPTZ,
    fondo_inicial           NUMERIC(14,2)  NOT NULL CHECK (fondo_inicial >= 0),
    total_ventas_efectivo   NUMERIC(14,2)  CHECK (total_ventas_efectivo >= 0),
    total_ventas_tarjeta    NUMERIC(14,2)  CHECK (total_ventas_tarjeta >= 0),
    total_entradas          NUMERIC(14,2)  CHECK (total_entradas >= 0),
    total_salidas           NUMERIC(14,2)  CHECK (total_salidas >= 0),
    efectivo_esperado       NUMERIC(14,2)  CHECK (efectivo_esperado >= 0),
    efectivo_contado        NUMERIC(14,2)  CHECK (efectivo_contado >= 0),
    diferencia_efectivo     NUMERIC(14,2),
    cantidad_ventas         INTEGER        CHECK (cantidad_ventas >= 0),
    cantidad_anulaciones    INTEGER        CHECK (cantidad_anulaciones >= 0),
    estado                  VARCHAR(20)    NOT NULL DEFAULT 'abierta',
    observaciones           VARCHAR(500),

    CONSTRAINT chk_sesion_caja_turno
        CHECK (turno IN ('mañana', 'tarde', 'noche')),
    CONSTRAINT chk_sesion_caja_estado
        CHECK (estado IN ('abierta', 'cerrada')),
    CONSTRAINT chk_sesion_caja_fechas
        CHECK (
            fecha_hora_cierre IS NULL
            OR fecha_hora_cierre > fecha_hora_apertura
        ),
    CONSTRAINT chk_sesion_caja_cierre
        CHECK (
            (
                estado = 'abierta'
                AND id_usuario_cierre IS NULL
                AND fecha_hora_cierre IS NULL
                AND total_ventas_efectivo IS NULL
                AND total_ventas_tarjeta IS NULL
                AND total_entradas IS NULL
                AND total_salidas IS NULL
                AND efectivo_esperado IS NULL
                AND efectivo_contado IS NULL
                AND diferencia_efectivo IS NULL
                AND cantidad_ventas IS NULL
                AND cantidad_anulaciones IS NULL
            )
            OR
            (
                estado = 'cerrada'
                AND id_usuario_cierre IS NOT NULL
                AND fecha_hora_cierre IS NOT NULL
                AND total_ventas_efectivo IS NOT NULL
                AND total_ventas_tarjeta IS NOT NULL
                AND total_entradas IS NOT NULL
                AND total_salidas IS NOT NULL
                AND efectivo_esperado IS NOT NULL
                AND efectivo_contado IS NOT NULL
                AND diferencia_efectivo IS NOT NULL
                AND cantidad_ventas IS NOT NULL
                AND cantidad_anulaciones IS NOT NULL
            )
        ),
    CONSTRAINT fk_sesion_caja_caja
        FOREIGN KEY (id_caja)
        REFERENCES caja(id_caja)
        ON DELETE RESTRICT,
    CONSTRAINT fk_sesion_caja_usuario_apertura
        FOREIGN KEY (id_usuario_apertura)
        REFERENCES usuario(id_usuario)
        ON DELETE RESTRICT,
    CONSTRAINT fk_sesion_caja_usuario_cierre
        FOREIGN KEY (id_usuario_cierre)
        REFERENCES usuario(id_usuario)
        ON DELETE RESTRICT
);

CREATE UNIQUE INDEX uq_sesion_caja_abierta
    ON sesion_caja (id_caja)
    WHERE estado = 'abierta';

CREATE INDEX idx_sesion_caja_fecha_operacion
    ON sesion_caja (fecha_operacion DESC, id_caja);

CREATE TABLE movimiento_caja (
    id_movimiento_caja  SERIAL         PRIMARY KEY,
    id_sesion_caja      INTEGER        NOT NULL,
    id_usuario          INTEGER        NOT NULL,
    tipo                VARCHAR(20)    NOT NULL,
    monto               NUMERIC(14,2)  NOT NULL CHECK (monto > 0),
    motivo              VARCHAR(500)   NOT NULL,
    fecha_hora           TIMESTAMPTZ    NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_movimiento_caja_tipo
        CHECK (tipo IN ('entrada', 'salida')),
    CONSTRAINT fk_movimiento_caja_sesion
        FOREIGN KEY (id_sesion_caja)
        REFERENCES sesion_caja(id_sesion_caja)
        ON DELETE RESTRICT,
    CONSTRAINT fk_movimiento_caja_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario)
        ON DELETE RESTRICT
);

CREATE INDEX idx_movimiento_caja_sesion_fecha
    ON movimiento_caja (id_sesion_caja, fecha_hora);

ALTER TABLE venta
    ADD COLUMN id_sesion_caja INTEGER;

ALTER TABLE venta
    ADD CONSTRAINT fk_venta_sesion_caja
        FOREIGN KEY (id_sesion_caja)
        REFERENCES sesion_caja(id_sesion_caja)
        ON DELETE RESTRICT;

CREATE INDEX idx_venta_sesion_caja
    ON venta (id_sesion_caja, estado, metodo_pago);

INSERT INTO caja (id_sucursal, nombre)
SELECT s.id_sucursal, 'Caja principal'
FROM sucursal s;

COMMIT;
