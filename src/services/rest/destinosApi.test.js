import { http, HttpResponse } from 'msw'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { servidor } from '../../mocks/node.js'
import { listarDestinos, obtenerDestino } from './destinosApi.js'

beforeAll(() => servidor.listen({ onUnhandledRequest: 'error' }))
afterEach(() => servidor.resetHandlers())
afterAll(() => servidor.close())

describe('listarDestinos', () => {
  it('entrega los destinos y reenvía el filtro al servidor', async () => {
    expect(await listarDestinos()).toHaveLength(8)
    expect((await listarDestinos({ continente: 'Europa' })).map((d) => d.id)).toEqual(['madrid'])
  })

  it('rechaza una respuesta que no es un arreglo', async () => {
    servidor.use(http.get('*/api/destinos', () => HttpResponse.json({ destinos: [] })))
    await expect(listarDestinos()).rejects.toMatchObject({ tipo: 'respuesta' })
  })

  it('rechaza destinos sin país o sin actividades', async () => {
    servidor.use(http.get('*/api/destinos', () => HttpResponse.json([{ id: 'x', nombre: 'X', actividades: [] }])))
    await expect(listarDestinos()).rejects.toMatchObject({ tipo: 'respuesta' })
  })
})

describe('obtenerDestino', () => {
  it('entrega el detalle validado', async () => {
    const destino = await obtenerDestino('madrid')
    expect(destino).toMatchObject({ id: 'madrid', pais: 'España' })
  })

  it('rechaza un detalle con actividades sin descripción', async () => {
    servidor.use(http.get('*/api/destinos/:id', () => HttpResponse.json({ id: 'x', nombre: 'X', pais: 'Y', descripcion: 'Z', actividades: ['a'] })))
    await expect(obtenerDestino('x')).rejects.toMatchObject({ tipo: 'respuesta' })
  })
})
