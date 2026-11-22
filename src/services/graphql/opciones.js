import { ErrorApi } from '../mensajes.js'

const esTexto = (valor) => typeof valor === 'string' && valor.length > 0
const esNumero = (valor) => Number.isFinite(valor)

const esVuelo = (v) => esTexto(v?.id) && esTexto(v.aerolinea) && esTexto(v.salida) && esTexto(v.regreso)
  && esNumero(v.precio) && esNumero(v.asientosDisponibles)

const esHotel = (h) => esTexto(h?.id) && esTexto(h.nombre) && esTexto(h.disponibleDesde) && esTexto(h.disponibleHasta)
  && esNumero(h.precioNoche) && esNumero(h.habitacionesDisponibles)

/**
 * Valida el campo opcionesViaje de la respuesta GraphQL antes de entregarlo a la interfaz.
 * null significa que el destino no existe (GraphQL responde 200 igual, sin status 404).
 */
export function interpretarOpciones(opcionesViaje) {
  if (opcionesViaje === null) throw new ErrorApi('no-encontrado')
  const { destino, vuelos, hoteles } = opcionesViaje ?? {}
  const valido = esTexto(destino?.id) && Array.isArray(vuelos) && vuelos.every(esVuelo)
    && Array.isArray(hoteles) && hoteles.every(esHotel)
  if (!valido) throw new ErrorApi('respuesta')
  return opcionesViaje
}
