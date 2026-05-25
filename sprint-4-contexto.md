## Estado actual antes del Sprint 4

### Módulos ya implementados (Sprints 2 y 3)

- **Backend**:
  - CRUD completo de `Usuario` (con roles, autenticación JWT, desactivación)
  - CRUD completo de `Sucursal` (con teléfonos y correos anidados)
  - CRUD completo de `Categoría`
  - CRUD completo de `Proveedor` (con teléfonos y correos)
  - CRUD completo de `Producto` (campos básicos, sin lotes)
  - CRUD completo de `Casa Farmacéutica` 
  - Modelos y relaciones de `Ciudad`, `CasaFarmaceutica` (backend listo, **sin frontend**)
  - Endpoint de búsqueda de productos con filtros (categoría, proveedor, nombre)

- **Frontend**:
  - Login con redirección por rol
  - Gestión de usuarios (listado, crear, editar, desactivar)
  - Gestión de sucursales (con contactos)
  - Gestión de categorías
  - Gestión de proveedores (con contactos)
  - Gestión de productos (listado, formulario básico)

- **Infraestructura**:
  - Servidor en la nube con Docker, dominio propio y HTTPS
  - Pipeline de despliegue manual (docker compose)

### Pendiente de implementar (objetivo del Sprint 4)

1. **Backend de ciudades** .
2. **Frontend de ciudades** .
3. **Frontend de casas farmacéuticas** (backend ya existe).
4. **Backend y frontend de lotes**.
5. **Pantalla de inventario por sucursal**.
6. **Alertas visuales** (vencimiento y stock bajo).
7. **Mejora UX**: edición inline de teléfonos/correos en sucursal y proveedor.


### Lista de tareas

| Tarea | SP |
|-------|----|
| Crear tareas en Jira e inicializar Sprint | 0.5 |
| Frontend: botones para editar contactos en Sucursal | 0.5 |
| Frontend: botones para editar contactos en Proveedor | 0.5 |
| Frontend: página de listado de ciudades | 1 |
| Frontend: formulario de ciudad | 0.5 |
| Frontend: integrar ciudades en sucursal | 0.5 |
| Frontend: página de listado de casas farmacéuticas | 1.5 |
| Frontend: formulario de casa farmacéutica con contactos | 1 |
| Frontend: integrar casa farmacéutica en producto | 0.5 |
| Backend: CRUD de Lote | 2.5 |
| Backend: CRUD de Lote_Presentacion | 2 |
| Backend: endpoint de productos con stock por sucursal | 1.5 |
| Frontend: pantalla de inventario por sucursal | 2 |
| Frontend: formulario para agregar lote | 2 |
| Frontend: integrar creación de lote | 1 |
| Frontend: filtros en inventario y búsqueda | 1.5 |
| Frontend: modal de lotes por producto | 2 |
| Backend: endpoint de alertas | 1.5 |
| Frontend: pantalla de alertas globales | 2 |
| Servidor: Despliegue y pruebas en producción | 1 |
| Hacer LOGT individual | 0.5 c/u |
| Generar gráfico burndown | 1 |
| Calcular velocidad del sprint | 0.5 |
| Calcular éxito del sprint | 1 |
| Retrospectiva del sprint | 0.5 |
| Grabación de video de demostración | 0.5 |
| Revisión del trabajo y entrega | 0.5 |



## Notas adicionales para el desarrollador IA

- **Arquitectura backend**: Capas: `routes` → `controllers` → `services` → `DAOs`. Usar los DAOs existentes como referencia.
- **Autenticación**: Todas las rutas API (excepto login) usan middleware `auth` y `checkRole`.
- **Frontend**: Usar los componentes reutilizables. El estado global se maneja con React Context + useReducer.
- **Estilo de código**: Sigue el mismo patrón que en los sprints anteriores (nombres de archivos, exports, manejo de errores con try/catch y mensajes claros).
- **Validaciones**: En backend con `express-validator`, en frontend con validación manual antes de enviar.