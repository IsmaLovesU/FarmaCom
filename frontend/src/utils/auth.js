const AUTH_USER_KEY = 'usuario';

export const getStoredUser = () => {
  const rawUser = localStorage.getItem(AUTH_USER_KEY);

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser);
  } catch {
    localStorage.removeItem(AUTH_USER_KEY);
    return null;
  }
};

export const saveSession = (usuario) => {
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(usuario));
};

export const clearSession = () => {
  localStorage.removeItem(AUTH_USER_KEY);
};

export const isAuthenticated = () => Boolean(getStoredUser());
