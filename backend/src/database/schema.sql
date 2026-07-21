-- =========================
-- TABLA: ciudad
-- =========================
CREATE TABLE IF NOT EXISTS ciudad (
    id_ciudad SERIAL PRIMARY KEY,
    nombre_ciudad VARCHAR(100) NOT NULL UNIQUE
);

-- =========================
-- TABLA: sucursal
-- =========================
CREATE TABLE IF NOT EXISTS sucursal (
    id_sucursal SERIAL PRIMARY KEY,
    id_ciudad INTEGER NOT NULL,
    nombre_sucursal VARCHAR(100) NOT NULL UNIQUE,
    direccion TEXT NOT NULL,

    CONSTRAINT fk_sucursal_ciudad
        FOREIGN KEY (id_ciudad)
        REFERENCES ciudad(id_ciudad)
        ON DELETE RESTRICT
);

-- =========================
-- TABLA: telefono_sucursal
-- =========================
CREATE TABLE IF NOT EXISTS telefono_sucursal (
    id_telefono_sucursal SERIAL PRIMARY KEY,
    id_sucursal INTEGER NOT NULL,
    numero VARCHAR(20) NOT NULL,

    CONSTRAINT fk_telefono_sucursal
        FOREIGN KEY (id_sucursal)
        REFERENCES sucursal(id_sucursal)
        ON DELETE CASCADE
);

-- =========================
-- TABLA: correo_sucursal
-- =========================
CREATE TABLE IF NOT EXISTS correo_sucursal (
    id_correo_sucursal SERIAL PRIMARY KEY,
    id_sucursal INTEGER NOT NULL,
    correo VARCHAR(150) NOT NULL UNIQUE,

    CONSTRAINT fk_correo_sucursal
        FOREIGN KEY (id_sucursal)
        REFERENCES sucursal(id_sucursal)
        ON DELETE CASCADE
);

-- =========================
-- TABLA: usuario
-- =========================
CREATE TABLE IF NOT EXISTS usuario (
    id_usuario SERIAL PRIMARY KEY,
    id_sucursal INTEGER NOT NULL,
    nombre_usuario VARCHAR(100) NOT NULL,
    correo_usuario VARCHAR(150) NOT NULL UNIQUE,
    contrasena_hash TEXT NOT NULL,
    token_version INTEGER NOT NULL DEFAULT 0,
    rol VARCHAR(20) NOT NULL CHECK (rol IN ('dueno', 'administrador', 'dependiente')),
    estado_usuario VARCHAR(20) DEFAULT 'activo' CHECK (estado_usuario IN ('activo', 'inactivo')),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_usuario_sucursal
        FOREIGN KEY (id_sucursal)
        REFERENCES sucursal(id_sucursal)
        ON DELETE CASCADE
);

-- =========================
-- TABLA: cliente
-- =========================
CREATE TABLE IF NOT EXISTS cliente (
    id_cliente SERIAL PRIMARY KEY,
    nombre_cliente VARCHAR(150) NOT NULL,
    observaciones TEXT
);

-- =========================
-- TABLA: categoria
-- =========================
CREATE TABLE IF NOT EXISTS categoria (
    id_categoria     SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE
);

-- =========================
-- TABLA: casa_farmaceutica
-- =========================
CREATE TABLE IF NOT EXISTS casa_farmaceutica (
    id_casa  SERIAL PRIMARY KEY,
    nombre   VARCHAR(150) NOT NULL UNIQUE,
    activo   BOOLEAN      NOT NULL DEFAULT TRUE
);

-- =========================
-- TABLA: casa_telefono
-- =========================
CREATE TABLE IF NOT EXISTS casa_telefono (
    id_telefono SERIAL PRIMARY KEY,
    id_casa     INTEGER     NOT NULL,
    numero      VARCHAR(20) NOT NULL,

    CONSTRAINT fk_casa_telefono_casa
        FOREIGN KEY (id_casa)
        REFERENCES casa_farmaceutica(id_casa)
        ON DELETE CASCADE
);

-- =========================
-- TABLA: casa_email
-- =========================
CREATE TABLE IF NOT EXISTS casa_email (
    id_email SERIAL PRIMARY KEY,
    id_casa  INTEGER      NOT NULL,
    correo   VARCHAR(150) NOT NULL UNIQUE,

    CONSTRAINT fk_casa_email_casa
        FOREIGN KEY (id_casa)
        REFERENCES casa_farmaceutica(id_casa)
        ON DELETE CASCADE
);

-- =========================
-- TABLA: proveedor
-- =========================
CREATE TABLE IF NOT EXISTS proveedor (
    id_proveedor SERIAL PRIMARY KEY,
    nombre       VARCHAR(150) NOT NULL UNIQUE,
    activo       BOOLEAN      NOT NULL DEFAULT TRUE
);

-- =========================
-- TABLA: proveedor_telefono
-- =========================
CREATE TABLE IF NOT EXISTS proveedor_telefono (
    id_telefono  SERIAL PRIMARY KEY,
    id_proveedor INTEGER     NOT NULL,
    numero       VARCHAR(20) NOT NULL,

    CONSTRAINT fk_proveedor_telefono_proveedor
        FOREIGN KEY (id_proveedor)
        REFERENCES proveedor(id_proveedor)
        ON DELETE CASCADE
);

-- =========================
-- TABLA: proveedor_email
-- =========================
CREATE TABLE IF NOT EXISTS proveedor_email (
    id_email     SERIAL PRIMARY KEY,
    id_proveedor INTEGER      NOT NULL,
    correo       VARCHAR(150) NOT NULL UNIQUE,

    CONSTRAINT fk_proveedor_email_proveedor
        FOREIGN KEY (id_proveedor)
        REFERENCES proveedor(id_proveedor)
        ON DELETE CASCADE
);

-- =========================
-- TABLA: producto
-- =========================
CREATE TABLE IF NOT EXISTS producto (
    id_producto              SERIAL PRIMARY KEY,
    codigo                   VARCHAR(50)   NOT NULL UNIQUE,
    nombre_comercial         VARCHAR(150)  NOT NULL,
    nombre_generico          VARCHAR(150),
    descripcion              TEXT,
    id_categoria             INTEGER       NOT NULL,
    id_casa                  INTEGER       NOT NULL,
    id_proveedor             INTEGER,
    precio_compra            NUMERIC(10,2) NOT NULL CHECK (precio_compra >= 0),
    stock_minimo             INTEGER       NOT NULL DEFAULT 5,
    meses_alerta_vencimiento INTEGER       NOT NULL,
    aplica_mayoreo           BOOLEAN       NOT NULL DEFAULT FALSE,
    activo                   BOOLEAN       NOT NULL DEFAULT TRUE,
    fecha_creacion           TIMESTAMP     NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_producto_categoria
        FOREIGN KEY (id_categoria)
        REFERENCES categoria(id_categoria)
        ON DELETE RESTRICT,

    CONSTRAINT fk_producto_casa
        FOREIGN KEY (id_casa)
        REFERENCES casa_farmaceutica(id_casa)
        ON DELETE RESTRICT,

    CONSTRAINT fk_producto_proveedor
        FOREIGN KEY (id_proveedor)
        REFERENCES proveedor(id_proveedor)
        ON DELETE SET NULL
);

-- =========================
-- TABLA: presentacion
-- =========================
CREATE TABLE IF NOT EXISTS presentacion (
    id_presentacion   SERIAL PRIMARY KEY,
    id_producto       INTEGER      NOT NULL,
    nombre            VARCHAR(100) NOT NULL,
    factor_conversion NUMERIC(10,4) NOT NULL CHECK (factor_conversion >= 1),
    es_base           BOOLEAN      NOT NULL DEFAULT FALSE,
    activo            BOOLEAN      NOT NULL DEFAULT TRUE,

    CONSTRAINT fk_presentacion_producto
        FOREIGN KEY (id_producto)
        REFERENCES producto(id_producto)
        ON DELETE CASCADE
);

-- =========================
-- TABLA: promocion
-- =========================
CREATE TABLE IF NOT EXISTS promocion (
    id_promocion     SERIAL PRIMARY KEY,
    id_producto      INTEGER       NOT NULL,
    id_sucursal      INTEGER       NOT NULL,
    id_presentacion  INTEGER       NOT NULL,
    cantidad_minima  INTEGER       NOT NULL,
    precio_promocion NUMERIC(10,2) NOT NULL,
    fecha_inicio     DATE          NOT NULL,
    fecha_fin        DATE          NOT NULL,
    activo           BOOLEAN       NOT NULL DEFAULT TRUE,

    CONSTRAINT fk_promocion_producto
        FOREIGN KEY (id_producto)
        REFERENCES producto(id_producto)
        ON DELETE CASCADE,

    CONSTRAINT fk_promocion_sucursal
        FOREIGN KEY (id_sucursal)
        REFERENCES sucursal(id_sucursal)
        ON DELETE CASCADE,

    CONSTRAINT fk_promocion_presentacion
        FOREIGN KEY (id_presentacion)
        REFERENCES presentacion(id_presentacion)
        ON DELETE RESTRICT
);

-- =========================
-- TABLA: casa_proveedor (cruce)
-- =========================
CREATE TABLE IF NOT EXISTS casa_proveedor (
    id_casa      INTEGER NOT NULL,
    id_proveedor INTEGER NOT NULL,

    PRIMARY KEY (id_casa, id_proveedor),

    CONSTRAINT fk_casa_proveedor_casa
        FOREIGN KEY (id_casa)
        REFERENCES casa_farmaceutica(id_casa)
        ON DELETE CASCADE,

    CONSTRAINT fk_casa_proveedor_proveedor
        FOREIGN KEY (id_proveedor)
        REFERENCES proveedor(id_proveedor)
        ON DELETE CASCADE
);
 
-- =========================
-- TABLA: lote
-- =========================
CREATE TABLE IF NOT EXISTS lote (
    id_lote               SERIAL        PRIMARY KEY,
    id_producto           INTEGER       NOT NULL,
    id_proveedor          INTEGER       NOT NULL,
    id_sucursal           INTEGER       NOT NULL,
    numero_lote           VARCHAR(100)  NOT NULL,
    fecha_vencimiento     DATE          NOT NULL,
    cantidad_ingresada    NUMERIC(10,4) NOT NULL CHECK (cantidad_ingresada > 0),
    presentacion_ingreso  INTEGER       NOT NULL,
    stock_inicial         NUMERIC(10,4) NOT NULL CHECK (stock_inicial >= 0),
    stock_actual          NUMERIC(10,4) NOT NULL CHECK (stock_actual >= 0),
    fecha_ingreso         TIMESTAMP     NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_lote_producto
        FOREIGN KEY (id_producto)
        REFERENCES producto(id_producto)
        ON DELETE RESTRICT,

    CONSTRAINT fk_lote_proveedor
        FOREIGN KEY (id_proveedor)
        REFERENCES proveedor(id_proveedor)
        ON DELETE RESTRICT,

    CONSTRAINT fk_lote_sucursal
        FOREIGN KEY (id_sucursal)
        REFERENCES sucursal(id_sucursal)
        ON DELETE RESTRICT,

    CONSTRAINT fk_lote_presentacion_ingreso
        FOREIGN KEY (presentacion_ingreso)
        REFERENCES presentacion(id_presentacion)
        ON DELETE RESTRICT,

    -- Un número de lote debe ser único por producto y sucursal
    CONSTRAINT uq_lote_numero_producto_sucursal
        UNIQUE (numero_lote, id_producto, id_sucursal)
);

-- =========================
-- VISTA: v_lote_estado
-- Implementa las columnas generadas que requieren JOIN a Producto.
-- Usar esta vista en lugar de la tabla directa cuando se necesiten
-- estado_vencimiento y estado_stock.
-- =========================
CREATE OR REPLACE VIEW v_lote_estado AS
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


-- =========================
-- TABLA: lote_presentacion
-- Precios de venta por lote y presentación.
-- =========================
CREATE TABLE IF NOT EXISTS lote_presentacion (
    id_lote          INTEGER       NOT NULL,
    id_presentacion  INTEGER       NOT NULL,
    precio_venta     NUMERIC(10,2) NOT NULL CHECK (precio_venta >= 0),
    margen_ganancia  NUMERIC(8,4)  NOT NULL CHECK (margen_ganancia >= 0),
    precio_mayoreo   NUMERIC(10,2)             CHECK (precio_mayoreo >= 0),
    cantidad_mayoreo INTEGER                   CHECK (cantidad_mayoreo > 0),

    PRIMARY KEY (id_lote, id_presentacion),

    CONSTRAINT fk_lote_pres_lote
        FOREIGN KEY (id_lote)
        REFERENCES lote(id_lote)
        ON DELETE CASCADE,

    CONSTRAINT fk_lote_pres_presentacion
        FOREIGN KEY (id_presentacion)
        REFERENCES presentacion(id_presentacion)
        ON DELETE RESTRICT,

    -- precio_mayoreo y cantidad_mayoreo deben definirse juntos o ninguno
    CONSTRAINT chk_mayoreo_completo
        CHECK (
            (precio_mayoreo IS NULL AND cantidad_mayoreo IS NULL)
            OR
            (precio_mayoreo IS NOT NULL AND cantidad_mayoreo IS NOT NULL)
        )
);

-- =========================
-- EXTENSIONES
-- =========================
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =========================
-- DATOS SEMILLA DESARROLLO
-- =========================
INSERT INTO ciudad (nombre_ciudad)
VALUES ('Guatemala')
ON CONFLICT (nombre_ciudad) DO NOTHING;

INSERT INTO sucursal (id_ciudad, nombre_sucursal, direccion)
SELECT id_ciudad, 'Sucursal Central', 'Zona 1, Ciudad de Guatemala'
FROM ciudad
WHERE nombre_ciudad = 'Guatemala'
ON CONFLICT (nombre_sucursal) DO NOTHING;

INSERT INTO telefono_sucursal (id_sucursal, numero)
SELECT s.id_sucursal, '2222-3333'
FROM sucursal s
WHERE s.nombre_sucursal = 'Sucursal Central'
  AND NOT EXISTS (
      SELECT 1 FROM telefono_sucursal t
      WHERE t.id_sucursal = s.id_sucursal AND t.numero = '2222-3333'
  );

INSERT INTO correo_sucursal (id_sucursal, correo)
SELECT s.id_sucursal, 'central@farma.com'
FROM sucursal s
WHERE s.nombre_sucursal = 'Sucursal Central'
  AND NOT EXISTS (
      SELECT 1 FROM correo_sucursal c
      WHERE c.correo = 'central@farma.com'
  );

INSERT INTO usuario (id_sucursal, nombre_usuario, correo_usuario, contrasena_hash, rol)
SELECT
    s.id_sucursal,
    'Dueno General',
    'dueno@farma.com',
    crypt('123456', gen_salt('bf')),
    'dueno'
FROM sucursal s
WHERE s.nombre_sucursal = 'Sucursal Central'
  AND NOT EXISTS (
      SELECT 1
      FROM usuario u
      WHERE u.correo_usuario = 'dueno@farma.com'
  );

INSERT INTO categoria (nombre)
VALUES
  ('Analgésico'),
  ('Antibiótico'),
  ('Antiinflamatorio'),
  ('Antihistamínico'),
  ('Gastroenterológico'),
  ('Vitaminas')
ON CONFLICT (nombre) DO NOTHING;
 
INSERT INTO casa_farmaceutica (nombre)
VALUES
  ('Farmacéutica ABC'),
  ('Laboratorios XYZ'),
  ('Medicamentos Globales')
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO proveedor (nombre)
VALUES
  ('Proveedor Uno'),
  ('Proveedor Dos'),
  ('Proveedor Tres')
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO casa_proveedor (id_casa, id_proveedor)
SELECT c.id_casa, p.id_proveedor
FROM casa_farmaceutica c
JOIN proveedor p ON p.nombre IN ('Proveedor Uno', 'Proveedor Dos')
WHERE c.nombre = 'Farmacéutica ABC'
  AND NOT EXISTS (
      SELECT 1
      FROM casa_proveedor cp
      WHERE cp.id_casa = c.id_casa AND cp.id_proveedor = p.id_proveedor
  );

INSERT INTO casa_proveedor (id_casa, id_proveedor)
SELECT c.id_casa, p.id_proveedor
FROM casa_farmaceutica c
JOIN proveedor p ON p.nombre IN ('Proveedor Dos', 'Proveedor Tres')
WHERE c.nombre = 'Laboratorios XYZ'
  AND NOT EXISTS (
      SELECT 1
      FROM casa_proveedor cp
      WHERE cp.id_casa = c.id_casa AND cp.id_proveedor = p.id_proveedor
  );

INSERT INTO casa_proveedor (id_casa, id_proveedor)
SELECT c.id_casa, p.id_proveedor
FROM casa_farmaceutica c
JOIN proveedor p ON p.nombre IN ('Proveedor Uno', 'Proveedor Tres')
WHERE c.nombre = 'Medicamentos Globales'
  AND NOT EXISTS (
      SELECT 1
      FROM casa_proveedor cp
      WHERE cp.id_casa = c.id_casa AND cp.id_proveedor = p.id_proveedor
  );

INSERT INTO producto (codigo, nombre_comercial, nombre_generico, descripcion, id_categoria, id_casa, id_proveedor, precio_compra, stock_minimo, meses_alerta_vencimiento, aplica_mayoreo)
SELECT
    'MED001',
    'Tylenol',
    'Paracetamol',
    'Analgésico y antipirético para aliviar el dolor y reducir la fiebre.',
    (SELECT id_categoria FROM categoria WHERE nombre = 'Analgésico'),
    (SELECT id_casa FROM casa_farmaceutica WHERE nombre = 'Farmacéutica ABC'),
    (SELECT id_proveedor FROM proveedor WHERE nombre = 'Proveedor Uno'),
    0.50,
    10,
    6,
    TRUE
WHERE NOT EXISTS (
    SELECT 1 FROM producto WHERE codigo = 'MED001'
);

INSERT INTO presentacion (id_producto, nombre, factor_conversion, es_base, activo)
SELECT
    p.id_producto,
    'Tableta',
    1,
    TRUE,
    TRUE
FROM producto p
WHERE p.codigo = 'MED001'
  AND NOT EXISTS (
      SELECT 1
      FROM presentacion pres
      WHERE pres.id_producto = p.id_producto
        AND pres.nombre = 'Tableta'
  );

INSERT INTO lote (
    id_producto,
    id_proveedor,
    id_sucursal,
    numero_lote,
    fecha_vencimiento,
    cantidad_ingresada,
    presentacion_ingreso,
    stock_inicial,
    stock_actual
)
SELECT
    p.id_producto,
    pr.id_proveedor,
    s.id_sucursal,
    'LOTE-MED001-001',
    CURRENT_DATE + INTERVAL '12 months',
    30,
    pres.id_presentacion,
    30,
    30
FROM producto p
JOIN proveedor pr
  ON pr.nombre = 'Proveedor Uno'
JOIN sucursal s
  ON s.nombre_sucursal = 'Sucursal Central'
JOIN presentacion pres
  ON pres.id_producto = p.id_producto
 AND pres.nombre = 'Tableta'
WHERE p.codigo = 'MED001'
  AND NOT EXISTS (
      SELECT 1
      FROM lote l
      WHERE l.numero_lote = 'LOTE-MED001-001'
        AND l.id_producto = p.id_producto
        AND l.id_sucursal = s.id_sucursal
  );

INSERT INTO lote_presentacion (
    id_lote,
    id_presentacion,
    precio_venta,
    margen_ganancia,
    precio_mayoreo,
    cantidad_mayoreo
)
SELECT
    l.id_lote,
    pres.id_presentacion,
    1.00,
    0.30,
    NULL,
    NULL
FROM lote l
JOIN producto p
  ON p.id_producto = l.id_producto
JOIN presentacion pres
  ON pres.id_producto = p.id_producto
 AND pres.nombre = 'Tableta'
WHERE l.numero_lote = 'LOTE-MED001-001'
  AND p.codigo = 'MED001'
  AND NOT EXISTS (
      SELECT 1
      FROM lote_presentacion lp
      WHERE lp.id_lote = l.id_lote
        AND lp.id_presentacion = pres.id_presentacion
  );

-- Lotes de demostración para probar filtros:
-- 1) Un producto con lote en buen estado.
-- 2) Un producto con lote vencido.
-- 3) Un producto con lote próximo a vencer.

INSERT INTO producto (codigo, nombre_comercial, nombre_generico, descripcion, id_categoria, id_casa, id_proveedor, precio_compra, stock_minimo, meses_alerta_vencimiento, aplica_mayoreo)
SELECT
    'MED002',
    'Amoxicilina 500 mg',
    'Amoxicilina',
    'Antibiótico de demostración para probar lotes vencidos.',
    (SELECT id_categoria FROM categoria WHERE nombre = 'Antibiótico'),
    (SELECT id_casa FROM casa_farmaceutica WHERE nombre = 'Laboratorios XYZ'),
    (SELECT id_proveedor FROM proveedor WHERE nombre = 'Proveedor Dos'),
    1.20,
    10,
    6,
    TRUE
WHERE NOT EXISTS (
    SELECT 1 FROM producto WHERE codigo = 'MED002'
);

INSERT INTO presentacion (id_producto, nombre, factor_conversion, es_base, activo)
SELECT
    p.id_producto,
    'Cápsula',
    1,
    TRUE,
    TRUE
FROM producto p
WHERE p.codigo = 'MED002'
  AND NOT EXISTS (
      SELECT 1
      FROM presentacion pres
      WHERE pres.id_producto = p.id_producto
        AND pres.nombre = 'Cápsula'
  );

INSERT INTO producto (codigo, nombre_comercial, nombre_generico, descripcion, id_categoria, id_casa, id_proveedor, precio_compra, stock_minimo, meses_alerta_vencimiento, aplica_mayoreo)
SELECT
    'MED003',
    'Ibuprofeno 400 mg',
    'Ibuprofeno',
    'Antiinflamatorio de demostración para probar lotes próximos a vencer.',
    (SELECT id_categoria FROM categoria WHERE nombre = 'Antiinflamatorio'),
    (SELECT id_casa FROM casa_farmaceutica WHERE nombre = 'Medicamentos Globales'),
    (SELECT id_proveedor FROM proveedor WHERE nombre = 'Proveedor Tres'),
    0.80,
    5,
    6,
    TRUE
WHERE NOT EXISTS (
    SELECT 1 FROM producto WHERE codigo = 'MED003'
);

INSERT INTO presentacion (id_producto, nombre, factor_conversion, es_base, activo)
SELECT
    p.id_producto,
    'Tableta',
    1,
    TRUE,
    TRUE
FROM producto p
WHERE p.codigo = 'MED003'
  AND NOT EXISTS (
      SELECT 1
      FROM presentacion pres
      WHERE pres.id_producto = p.id_producto
        AND pres.nombre = 'Tableta'
  );

INSERT INTO lote (
    id_producto,
    id_proveedor,
    id_sucursal,
    numero_lote,
    fecha_vencimiento,
    cantidad_ingresada,
    presentacion_ingreso,
    stock_inicial,
    stock_actual
)
SELECT
    p.id_producto,
    pr.id_proveedor,
    s.id_sucursal,
    'LOTE-MED001-BUENO',
    CURRENT_DATE + INTERVAL '12 months',
    30,
    pres.id_presentacion,
    30,
    30
FROM producto p
JOIN proveedor pr
  ON pr.nombre = 'Proveedor Uno'
JOIN sucursal s
  ON s.nombre_sucursal = 'Sucursal Central'
JOIN presentacion pres
  ON pres.id_producto = p.id_producto
 AND pres.nombre = 'Tableta'
WHERE p.codigo = 'MED001'
  AND NOT EXISTS (
      SELECT 1
      FROM lote l
      WHERE l.numero_lote = 'LOTE-MED001-BUENO'
        AND l.id_producto = p.id_producto
        AND l.id_sucursal = s.id_sucursal
  );

INSERT INTO lote_presentacion (
    id_lote,
    id_presentacion,
    precio_venta,
    margen_ganancia,
    precio_mayoreo,
    cantidad_mayoreo
)
SELECT
    l.id_lote,
    pres.id_presentacion,
    1.00,
    0.30,
    NULL,
    NULL
FROM lote l
JOIN producto p
  ON p.id_producto = l.id_producto
JOIN presentacion pres
  ON pres.id_producto = p.id_producto
 AND pres.nombre = 'Tableta'
WHERE l.numero_lote = 'LOTE-MED001-BUENO'
  AND p.codigo = 'MED001'
  AND NOT EXISTS (
      SELECT 1
      FROM lote_presentacion lp
      WHERE lp.id_lote = l.id_lote
        AND lp.id_presentacion = pres.id_presentacion
  );

INSERT INTO lote (
    id_producto,
    id_proveedor,
    id_sucursal,
    numero_lote,
    fecha_vencimiento,
    cantidad_ingresada,
    presentacion_ingreso,
    stock_inicial,
    stock_actual
)
SELECT
    p.id_producto,
    pr.id_proveedor,
    s.id_sucursal,
    'LOTE-MED002-VENCIDO',
    CURRENT_DATE - 1,
    12,
    pres.id_presentacion,
    12,
    12
FROM producto p
JOIN proveedor pr
  ON pr.nombre = 'Proveedor Dos'
JOIN sucursal s
  ON s.nombre_sucursal = 'Sucursal Central'
JOIN presentacion pres
  ON pres.id_producto = p.id_producto
 AND pres.nombre = 'Cápsula'
WHERE p.codigo = 'MED002'
  AND NOT EXISTS (
      SELECT 1
      FROM lote l
      WHERE l.numero_lote = 'LOTE-MED002-VENCIDO'
        AND l.id_producto = p.id_producto
        AND l.id_sucursal = s.id_sucursal
  );

INSERT INTO lote_presentacion (
    id_lote,
    id_presentacion,
    precio_venta,
    margen_ganancia,
    precio_mayoreo,
    cantidad_mayoreo
)
SELECT
    l.id_lote,
    pres.id_presentacion,
    1.35,
    0.25,
    NULL,
    NULL
FROM lote l
JOIN producto p
  ON p.id_producto = l.id_producto
JOIN presentacion pres
  ON pres.id_producto = p.id_producto
 AND pres.nombre = 'Cápsula'
WHERE l.numero_lote = 'LOTE-MED002-VENCIDO'
  AND p.codigo = 'MED002'
  AND NOT EXISTS (
      SELECT 1
      FROM lote_presentacion lp
      WHERE lp.id_lote = l.id_lote
        AND lp.id_presentacion = pres.id_presentacion
  );

INSERT INTO lote (
    id_producto,
    id_proveedor,
    id_sucursal,
    numero_lote,
    fecha_vencimiento,
    cantidad_ingresada,
    presentacion_ingreso,
    stock_inicial,
    stock_actual
)
SELECT
    p.id_producto,
    pr.id_proveedor,
    s.id_sucursal,
    'LOTE-MED003-PROXIMO',
    CURRENT_DATE + INTERVAL '2 months',
    18,
    pres.id_presentacion,
    18,
    18
FROM producto p
JOIN proveedor pr
  ON pr.nombre = 'Proveedor Tres'
JOIN sucursal s
  ON s.nombre_sucursal = 'Sucursal Central'
JOIN presentacion pres
  ON pres.id_producto = p.id_producto
 AND pres.nombre = 'Tableta'
WHERE p.codigo = 'MED003'
  AND NOT EXISTS (
      SELECT 1
      FROM lote l
      WHERE l.numero_lote = 'LOTE-MED003-PROXIMO'
        AND l.id_producto = p.id_producto
        AND l.id_sucursal = s.id_sucursal
  );

INSERT INTO lote_presentacion (
    id_lote,
    id_presentacion,
    precio_venta,
    margen_ganancia,
    precio_mayoreo,
    cantidad_mayoreo
)
SELECT
    l.id_lote,
    pres.id_presentacion,
    1.05,
    0.28,
    NULL,
    NULL
FROM lote l
JOIN producto p
  ON p.id_producto = l.id_producto
JOIN presentacion pres
  ON pres.id_producto = p.id_producto
 AND pres.nombre = 'Tableta'
WHERE l.numero_lote = 'LOTE-MED003-PROXIMO'
  AND p.codigo = 'MED003'
  AND NOT EXISTS (
      SELECT 1
      FROM lote_presentacion lp
      WHERE lp.id_lote = l.id_lote
        AND lp.id_presentacion = pres.id_presentacion
  );
