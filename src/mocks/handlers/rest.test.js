import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { servidor } from '../node.js'

const API = 'http://localhost/api/destinos'

beforeAll(() => servidor.listen({ onUnhandledRequest: 'error' }))
afterEach(() => servidor.resetHandlers())
afterAll(() => servidor.close())

describe('GET /api/destinos', () => {
  it('lista los 8 destinos con país y actividades populares', async () => {
    const respuesta = await fetch(API)
    const destinos = await respuesta.json()

    expect(respuesta.status).toBe(200)
    expect(destinos).toHaveLength(8)
    for (const destino of destinos) {
      expect(destino).toMatchObject({ id: expect.any(String), nombre: expect.any(String), pais: expect.any(String) })
      expect(destino.actividades.length).toBeGreaterThan(0)
      expect(destino.actividades.every((a) => typeof a === 'string')).toBe(true)
    }
  })

  it('filtra por continente en el servidor', async () => {
    const destinos = await (await fetch(`${API}?continente=Asia`)).json()
    expect(destinos.map((d) => d.id)).toEqual(['tokio'])
  })

  it('devuelve un arreglo vacío si ningún destino calza', async () => {
    const respuesta = await fetch(`${API}?continente=Antártica`)
    expect(respuesta.status).toBe(200)
    expect(await respuesta.json()).toEqual([])
  })

  it('simular=servidor responde 500 con mensaje', async () => {
    const respuesta = await fetch(`${API}?simular=servidor`)
    expect(respuesta.status).toBe(500)
    expect((await respuesta.json()).mensaje).toEqual(expect.any(String))
  })

  it('simular=red hace fallar la conexión', async () => {
    await expect(fetch(`${API}?simular=red`)).rejects.toThrow(TypeError)
  })
})

describe('GET /api/destinos/:id', () => {
  it('entrega la información completa del destino', async () => {
    const respuesta = await fetch(`${API}/cusco`)
    const destino = await respuesta.json()

    expect(respuesta.status).toBe(200)
    expect(destino).toMatchObject({ id: 'cusco', nombre: 'Cusco', pais: 'Perú' })
    expect(destino.descripcion).toEqual(expect.any(String))
    expect(destino.actividades[0]).toMatchObject({ nombre: expect.any(String), descripcion: expect.any(String) })
  })

  it('responde 404 con mensaje si el destino no existe', async () => {
    const respuesta = await fetch(`${API}/no-existe`)
    expect(respuesta.status).toBe(404)
    expect((await respuesta.json()).mensaje).toMatch(/no existe/i)
  })

  it('también acepta los escenarios simulados', async () => {
    expect((await fetch(`${API}/cusco?simular=servidor`)).status).toBe(500)
  })
})
