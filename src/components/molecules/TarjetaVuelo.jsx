import { formatearDuracion } from '../../utils/formato.js'
import Boton from '../atoms/Boton.jsx'
import Disponibilidad from '../atoms/Disponibilidad.jsx'
import FechaTexto from '../atoms/FechaTexto.jsx'
import Icono from '../atoms/Icono.jsx'
import Precio from '../atoms/Precio.jsx'

function textoBoton(elegido, agotado) {
  if (elegido) return 'Vuelo elegido'
  return agotado ? 'Sin asientos' : 'Elegir este vuelo'
}

/** Vuelo ida y vuelta: aerolínea, fechas, duración, escalas, precio y disponibilidad. */
export default function TarjetaVuelo({ vuelo, nombreDestino, elegido = false, onElegir }) {
  const { aerolinea, origen, salida, regreso, duracionMinutos, escalas, precio, asientosDisponibles } = vuelo
  const agotado = asientosDisponibles === 0

  return (
    <article className={`flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ${elegido ? 'ring-2 ring-mar-500' : 'ring-slate-200'}`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="flex items-center gap-2 font-sans text-lg font-bold text-slate-900">
          <Icono nombre="avion" className="size-5 text-mar-700" /> {aerolinea}
        </h3>
        <Disponibilidad cantidad={asientosDisponibles} singular="asiento" plural="asientos" />
      </div>
      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
        <dt className="text-slate-500">Ida</dt>
        <dd>{origen} → {nombreDestino} · <FechaTexto iso={salida} conHora /></dd>
        <dt className="text-slate-500">Vuelta</dt>
        <dd><FechaTexto iso={regreso} conHora /></dd>
        <dt className="text-slate-500">Duración</dt>
        <dd>{formatearDuracion(duracionMinutos)} · {escalas === 0 ? 'Directo' : `${escalas} escala${escalas > 1 ? 's' : ''}`}</dd>
      </dl>
      <div className="mt-auto flex flex-wrap items-end justify-between gap-3 border-t border-slate-100 pt-3">
        <Precio valor={precio} sufijo="por persona, ida y vuelta" />
        {onElegir && (
          <Boton variante={elegido ? 'secundario' : 'primario'} disabled={agotado || elegido} onClick={() => onElegir(vuelo)}>
            {elegido && <Icono nombre="check" />} {textoBoton(elegido, agotado)}
          </Boton>
        )}
      </div>
    </article>
  )
}
