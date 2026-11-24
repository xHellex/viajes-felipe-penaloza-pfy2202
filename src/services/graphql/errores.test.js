import { CombinedGraphQLErrors, ServerError, ServerParseError } from '@apollo/client/errors'
import { describe, expect, it } from 'vitest'
import { traducirErrorGraphql } from './errores.js'

const respuesta = (status) => new Response('', { status })

describe('traducirErrorGraphql', () => {
  it('un error GraphQL del servidor → servidor, con el mensaje recibido', () => {
    const error = new CombinedGraphQLErrors({ errors: [{ message: 'El proveedor no responde.' }] })
    expect(traducirErrorGraphql(error)).toMatchObject({ name: 'ErrorApi', tipo: 'servidor', message: 'El proveedor no responde.' })
  })

  it('un status HTTP de error → servidor, o sin-servicio si el endpoint no existe', () => {
    expect(traducirErrorGraphql(new ServerError('x', { response: respuesta(503), bodyText: '' })).tipo).toBe('servidor')
    // GitHub Pages sin el Service Worker: 404 o 405 (no acepta POST)
    expect(traducirErrorGraphql(new ServerError('x', { response: respuesta(404), bodyText: '' })).tipo).toBe('sin-servicio')
    expect(traducirErrorGraphql(new ServerError('x', { response: respuesta(405), bodyText: '' })).tipo).toBe('sin-servicio')
  })

  it('un cuerpo que no es JSON → respuesta', () => {
    const error = new ServerParseError(new SyntaxError('Unexpected token <'), { response: respuesta(200), bodyText: '<html>' })
    expect(traducirErrorGraphql(error).tipo).toBe('respuesta')
  })

  it('cualquier otra falla (fetch rechazado) → red', () => {
    expect(traducirErrorGraphql(new TypeError('Failed to fetch')).tipo).toBe('red')
  })
})
