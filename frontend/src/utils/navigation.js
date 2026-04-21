export function getDefaultRouteForRole(rol) {
  if (rol === 'dueno' || rol === 'administrador') {
    return '/sucursales';
  }

  return '/dashboard';
}
