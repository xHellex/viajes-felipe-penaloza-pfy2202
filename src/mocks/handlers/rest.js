import { delay, http, HttpResponse } from 'msw'
import { destinos } from '../datos/destinos.js'

// Demora realista en el navegador; en las pruebas no se espera
export const DEMORA = import.meta.env.MODE === 'test' ? 0 : 600

/**
 * Modo demostración: ?simular=servidor responde 500 y ?simular=red corta la conexión.
 * Devuelve la respuesta del escenario o null si la petición es normal.
 */
function escenarioSimulado(request) {
  const simular = new URL(request.url).searchParams.get('simular')
  if (simular === 'servidor') {
    return HttpResponse.json({ mensaje: 'El servicio de destinos no está disponible en este momento.' }, { status: 500 })
  }
  if (simular === 'red') return HttpResponse.error()
  return null
}

/** Lo que muestra la tarjeta del listado: país y los nombres de las 3 actividades principales. */
function resumenDestino({ id, nombre, pais, continente, resumen, actividades, precioDesde, tono }) {
  return { id, nombre, pais, continente, resumen, actividades: actividades.slice(0, 3).map((a) => a.nombre), precioDesde, tono }
}

export const handlersRest = [
  http.get('*/api/destinos', async ({ request }) => {
    await delay(DEMORA)
    const simulado = escenarioSimulado(request)
    if (simulado) return simulado

    const continente = new URL(request.url).searchParams.get('continente')
    const lista = continente ? destinos.filter((d) => d.continente === continente) : destinos
    return HttpResponse.json(lista.map(resumenDestino))
  }),

  http.get('*/api/destinos/:id', async ({ request, params }) => {
    await delay(DEMORA)
    const simulado = escenarioSimulado(request)
    if (simulado) return simulado

    const destino = destinos.find((d) => d.id === params.id)
    if (!destino) {
      return HttpResponse.json({ mensaje: `El destino "${params.id}" no existe en nuestro catálogo.` }, { status: 404 })
    }
    return HttpResponse.json(destino)
  }),
]
