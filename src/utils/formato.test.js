import { describe, expect, it } from 'vitest'
import { formatearCLP, formatearDia, formatearDuracion, formatearFechaHora } from './formato.js'

// Intl separa con espacios especiales (no separables) que cambian según el motor: \s los cubre a todos
const plano = (texto) => texto.replace(/\s/g, ' ')

describe('formato', () => {
  it('formatea pesos chilenos sin decimales', () => {
    expect(plano(formatearCLP(289000))).toBe('$289.000')
  })

  it('una fecha sin hora no se corre un día por la zona horaria', () => {
    expect(formatearDia('2026-12-01')).toMatch(/^1 dic/)
  })

  it('la fecha y hora de un vuelo se muestra en hora de Chile', () => {
    expect(plano(formatearFechaHora('2026-12-12T06:15:00-03:00'))).toMatch(/12 dic.*06:15/)
  })

  it('formatea la duración en horas y minutos', () => {
    expect(formatearDuracion(225)).toBe('3 h 45 min')
    expect(formatearDuracion(120)).toBe('2 h')
  })
})
