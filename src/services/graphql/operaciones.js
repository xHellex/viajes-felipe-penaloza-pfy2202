import { gql } from '@apollo/client'

/** Vuelos y hoteles de un destino en una sola petición, con los campos justos que usa la interfaz. */
export const OPCIONES_VIAJE = gql`
  query OpcionesViaje($destinoId: ID!, $soloDisponibles: Boolean) {
    opcionesViaje(destinoId: $destinoId, soloDisponibles: $soloDisponibles) {
      destino {
        id
        nombre
        pais
      }
      vuelos {
        id
        destinoId
        aerolinea
        origen
        salida
        regreso
        duracionMinutos
        escalas
        precio
        asientosDisponibles
      }
      hoteles {
        id
        nombre
        destinoId
        estrellas
        precioNoche
        disponibleDesde
        disponibleHasta
        habitacionesDisponibles
        servicios
      }
    }
  }
`
