import { http, HttpResponse } from 'msw'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { servidor } from '../../mocks/node.js'
import { obtenerJSON, urlApi } from './clienteRest.js'

beforeAll(() => servidor.listen({ onUnhandledRequest: 'error' }))
afterEach(() => servidor.resetHandlers())
afterAll(() => servidor.close())

describe('urlApi', () => {
  it('arma la URL con la base y omite los parámetros vacíos', () => {
    expect(urlApi('api/destinos', { continente: 'Asia', simular: null, q: '' })).toBe('http://localhost/api/destinos?continente=Asia')
  })
})

describe('obtenerJSON', () => {
  it('devuelve el JSON de una respuesta 2xx', async () => {
    const destino = await obtenerJSON('api/destinos/cusco')
    expect(destino.id).toBe('cusco')
  })

  it('404 → no-encontrado con el mensaje del servidor', async () => {
    await expect(obtenerJSON('api/destinos/no-existe')).rejects.toMatchObject({
      name: 'ErrorApi', tipo: 'no-encontrado', status: 404, message: expect.stringMatching(/no existe/),
    })
  })

  it('404 sin JSON (lo responde el hosting, no la API) → sin-servicio', async () => {
    servidor.use(http.get('*/api/destinos', () => HttpResponse.html('<!doctype html><p>404</p>', { status: 404 })))
    await expect(obtenerJSON('api/destinos')).rejects.toMatchObject({ tipo: 'sin-servicio', status: 404 })
  })

  it('500 → servidor', async () => {
    await expect(obtenerJSON('api/destinos', { params: { simular: 'servidor' } })).rejects.toMatchObject({ tipo: 'servidor', status: 500 })
  })

  it('falla de conexión → red', async () => {
    await expect(obtenerJSON('api/destinos', { params: { simular: 'red' } })).rejects.toMatchObject({ tipo: 'red' })
  })

  it('un cuerpo que no es JSON → respuesta', async () => {
    servidor.use(http.get('*/api/destinos', () => HttpResponse.html('<!doctype html><p>index</p>')))
    await expect(obtenerJSON('api/destinos')).rejects.toMatchObject({ tipo: 'respuesta' })
  })

  it('una petición cancelada se propaga como AbortError, no como ErrorApi', async () => {
    const control = new AbortController()
    const promesa = obtenerJSON('api/destinos', { signal: control.signal })
    control.abort()
    await expect(promesa).rejects.toMatchObject({ name: 'AbortError' })
  })
})
