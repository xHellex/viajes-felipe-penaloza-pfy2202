import { createContext, useContext } from 'react'

/*
 * Plan de viaje: un destino con, a lo más, un vuelo y un hotel de ESE destino.
 * Funciones puras (probadas en planViaje.test.js); el Provider solo guarda el estado.
 */

export const PLAN_VACIO = { destino: null, vuelo: null, hotel: null }
export const CLAVE_PLAN = 'rumbo:plan'
const VERSION_PLAN = 1

/**
 * Agrega un vuelo o un hotel. Si la opción es de otro destino, el plan pasa a ese destino
 * y se descarta lo elegido antes: nunca se mezcla un vuelo a Cusco con un hotel en Madrid.
 */
export function elegir(plan, { destino, tipo, opcion }) {
  const base = plan.destino?.id === destino.id ? plan : { ...PLAN_VACIO, destino }
  return { ...base, [tipo]: opcion }
}

/** true si elegir algo de destinoId descartaría opciones ya elegidas de otro destino. */
export function cambiaDestino(plan, destinoId) {
  return plan.destino !== null && plan.destino.id !== destinoId && Boolean(plan.vuelo || plan.hotel)
}

export function quitar(plan, tipo) {
  const resto = { ...plan, [tipo]: null }
  return resto.vuelo || resto.hotel ? resto : PLAN_VACIO
}

// Fecha calendario en Chile ("2026-12-12"); en-CA da el formato AAAA-MM-DD
const fechaChile = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Santiago', year: 'numeric', month: '2-digit', day: '2-digit' })
const diaChile = (iso) => fechaChile.format(new Date(iso))

/** Noches entre la llegada y el regreso, contadas por fecha (no por horas de vuelo). */
export function nochesDelVuelo(vuelo) {
  return Math.round((Date.parse(diaChile(vuelo.regreso)) - Date.parse(diaChile(vuelo.salida))) / 86_400_000)
}

/** Vuelo + hotel por las noches del viaje. Sin vuelo no se sabe cuántas noches son: solo cuenta lo elegido. */
export function totalPlan({ vuelo, hotel }) {
  if (!vuelo) return 0
  return vuelo.precio + (hotel ? hotel.precioNoche * nochesDelVuelo(vuelo) : 0)
}

/** El hotel debe estar disponible desde el día de llegada hasta el día de regreso. */
export function hotelCubreViaje({ vuelo, hotel }) {
  if (!vuelo || !hotel) return true
  return hotel.disponibleDesde <= diaChile(vuelo.salida) && diaChile(vuelo.regreso) <= hotel.disponibleHasta
}

const esTexto = (v) => typeof v === 'string' && v.length > 0
const esVuelo = (v) => v === null || (esTexto(v?.id) && esTexto(v.salida) && esTexto(v.regreso) && Number.isFinite(v.precio))
const esHotel = (h) => h === null || (esTexto(h?.id) && esTexto(h.disponibleDesde) && Number.isFinite(h.precioNoche))

/** Lee el plan guardado. Si falta, está dañado o es de otra versión, se parte con un plan vacío. */
export function cargarPlan(texto) {
  try {
    const { version, plan } = JSON.parse(texto)
    const valido = version === VERSION_PLAN && esTexto(plan?.destino?.id) && esVuelo(plan.vuelo) && esHotel(plan.hotel)
    return valido ? plan : PLAN_VACIO
  } catch {
    return PLAN_VACIO
  }
}

export const serializarPlan = (plan) => JSON.stringify({ version: VERSION_PLAN, plan })

// Estado y acciones en contextos separados: quien solo elige no se vuelve a renderizar al cambiar el plan
export const PlanEstadoContext = createContext(PLAN_VACIO)
export const PlanAccionesContext = createContext(null)

export const usePlanViaje = () => useContext(PlanEstadoContext)
export const useAccionesPlan = () => useContext(PlanAccionesContext)
