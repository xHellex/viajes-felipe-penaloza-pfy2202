import { ErrorApi } from '../mensajes.js'
import { obtenerJSON } from './clienteRest.js'

/*
 * Acceso a los destinos (REST). Se valida la forma de cada respuesta antes de entregarla
 * a la interfaz: si el servidor cambia el contrato, se informa un error claro en vez de
 * romper un componente con "undefined".
 */

const esTexto = (valor) => typeof valor === 'string' && valor.length > 0

function esDestinoResumen(d) {
  return esTexto(d?.id) && esTexto(d.nombre) && esTexto(d.pais)
    && Array.isArray(d.actividades) && d.actividades.length > 0 && d.actividades.every(esTexto)
}

function esDestino(d) {
  return esTexto(d?.id) && esTexto(d.nombre) && esTexto(d.pais) && esTexto(d.descripcion)
    && Array.isArray(d.actividades) && d.actividades.every((a) => esTexto(a?.nombre) && esTexto(a.descripcion))
}

function validar(datos, esValido) {
  if (!esValido(datos)) throw new ErrorApi('respuesta')
  return datos
}

/** GET api/destinos. continente se filtra en el servidor; simular activa el modo demostración. */
export async function listarDestinos({ continente, simular } = {}, signal) {
  const destinos = await obtenerJSON('api/destinos', { params: { continente, simular }, signal })
  return validar(destinos, (lista) => Array.isArray(lista) && lista.every(esDestinoResumen))
}

/** GET api/destinos/:id con la información completa del destino. */
export async function obtenerDestino(id, { simular } = {}, signal) {
  const destino = await obtenerJSON(`api/destinos/${encodeURIComponent(id)}`, { params: { simular }, signal })
  return validar(destino, esDestino)
}
