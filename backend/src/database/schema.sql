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