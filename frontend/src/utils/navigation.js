export function getDefaultRouteForRole(rol) {
  if (rol === 'dueno' || rol === 'administrador') {
    return '/usuarios';
  }

  return '/dashboard';
}
