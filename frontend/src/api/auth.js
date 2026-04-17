import api from './axios';

export const login = async (correo_usuario, contrasena) => {
  const response = await api.post('/auth/login', {
    correo_usuario,
    contrasena,
  }, {
    skipAuthHandling: true,
  });
  return response.data;
};

export const logout = async () => {
  const response = await api.post('/auth/logout', {}, {
    skipAuthHandling: true,
  });
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};
