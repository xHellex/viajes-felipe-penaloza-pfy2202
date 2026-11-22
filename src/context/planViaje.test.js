import { describe, expect, it } from 'vitest'
import {
  cambiaDestino, cargarPlan, elegir, hotelCubreViaje, nochesDelVuelo, PLAN_VACIO, quitar, serializarPlan, totalPlan,
} from './planViaje.js'

const cusco = { id: 'cusco', nombre: 'Cusco', pais: 'Perú' }
const madrid = { id: 'madrid', nombre: 'Madrid', pais: 'España' }
// Sale el 12 a las 06:15 y vuelve el 19 a las 14:40 (hora de Chile): 7 noches
const vuelo = { id: 'v1', aerolinea: 'LATAM', salida: '2026-12-12T06:15:00-03:00', regreso: '2026-12-19T14:40:00-03:00', precio: 289000 }
const hotel = { id: 'h1', nombre: 'Casa', precioNoche: 68000, disponibleDesde: '2026-12-01', disponibleHasta: '2027-03-31' }

describe('elegir', () => {
  it('elegir un vuelo define el destino del plan', () => {
    expect(elegir(PLAN_VACIO, { destino: cusco, tipo: 'vuelo', opcion: vuelo })).toEqual({ destino: cusco, vuelo, hotel: null })
  })

  it('elegir en el mismo destino conserva lo anterior', () => {
    const plan = elegir(PLAN_VACIO, { destino: cusco, tipo: 'vuelo', opcion: vuelo })
    expect(elegir(plan, { destino: cusco, tipo: 'hotel', opcion: hotel })).toEqual({ destino: cusco, vuelo, hotel })
  })

  it('elegir en otro destino reemplaza el destino y limpia la selección anterior', () => {
    const plan = { destino: cusco, vuelo, hotel }
    const otroHotel = { ...hotel, id: 'h9' }
    expect(elegir(plan, { destino: madrid, tipo: 'hotel', opcion: otroHotel })).toEqual({ destino: madrid, vuelo: null, hotel: otroHotel })
  })

  it('cambiaDestino avisa solo si hay algo elegido en otro destino', () => {
    expect(cambiaDestino(PLAN_VACIO, 'madrid')).toBe(false)
    expect(cambiaDestino({ destino: cusco, vuelo, hotel: null }, 'cusco')).toBe(false)
    expect(cambiaDestino({ destino: cusco, vuelo, hotel: null }, 'madrid')).toBe(true)
  })

  it('quitar lo último que quedaba vacía el plan', () => {
    const plan = { destino: cusco, vuelo, hotel }
    expect(quitar(plan, 'vuelo')).toEqual({ destino: cusco, vuelo: null, hotel })
    expect(quitar(quitar(plan, 'vuelo'), 'hotel')).toEqual(PLAN_VACIO)
  })
})

describe('noches y total', () => {
  it('las noches se cuentan por fecha en Chile, no por horas', () => {
    expect(nochesDelVuelo(vuelo)).toBe(7)
  })

  it('el total es el vuelo más el hotel por las noches del viaje', () => {
    expect(totalPlan({ destino: cusco, vuelo, hotel })).toBe(289000 + 68000 * 7)
    expect(totalPlan({ destino: cusco, vuelo, hotel: null })).toBe(289000)
    expect(totalPlan(PLAN_VACIO)).toBe(0)
  })

  it('avisa si el hotel no está disponible en todas las fechas del vuelo', () => {
    expect(hotelCubreViaje({ destino: cusco, vuelo, hotel })).toBe(true)
    expect(hotelCubreViaje({ destino: cusco, vuelo, hotel: { ...hotel, disponibleDesde: '2026-12-15' } })).toBe(false)
  })
})

describe('persistencia', () => {
  it('lo guardado se vuelve a leer igual', () => {
    const plan = { destino: cusco, vuelo, hotel }
    expect(cargarPlan(serializarPlan(plan))).toEqual(plan)
  })

  it('datos ausentes, dañados o de otra versión vuelven a un plan vacío', () => {
    expect(cargarPlan(null)).toEqual(PLAN_VACIO)
    expect(cargarPlan('basura')).toEqual(PLAN_VACIO)
    expect(cargarPlan(JSON.stringify({ version: 99, plan: { destino: cusco, vuelo, hotel } }))).toEqual(PLAN_VACIO)
    expect(cargarPlan(JSON.stringify({ version: 1, plan: { destino: cusco, vuelo: { id: 'v1' }, hotel: null } }))).toEqual(PLAN_VACIO)
  })
})
