import { describe, expect, it } from 'vitest'
import { ErrorApi, MENSAJES, permiteReintento } from './mensajes.js'

describe('tabla de mensajes', () => {
  it('cada tipo tiene título, detalle y sugerencia', () => {
    for (const mensaje of Object.values(MENSAJES)) {
      expect(mensaje).toMatchObject({ titulo: expect.any(String), detalle: expect.any(String), sugerencia: expect.any(String) })
    }
  })

  it('solo los errores de red, de servidor y sin servicio permiten reintentar', () => {
    expect(permiteReintento(new ErrorApi('red'))).toBe(true)
    expect(permiteReintento(new ErrorApi('servidor'))).toBe(true)
    expect(permiteReintento(new ErrorApi('sin-servicio'))).toBe(true)
    expect(permiteReintento(new ErrorApi('no-encontrado'))).toBe(false)
    expect(permiteReintento(new ErrorApi('respuesta'))).toBe(false)
  })

  it('ErrorApi usa el detalle del tipo si no llega un mensaje', () => {
    expect(new ErrorApi('servidor').message).toBe(MENSAJES.servidor.detalle)
    expect(new ErrorApi('servidor', { mensaje: 'Caído' }).message).toBe('Caído')
  })
})
