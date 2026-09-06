import { check } from 'k6';

export const comprobarRespuestaJson = (respuesta, nombre, estadoEsperado = 200) => check(respuesta, {
  [`${nombre}: estado ${estadoEsperado}`]: (resultado) => resultado.status === estadoEsperado,
  [`${nombre}: respuesta JSON`]: (resultado) => {
    const tipoContenido = resultado.headers['Content-Type'] || '';
    return tipoContenido.toLowerCase().includes('application/json');
  },
});
