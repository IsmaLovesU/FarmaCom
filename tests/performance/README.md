# Pruebas de rendimiento de FarmaCom

Este directorio contiene las pruebas de carga y estrés ejecutadas con Grafana k6. La prueba de humo comprueba primero que k6 puede autenticarse mediante la cookie `auth_token` y consultar una ruta protegida.

## Requisitos

- Docker Desktop en ejecución.
- Una base de datos local con un usuario ficticio activo.
- El usuario debe tener acceso a la sucursal configurada.

## Configuración inicial

Desde la raíz del repositorio, crea el archivo local de configuración:

```powershell
Copy-Item tests/performance/.env.performance.example tests/performance/.env.performance
```

Edita `.env.performance` y reemplaza el correo, la contraseña y el identificador de sucursal. Este archivo está ignorado por Git y no debe contener datos de producción.

## Ejecutar la prueba de humo

```powershell
docker compose --env-file .env --env-file tests/performance/.env.performance -f docker-compose.yml -f docker-compose.k6.yml --profile performance run --rm k6-smoke
```

La ejecución realiza tres solicitudes:

1. Inicia sesión mediante `POST /api/auth/login`.
2. Verifica la sesión mediante `GET /api/auth/me`.
3. Consulta el inventario mediante `GET /api/sucursales/:id/inventario`.

El reporte HTML se genera en `tests/performance/results/smoke.html`. Los reportes y las credenciales locales no se incluyen en Git.

## Criterios de la prueba de humo

- Todas las comprobaciones deben ser satisfactorias.
- No debe existir ninguna solicitud HTTP fallida.
- El percentil 95 del tiempo de respuesta debe ser menor a 2 segundos.

La prueba de humo no crea ventas ni modifica el inventario.

## Ejecutar la carga de consultas

```powershell
docker compose --env-file .env --env-file tests/performance/.env.performance -f docker-compose.yml -f docker-compose.k6.yml --profile performance run --rm k6-load-queries
```

La prueba distribuye seis usuarios virtuales de esta forma:

- Tres usuarios consultan el catálogo del punto de venta, inventario y cajas.
- Dos usuarios consultan clientes, productos y el resumen de inventario.
- Un usuario consulta los indicadores del dashboard.

Los usuarios aumentan gradualmente durante 30 segundos, mantienen la carga durante cuatro minutos y descienden durante 30 segundos. Las cantidades y duraciones pueden modificarse en `.env.performance`.

### Criterios de carga

- Más del 98 % de las comprobaciones debe ser satisfactorio.
- La tasa de solicitudes HTTP fallidas debe ser menor al 2 %.
- El percentil 95 de las consultas debe ser menor a 2 segundos.
- El percentil 95 de los reportes debe ser menor a 3 segundos.

El reporte se genera en `tests/performance/results/load-queries.html`. Este escenario solo realiza consultas y no modifica la base de datos.
