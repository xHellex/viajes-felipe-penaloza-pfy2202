/**
 * Vuelos y hoteles por destino (datos del mock GraphQL). La clave es el mismo id del destino REST.
 * Todos los vuelos salen de Santiago (SCL); precios en CLP (vuelo ida y vuelta, hotel por noche).
 * Las fechas van en ISO 8601 con zona horaria: el horario de verano de Chile es -03:00.
 * Algunas opciones están agotadas (0 asientos o 0 habitaciones) para que se vea la disponibilidad.
 */

const vuelo = (id, aerolinea, salida, regreso, duracionMinutos, escalas, precio, asientosDisponibles) => ({
  id, aerolinea, origen: 'SCL', salida, regreso, duracionMinutos, escalas, precio, asientosDisponibles,
})

const hotel = (id, nombre, estrellas, precioNoche, disponibleDesde, disponibleHasta, habitacionesDisponibles, servicios) => ({
  id, nombre, estrellas, precioNoche, disponibleDesde, disponibleHasta, habitacionesDisponibles, servicios,
})

export const opcionesPorDestino = {
  cusco: {
    vuelos: [
      vuelo('v-cus-1', 'LATAM', '2026-12-12T06:15:00-03:00', '2026-12-19T14:40:00-03:00', 225, 1, 289000, 6),
      vuelo('v-cus-2', 'Sky Airline', '2027-01-08T09:30:00-03:00', '2027-01-15T18:05:00-03:00', 250, 1, 241000, 0),
      vuelo('v-cus-3', 'JetSMART', '2027-02-20T13:50:00-03:00', '2027-02-27T21:10:00-03:00', 270, 1, 219000, 3),
    ],
    hoteles: [
      hotel('h-cus-1', 'Casa Andina San Blas', 3, 68000, '2026-12-01', '2027-03-31', 5, ['Desayuno', 'Wifi', 'Oxígeno']),
      hotel('h-cus-2', 'Palacio Inka Plaza', 5, 215000, '2026-12-10', '2027-02-28', 0, ['Spa', 'Desayuno', 'Restaurante']),
      hotel('h-cus-3', 'Hostal Qorikancha', 2, 39000, '2026-12-01', '2027-03-31', 9, ['Wifi', 'Cocina compartida']),
    ],
  },
  cartagena: {
    vuelos: [
      vuelo('v-ctg-1', 'LATAM', '2026-12-18T07:00:00-03:00', '2026-12-26T20:30:00-03:00', 400, 1, 412000, 4),
      vuelo('v-ctg-2', 'Avianca', '2027-01-22T10:45:00-03:00', '2027-01-30T22:15:00-03:00', 430, 1, 468000, 12),
    ],
    hoteles: [
      hotel('h-ctg-1', 'Hotel Casa San Agustín', 5, 260000, '2026-12-01', '2027-03-15', 2, ['Piscina', 'Desayuno', 'Spa']),
      hotel('h-ctg-2', 'Bastión Getsemaní', 3, 82000, '2026-12-15', '2027-02-28', 7, ['Wifi', 'Terraza', 'Desayuno']),
    ],
  },
  'buenos-aires': {
    vuelos: [
      vuelo('v-bue-1', 'Aerolíneas Argentinas', '2026-12-05T08:20:00-03:00', '2026-12-09T19:00:00-03:00', 125, 0, 198000, 18),
      vuelo('v-bue-2', 'LATAM', '2027-01-14T16:10:00-03:00', '2027-01-18T21:45:00-03:00', 130, 0, 224000, 0),
      vuelo('v-bue-3', 'JetSMART', '2027-03-04T06:40:00-03:00', '2027-03-08T12:30:00-03:00', 130, 0, 159000, 7),
    ],
    hoteles: [
      hotel('h-bue-1', 'Palermo Soho Suites', 4, 98000, '2026-12-01', '2027-03-31', 6, ['Desayuno', 'Gimnasio', 'Wifi']),
      hotel('h-bue-2', 'San Telmo Antiguo', 3, 61000, '2026-12-01', '2027-01-31', 3, ['Wifi', 'Patio']),
      hotel('h-bue-3', 'Alvear Recoleta', 5, 310000, '2027-01-01', '2027-03-31', 0, ['Spa', 'Piscina', 'Restaurante']),
    ],
  },
  'ciudad-de-mexico': {
    vuelos: [
      vuelo('v-mex-1', 'Aeroméxico', '2026-12-26T23:55:00-03:00', '2027-01-04T07:20:00-03:00', 520, 0, 455000, 9),
      vuelo('v-mex-2', 'LATAM', '2027-02-11T08:30:00-03:00', '2027-02-19T16:45:00-03:00', 610, 1, 398000, 2),
    ],
    hoteles: [
      hotel('h-mex-1', 'Condesa Boutique', 4, 115000, '2026-12-20', '2027-03-31', 4, ['Terraza', 'Desayuno', 'Wifi']),
      hotel('h-mex-2', 'Hostal Centro Histórico', 2, 34000, '2026-12-01', '2027-03-31', 11, ['Wifi']),
    ],
  },
  'rio-de-janeiro': {
    vuelos: [
      vuelo('v-rio-1', 'LATAM', '2026-12-28T11:10:00-03:00', '2027-01-04T18:55:00-03:00', 245, 0, 376000, 0),
      vuelo('v-rio-2', 'GOL', '2027-02-05T07:45:00-03:00', '2027-02-12T15:20:00-03:00', 330, 1, 329000, 5),
    ],
    hoteles: [
      hotel('h-rio-1', 'Ipanema Mar Hotel', 4, 142000, '2026-12-15', '2027-03-15', 3, ['Vista al mar', 'Desayuno', 'Piscina']),
      hotel('h-rio-2', 'Pousada Santa Teresa', 3, 72000, '2026-12-01', '2027-03-31', 0, ['Wifi', 'Jardín']),
      hotel('h-rio-3', 'Copacabana Palace Lite', 5, 289000, '2027-01-10', '2027-03-31', 2, ['Spa', 'Piscina', 'Restaurante']),
    ],
  },
  madrid: {
    vuelos: [
      vuelo('v-mad-1', 'Iberia', '2027-01-10T13:35:00-03:00', '2027-01-24T12:05:00-03:00', 790, 0, 1089000, 8),
      vuelo('v-mad-2', 'LATAM', '2027-02-16T15:00:00-03:00', '2027-03-02T10:40:00-03:00', 800, 0, 1150000, 1),
    ],
    hoteles: [
      hotel('h-mad-1', 'Hotel Gran Vía Centro', 4, 135000, '2027-01-01', '2027-03-31', 6, ['Desayuno', 'Wifi', 'Bar']),
      hotel('h-mad-2', 'Hostal La Latina', 2, 58000, '2027-01-01', '2027-02-28', 4, ['Wifi']),
    ],
  },
  tokio: {
    vuelos: [
      vuelo('v-tyo-1', 'Qatar Airways', '2027-03-18T01:25:00-03:00', '2027-04-02T22:10:00-03:00', 1820, 1, 1450000, 3),
      vuelo('v-tyo-2', 'Air Canada', '2027-03-25T10:40:00-03:00', '2027-04-09T19:30:00-03:00', 1690, 1, 1620000, 0),
    ],
    hoteles: [
      hotel('h-tyo-1', 'Shinjuku Granbell', 4, 158000, '2027-03-15', '2027-04-15', 5, ['Wifi', 'Bar', 'Lavandería']),
      hotel('h-tyo-2', 'Asakusa Ryokan Sadachiyo', 3, 121000, '2027-03-01', '2027-04-30', 2, ['Onsen', 'Desayuno japonés']),
      hotel('h-tyo-3', 'Cápsulas Nine Hours', 1, 42000, '2027-03-01', '2027-04-30', 14, ['Wifi', 'Duchas']),
    ],
  },
  // Temporada alta del festival Tapati: todo agotado, para mostrar el estado vacío de "Solo disponibles"
  'isla-de-pascua': {
    vuelos: [
      vuelo('v-ipc-1', 'LATAM', '2027-01-29T09:00:00-03:00', '2027-02-06T16:50:00-05:00', 330, 0, 690000, 0),
      vuelo('v-ipc-2', 'LATAM', '2027-02-05T09:00:00-03:00', '2027-02-12T16:50:00-05:00', 330, 0, 745000, 0),
    ],
    hoteles: [
      hotel('h-ipc-1', 'Hare Nui Lodge', 4, 210000, '2027-01-25', '2027-02-20', 0, ['Desayuno', 'Traslado']),
      hotel('h-ipc-2', 'Cabañas Anakena', 2, 75000, '2027-01-15', '2027-02-28', 0, ['Cocina', 'Terraza']),
    ],
  },
}
