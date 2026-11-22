import { describe, expect, it } from 'vitest'
import { interpretarOpciones } from './opciones.js'

const valido = {
  destino: { id: 'cusco', nombre: 'Cusco', pais: 'Perú' },
  vuelos: [{ id: 'v1', aerolinea: 'LATAM', salida: '2026-12-12T06:15:00-03:00', regreso: '2026-12-19T14:40:00-03:00', precio: 1, asientosDisponibles: 0 }],
  hoteles: [{ id: 'h1', nombre: 'Casa', precioNoche: 1, disponibleDesde: '2026-12-01', disponibleHasta: '2027-03-31', habitacionesDisponibles: 2 }],
}

describe('interpretarOpciones', () => {
  it('entrega las opciones si tienen la forma esperada', () => {
    expect(interpretarOpciones(valido)).toBe(valido)
  })

  it('opcionesViaje null significa destino inexistente', () => {
    expect(() => interpretarOpciones(null)).toThrow(expect.objectContaining({ tipo: 'no-encontrado' }))
  })

  it('rechaza listas que no son arreglos o vuelos sin precio', () => {
    expect(() => interpretarOpciones({ ...valido, hoteles: null })).toThrow(expect.objectContaining({ tipo: 'respuesta' }))
    expect(() => interpretarOpciones({ ...valido, vuelos: [{ id: 'v1' }] })).toThrow(expect.objectContaining({ tipo: 'respuesta' }))
  })
})
