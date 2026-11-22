import Esqueleto from '../atoms/Esqueleto.jsx'
import TarjetaHotel from '../molecules/TarjetaHotel.jsx'
import TarjetaVuelo from '../molecules/TarjetaVuelo.jsx'

const grilla = 'grid gap-4 md:grid-cols-2 lg:grid-cols-3'

/** Vuelos de un destino. idElegido marca el que está en el plan; onElegir lo agrega. */
export function ListaVuelos({ vuelos, nombreDestino, idElegido, onElegir }) {
  return (
    <ul className={grilla}>
      {vuelos.map((vuelo) => (
        <li key={vuelo.id} className="grid">
          <TarjetaVuelo vuelo={vuelo} nombreDestino={nombreDestino} elegido={vuelo.id === idElegido} onElegir={onElegir} />
        </li>
      ))}
    </ul>
  )
}

/** Hoteles de un destino. idElegido marca el que está en el plan; onElegir lo agrega. */
export function ListaHoteles({ hoteles, idElegido, onElegir }) {
  return (
    <ul className={grilla}>
      {hoteles.map((hotel) => (
        <li key={hotel.id} className="grid">
          <TarjetaHotel hotel={hotel} elegido={hotel.id === idElegido} onElegir={onElegir} />
        </li>
      ))}
    </ul>
  )
}

export function EsqueletoOpciones() {
  return (
    <div className={grilla}>
      {Array.from({ length: 3 }, (_, i) => <Esqueleto key={i} className="h-60 w-full rounded-2xl" />)}
    </div>
  )
}
