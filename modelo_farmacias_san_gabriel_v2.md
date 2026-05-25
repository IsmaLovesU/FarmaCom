# Modelo Relacional — Sistema Farmacias San Gabriel

## Resumen
- **17 tablas** en total
- **3 columnas generadas** (calculadas por la BD)
- **4 grupos** de entidades: Sucursal, Catálogo, Producto, Lote

---

## GRUPO 1 — Sucursal

### Ciudad
| Atributo | Restricción | Nota |
|---|---|---|
| id_ciudad | PK, NOT NULL | |
| nombre_ciudad | NOT NULL, UNIQUE | |

### Sucursal
| Atributo | Restricción | Nota |
|---|---|---|
| id_sucursal | PK, NOT NULL | |
| id_ciudad | FK → Ciudad, NOT NULL | |
| nombre_sucursal | NOT NULL, UNIQUE | |
| direccion | NOT NULL | |

### TelefonoSucursal
| Atributo | Restricción | Nota |
|---|---|---|
| id_telefono_sucursal | PK, NOT NULL | |
| id_sucursal | FK → Sucursal, NOT NULL | |
| numero | NOT NULL | |

### CorreoSucursal
| Atributo | Restricción | Nota |
|---|---|---|
| id_correo_sucursal | PK, NOT NULL | |
| id_sucursal | FK → Sucursal, NOT NULL | |
| correo | NOT NULL | |

---

## GRUPO 2 — Catálogo

### Categoria
| Atributo | Restricción | Nota |
|---|---|---|
| id_categoria | PK, NOT NULL | |
| nombre | NOT NULL | |

### CasaFarmaceutica
| Atributo | Restricción | Nota |
|---|---|---|
| id_casa | PK, NOT NULL | |
| nombre | NOT NULL | |

### Casa_Telefono
| Atributo | Restricción | Nota |
|---|---|---|
| id_telefono | PK, NOT NULL | |
| id_casa | FK → CasaFarmaceutica, NOT NULL | |
| numero | NOT NULL | |

### Casa_Email
| Atributo | Restricción | Nota |
|---|---|---|
| id_email | PK, NOT NULL | |
| id_casa | FK → CasaFarmaceutica, NOT NULL | |
| correo | NOT NULL | |

### Proveedor
| Atributo | Restricción | Nota |
|---|---|---|
| id_proveedor | PK, NOT NULL | |
| nombre | NOT NULL | |

### Proveedor_Telefono
| Atributo | Restricción | Nota |
|---|---|---|
| id_telefono | PK, NOT NULL | |
| id_proveedor | FK → Proveedor, NOT NULL | |
| numero | NOT NULL | |

### Proveedor_Email
| Atributo | Restricción | Nota |
|---|---|---|
| id_email | PK, NOT NULL | |
| id_proveedor | FK → Proveedor, NOT NULL | |
| correo | NOT NULL | |

### Casa_Proveedor *(tabla de cruce)*
| Atributo | Restricción | Nota |
|---|---|---|
| id_casa | FK → CasaFarmaceutica, NOT NULL | PK compuesta |
| id_proveedor | FK → Proveedor, NOT NULL | PK compuesta |

---

## GRUPO 3 — Producto

### Producto
| Atributo | Restricción | Nota |
|---|---|---|
| id_producto | PK, NOT NULL | |
| codigo | NOT NULL, UNIQUE | Escáner o manual |
| nombre_comercial | NOT NULL | Búsqueda principal |
| nombre_generico | NULLABLE | Nombre médico |
| descripcion | NULLABLE | Notas adicionales |
| id_categoria | FK → Categoria, NOT NULL | |
| id_casa | FK → CasaFarmaceutica, NOT NULL | Laboratorio fabricante |
| id_proveedor | FK → Proveedor, NULLABLE | Distribuidor directo (opcional) |
| precio_compra | NOT NULL, ≥ 0 | Costo base |
| stock_minimo | NOT NULL, DEFAULT 5 | Umbral de alerta global |
| meses_alerta_vencimiento | NOT NULL | Meses antes de vencer para alertar |
| aplica_mayoreo | NOT NULL, DEFAULT false | Interruptor para mostrar precio mayoreo en POS |
| activo | NOT NULL, DEFAULT true | Baja lógica |
| fecha_creacion | NOT NULL, DEFAULT NOW() | Auditoría |

### Presentacion
| Atributo | Restricción | Nota |
|---|---|---|
| id_presentacion | PK, NOT NULL | |
| id_producto | FK → Producto, NOT NULL | |
| nombre | NOT NULL | Ej. "Blister", "Caja", "Unidad" |
| factor_conversion | NOT NULL, ≥ 1 | Cuántas unidades atómicas equivale esta presentación |
| es_base | NOT NULL, DEFAULT false | Solo 1 presentación puede ser base por producto |
| activo | NOT NULL, DEFAULT true | |

> **Nota sobre factor_conversion:** El stock siempre se guarda internamente en la unidad base (es_base = true, factor = 1). Al ingresar un lote de 5 cajas donde 1 caja = 20 pastillas, el sistema guarda 100 unidades atómicas. Vender 1 blister de 10 pastillas resta 10 unidades atómicas.

### Promocion
| Atributo | Restricción | Nota |
|---|---|---|
| id_promocion | PK, NOT NULL | |
| id_producto | FK → Producto, NOT NULL | |
| id_sucursal | FK → Sucursal, NOT NULL | Cada sucursal define sus propias promociones |
| id_presentacion | FK → Presentacion, NOT NULL | Aplica a una presentación específica |
| cantidad_minima | NOT NULL | Cantidad mínima para activar el precio promocional |
| precio_promocion | NOT NULL | Precio fijo independiente al llegar a cantidad_minima |
| fecha_inicio | NOT NULL | |
| fecha_fin | NOT NULL | |
| activo | NOT NULL, DEFAULT true | Cancelación manual antes de fecha_fin |

> **Regla de negocio — activación automática:** Al momento de una venta, el sistema verifica si existe una `Promocion` activa para ese `id_producto` + `id_sucursal` + `id_presentacion` donde HOY esté entre `fecha_inicio` y `fecha_fin`, y la cantidad en el carrito sea ≥ `cantidad_minima`. Si se cumple, reemplaza `precio_venta` con `precio_promocion` automáticamente.
>
> **Restricción:** Un producto solo puede tener una promoción activa a la vez por sucursal y presentación. Debe validarse en la capa de negocio al crear una nueva promoción.

---

## GRUPO 4 — Lote

### Lote
| Atributo | Restricción | Nota |
|---|---|---|
| id_lote | PK, NOT NULL | |
| id_producto | FK → Producto, NOT NULL | |
| id_proveedor | FK → Proveedor, NOT NULL | Proveedor que suministró este lote |
| id_sucursal | FK → Sucursal, NOT NULL | Sucursal donde existe este lote |
| numero_lote | NOT NULL | |
| fecha_vencimiento | NOT NULL | |
| cantidad_ingresada | NOT NULL | Lo que el usuario ve (ej. 5 cajas) |
| presentacion_ingreso | FK → Presentacion, NOT NULL | En qué presentación se ingresó el lote |
| stock_inicial | **GENERADO** | cantidad_ingresada × factor_conversion |
| stock_actual | NOT NULL | Siempre en unidades atómicas |
| fecha_ingreso | NOT NULL, DEFAULT NOW() | |
| estado_vencimiento | **GENERADO** | "normal" / "proximo_a_vencer" / "vencido" |
| estado_stock | **GENERADO** | "normal" / "poco_stock" / "agotado" |

### Lógica de columnas generadas en Lote

**estado_vencimiento** (requiere JOIN a Producto para obtener meses_alerta_vencimiento):
- `vencido` → si `fecha_vencimiento < HOY`
- `proximo_a_vencer` → si `fecha_vencimiento <= HOY + meses_alerta_vencimiento`
- `normal` → cualquier otro caso

**estado_stock** (requiere JOIN a Producto para obtener stock_minimo):
- `agotado` → si `stock_actual = 0`
- `poco_stock` → si `stock_actual <= stock_minimo`
- `normal` → cualquier otro caso

> **Nota de implementación:** Como estas columnas generadas necesitan datos de otra tabla (Producto), en PostgreSQL se implementan como **vistas** o **funciones**, no como columnas GENERATED puras.

### Lote_Presentacion *(precios por lote)*
| Atributo | Restricción | Nota |
|---|---|---|
| id_lote | FK → Lote, NOT NULL | PK compuesta |
| id_presentacion | FK → Presentacion, NOT NULL | PK compuesta |
| precio_venta | NOT NULL | Precio normal en esta presentación para este lote |
| margen_ganancia | NOT NULL | % float — al modificarlo recalcula precio_venta |
| precio_mayoreo | NULLABLE | Precio fijo al llegar a cantidad_mayoreo |
| cantidad_mayoreo | NULLABLE | Cantidad mínima para aplicar precio_mayoreo |

> **Regla de negocio — mayoreo:** `precio_mayoreo` y `cantidad_mayoreo` deben llenarse juntos o ninguno. El campo `aplica_mayoreo` en `Producto` controla si el dependiente ve o no la opción en el punto de venta. El mayoreo se activa manualmente por el dependiente en POS, no automáticamente.
>
> **Fórmula de precio:** `precio_venta = precio_compra × (1 + margen_ganancia / 100)`. La relación es bidireccional en el frontend: modificar el margen actualiza el precio_venta y viceversa.

---