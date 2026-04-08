const AUTH_STORAGE_KEY = 'auth';
const LEGACY_USER_KEY = 'usuario';

const normalizeAuthState = (data) => {
  if (!data || typeof data !== 'object' || !data.usuario) {
    return null;
  }

  return {
    usuario: data.usuario,
    sucursalActivaId: data.sucursalActivaId ?? data.usuario.id_sucursal ?? null,
  };
};

export const getStoredAuth = () => {
  const rawAuth = localStorage.getItem(AUTH_STORAGE_KEY);

  if (rawAuth) {
    try {
      return normalizeAuthState(JSON.parse(rawAuth));
    } catch {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }

  const rawLegacyUser = localStorage.getItem(LEGACY_USER_KEY);

  if (!rawLegacyUser) {
    return null;
  }

  try {
    return normalizeAuthState({ usuario: JSON.parse(rawLegacyUser) });
  } catch {
    localStorage.removeItem(LEGACY_USER_KEY);
    return null;
  }
};

export const saveSession = (authState) => {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState));
  localStorage.removeItem(LEGACY_USER_KEY);
};

export const clearSession = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem(LEGACY_USER_KEY);
};
