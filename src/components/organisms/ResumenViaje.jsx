import { Link } from 'react-router'
import { formatearCLP } from '../../utils/formato.js'
import Boton from '../atoms/Boton.jsx'
import FechaTexto from '../atoms/FechaTexto.jsx'
import Icono from '../atoms/Icono.jsx'
import Precio from '../atoms/Precio.jsx'

function Bloque({ icono, titulo, children, accion }) {
  return (
    <section aria-label={titulo} className="flex flex-col gap-2 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <h2 className="flex items-center gap-2 font-sans text-lg font-bold"><Icono nombre={icono} className="size-5 text-mar-700" /> {titulo}</h2>
      {children}
      <div className="mt-2 flex flex-wrap gap-2">{accion}</div>
    </section>
  )
}

/**
 * Resumen del plan (solo props): vuelo, hotel, noches, total y avisos.
 * onQuitar(tipo) y onVaciar los resuelve la página.
 */
export default function ResumenViaje({ plan, noches, total, hotelCubre, onQuitar, onVaciar }) {
  const { destino, vuelo, hotel } = plan
  const rutaDestino = `/destinos/${destino.id}`

  return (
    <div className="grid gap-5 lg:grid-cols-[2fr_1fr]">
      <div className="grid gap-4">
        <Bloque
          icono="avion"
          titulo="Vuelo"
          accion={vuelo
            ? <><Link to={`${rutaDestino}/vuelos`} className="btn btn-secundario">Cambiar vuelo</Link><Boton variante="secundario" onClick={() => onQuitar('vuelo')}>Quitar</Boton></>
            : <Link to={`${rutaDestino}/vuelos`} className="btn btn-primario">Elegir vuelo</Link>}
        >
          {vuelo ? (
            <>
              <p className="font-semibold">{vuelo.aerolinea} · {vuelo.origen} → {destino.nombre}</p>
              <p className="text-sm text-slate-600">Ida <FechaTexto iso={vuelo.salida} conHora /> · Vuelta <FechaTexto iso={vuelo.regreso} conHora /></p>
              <Precio valor={vuelo.precio} sufijo="ida y vuelta" className="text-lg" />
            </>
          ) : <p className="text-slate-600">Aún no eliges vuelo.</p>}
        </Bloque>

        <Bloque
          icono="cama"
          titulo="Hotel"
          accion={hotel
            ? <><Link to={`${rutaDestino}/hoteles`} className="btn btn-secundario">Cambiar hotel</Link><Boton variante="secundario" onClick={() => onQuitar('hotel')}>Quitar</Boton></>
            : <Link to={`${rutaDestino}/hoteles`} className="btn btn-primario">Elegir hotel</Link>}
        >
          {hotel ? (
            <>
              <p className="font-semibold">{hotel.nombre} · {hotel.estrellas} estrellas</p>
              <p className="text-sm text-slate-600">Disponible del <FechaTexto iso={hotel.disponibleDesde} /> al <FechaTexto iso={hotel.disponibleHasta} /></p>
              <Precio valor={hotel.precioNoche} sufijo="por noche" className="text-lg" />
            </>
          ) : <p className="text-slate-600">Aún no eliges hotel.</p>}
        </Bloque>
      </div>

      <aside aria-label="Total del viaje" className="flex flex-col gap-3 self-start rounded-2xl bg-mar-900 p-5 text-white">
        <h2 className="text-xl font-bold">{destino.nombre}, {destino.pais}</h2>
        {vuelo && <p>{noches} {noches === 1 ? 'noche' : 'noches'}</p>}
        <dl className="grid grid-cols-[1fr_auto] gap-y-1 text-sm">
          {vuelo && <><dt>Vuelo</dt><dd className="text-right">{formatearCLP(vuelo.precio)}</dd></>}
          {vuelo && hotel && <><dt>Hotel ({noches} × {formatearCLP(hotel.precioNoche)})</dt><dd className="text-right">{formatearCLP(hotel.precioNoche * noches)}</dd></>}
        </dl>
        <p className="border-t border-white/20 pt-3">
          <span className="block text-sm text-mar-100">Total por persona</span>
          <span className="text-3xl font-bold" data-testid="total">{formatearCLP(total)}</span>
        </p>
        {hotel && !vuelo && <p className="text-sm text-sol-400">Elige un vuelo para calcular las noches de hotel.</p>}
        {!hotelCubre && (
          <p role="alert" className="rounded-lg bg-sol-400 p-2 text-sm font-semibold text-slate-900">
            El hotel no está disponible en todas las fechas de tu vuelo. Revisa otro hotel o vuelo.
          </p>
        )}
        <Boton variante="peligro" onClick={onVaciar}>Vaciar plan</Boton>
      </aside>
    </div>
  )
}
