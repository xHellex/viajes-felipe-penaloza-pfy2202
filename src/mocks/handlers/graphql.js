import { delay, graphql, HttpResponse } from 'msw'
import { destinos } from '../datos/destinos.js'
import { opcionesPorDestino } from '../datos/opciones.js'
import { DEMORA } from './rest.js'

// Acepta /graphql en cualquier origen y base (dev, GitHub Pages y pruebas en Node)
const api = graphql.link(/\/graphql$/)

export const handlersGraphql = [
  api.query('OpcionesViaje', async ({ variables, request }) => {
    await delay(DEMORA)

    // Modo demostración: la app envía el encabezado x-simular cuando la página tiene ?simular=graphql
    if (request.headers.get('x-simular') === 'graphql') {
      return HttpResponse.json({
        errors: [{ message: 'El proveedor de vuelos y hoteles no responde.', extensions: { code: 'PROVEEDOR_NO_DISPONIBLE' } }],
      })
    }

    const { destinoId, soloDisponibles = false } = variables
    const destino = destinos.find((d) => d.id === destinoId)
    if (!destino) return HttpResponse.json({ data: { opcionesViaje: null } })

    const { vuelos, hoteles } = opcionesPorDestino[destinoId]
    // __typename y destinoId en cada objeto: Apollo normaliza su caché por __typename + id
    return HttpResponse.json({
      data: {
        opcionesViaje: {
          __typename: 'OpcionesViaje',
          destino: { __typename: 'DestinoResumen', id: destino.id, nombre: destino.nombre, pais: destino.pais },
          vuelos: vuelos
            .filter((v) => !soloDisponibles || v.asientosDisponibles > 0)
            .map((v) => ({ __typename: 'Vuelo', destinoId, ...v })),
          hoteles: hoteles
            .filter((h) => !soloDisponibles || h.habitacionesDisponibles > 0)
            .map((h) => ({ __typename: 'Hotel', destinoId, ...h })),
        },
      },
    })
  }),
]
