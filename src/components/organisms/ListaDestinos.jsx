import Esqueleto from '../atoms/Esqueleto.jsx'
import TarjetaDestino from '../molecules/TarjetaDestino.jsx'

const grilla = 'grid gap-5 sm:grid-cols-2 lg:grid-cols-3'

/** Grilla de destinos (solo props: no sabe de dónde vienen los datos). */
export default function ListaDestinos({ destinos, busqueda }) {
  return (
    <ul className={grilla}>
      {destinos.map((destino) => (
        <li key={destino.id} className="flex"><TarjetaDestino destino={destino} busqueda={busqueda} /></li>
      ))}
    </ul>
  )
}

export function EsqueletoDestinos() {
  return (
    <div className={grilla}>
      {Array.from({ length: 6 }, (_, i) => <Esqueleto key={i} className="h-80 w-full rounded-2xl" />)}
    </div>
  )
}
