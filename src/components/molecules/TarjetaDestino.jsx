import { Link } from 'react-router'
import Insignia from '../atoms/Insignia.jsx'
import Precio from '../atoms/Precio.jsx'

/**
 * Destino del listado: país, actividades populares y precio desde. Toda la tarjeta es un enlace.
 * busqueda: query string que se conserva al entrar (modo demostración ?simular).
 */
export default function TarjetaDestino({ destino, busqueda = '' }) {
  const { id, nombre, pais, resumen, actividades, precioDesde, tono } = destino

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition-shadow hover:shadow-md">
      <div className="flex h-28 items-end p-4" style={{ backgroundImage: `linear-gradient(135deg, ${tono[0]}, ${tono[1]})` }}>
        <p className="text-sm font-semibold uppercase tracking-wide text-white">{pais}</p>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <h2 className="text-xl font-bold text-slate-900">
          {/* after:inset-0 extiende el área del enlace a toda la tarjeta */}
          <Link to={{ pathname: `/destinos/${id}`, search: busqueda }} className="no-underline after:absolute after:inset-0 group-hover:text-mar-700">
            {nombre}
          </Link>
        </h2>
        <p className="text-sm text-slate-600">{resumen}</p>
        <ul aria-label={`Actividades populares en ${nombre}`} className="flex flex-wrap gap-1.5">
          {actividades.map((actividad) => (
            <li key={actividad}><Insignia tono="mar">{actividad}</Insignia></li>
          ))}
        </ul>
        <div className="mt-auto pt-2">
          <Precio valor={precioDesde} sufijo="desde, vuelo + 1 noche" className="text-lg" />
        </div>
      </div>
    </article>
  )
}
