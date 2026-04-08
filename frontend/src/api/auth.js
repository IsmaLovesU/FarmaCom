import api from './axios';

export const login = async (correo_usuario, contrasena) => {
  const response = await api.post('/auth/login', {
    correo_usuario,
    contrasena,
  });
  return response.data;
};

export const logout = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};
