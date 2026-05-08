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
-- TABLA: categoria
-- =========================
CREATE TABLE IF NOT EXISTS categoria (
    id_categoria     SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE
);
 
-- =========================
-- TABLA: inventario_sucursal
-- =========================
CREATE TABLE IF NOT EXISTS inventario_sucursal (
    id_inventario SERIAL PRIMARY KEY,
    id_sucursal INTEGER NOT NULL,
    id_producto INTEGER NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    stock_minimo INTEGER NOT NULL DEFAULT 5,

    CONSTRAINT fk_inv_sucursal
        FOREIGN KEY (id_sucursal) REFERENCES sucursal(id_sucursal) ON DELETE CASCADE,
    CONSTRAINT fk_inv_producto
        FOREIGN KEY (id_producto) REFERENCES producto(id_producto) ON DELETE CASCADE,
    CONSTRAINT uq_inv_sucursal_producto UNIQUE (id_sucursal, id_producto)
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
 