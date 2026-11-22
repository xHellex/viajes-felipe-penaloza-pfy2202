import { print } from 'graphql'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { OPCIONES_VIAJE } from '../../services/graphql/operaciones.js'
import { destinos } from '../datos/destinos.js'
import { servidor } from '../node.js'

beforeAll(() => servidor.listen({ onUnhandledRequest: 'error' }))
afterAll(() => servidor.close())

/** POST GraphQL igual al que hace Apollo: { operationName, query, variables }. */
async function consultar(variables, headers = {}) {
  const respuesta = await fetch('http://localhost/graphql', {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...headers },
    body: JSON.stringify({ operationName: 'OpcionesViaje', query: print(OPCIONES_VIAJE), variables }),
  })
  return respuesta.json()
}

describe('query OpcionesViaje', () => {
  it('devuelve vuelos y hoteles del destino pedido, con precio, fechas y disponibilidad', async () => {
    const { data } = await consultar({ destinoId: 'cusco' })
    const { destino, vuelos, hoteles } = data.opcionesViaje

    expect(destino).toMatchObject({ __typename: 'DestinoResumen', id: 'cusco', nombre: 'Cusco', pais: 'Perú' })
    expect(vuelos.length).toBeGreaterThan(1)
    expect(hoteles.length).toBeGreaterThan(1)
    for (const vuelo of vuelos) {
      expect(vuelo).toMatchObject({ __typename: 'Vuelo', destinoId: 'cusco', precio: expect.any(Number), asientosDisponibles: expect.any(Number) })
      expect(Date.parse(vuelo.salida)).toBeLessThan(Date.parse(vuelo.regreso))
    }
    for (const hotel of hoteles) {
      expect(hotel).toMatchObject({ __typename: 'Hotel', destinoId: 'cusco', precioNoche: expect.any(Number), habitacionesDisponibles: expect.any(Number) })
    }
  })

  it('todo destino del REST tiene vuelos y hoteles en GraphQL con el mismo id', async () => {
    for (const { id } of destinos) {
      const { data } = await consultar({ destinoId: id })
      expect(data.opcionesViaje.destino.id).toBe(id)
      expect(data.opcionesViaje.vuelos.length).toBeGreaterThan(0)
      expect(data.opcionesViaje.hoteles.length).toBeGreaterThan(0)
    }
  })

  it('soloDisponibles excluye vuelos sin asientos y hoteles sin habitaciones', async () => {
    const todos = (await consultar({ destinoId: 'cusco' })).data.opcionesViaje
    const disponibles = (await consultar({ destinoId: 'cusco', soloDisponibles: true })).data.opcionesViaje

    expect(todos.vuelos.some((v) => v.asientosDisponibles === 0)).toBe(true)
    expect(disponibles.vuelos.every((v) => v.asientosDisponibles > 0)).toBe(true)
    expect(disponibles.hoteles.every((h) => h.habitacionesDisponibles > 0)).toBe(true)
    expect(disponibles.vuelos.length).toBeLessThan(todos.vuelos.length)
  })

  it('un destino agotado deja las listas vacías con soloDisponibles', async () => {
    const { data } = await consultar({ destinoId: 'isla-de-pascua', soloDisponibles: true })
    expect(data.opcionesViaje.vuelos).toEqual([])
    expect(data.opcionesViaje.hoteles).toEqual([])
  })

  it('un destino inexistente devuelve opcionesViaje: null', async () => {
    const { data } = await consultar({ destinoId: 'no-existe' })
    expect(data.opcionesViaje).toBeNull()
  })

  it('el modo demostración responde un error GraphQL con código', async () => {
    const { errors } = await consultar({ destinoId: 'cusco' }, { 'x-simular': 'graphql' })
    expect(errors[0]).toMatchObject({ message: expect.any(String), extensions: { code: 'PROVEEDOR_NO_DISPONIBLE' } })
  })
})
