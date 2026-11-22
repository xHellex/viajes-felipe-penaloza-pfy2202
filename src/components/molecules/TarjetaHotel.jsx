import Boton from '../atoms/Boton.jsx'
import Disponibilidad from '../atoms/Disponibilidad.jsx'
import FechaTexto from '../atoms/FechaTexto.jsx'
import Icono from '../atoms/Icono.jsx'
import Insignia from '../atoms/Insignia.jsx'
import Precio from '../atoms/Precio.jsx'

function textoBoton(elegido, agotado) {
  if (elegido) return 'Hotel elegido'
  return agotado ? 'Sin habitaciones' : 'Elegir este hotel'
}

/** Hotel: estrellas, precio por noche, fechas disponibles, habitaciones y servicios. */
export default function TarjetaHotel({ hotel, elegido = false, onElegir }) {
  const { nombre, estrellas, precioNoche, disponibleDesde, disponibleHasta, habitacionesDisponibles, servicios } = hotel
  const agotado = habitacionesDisponibles === 0

  return (
    <article className={`flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ${elegido ? 'ring-2 ring-mar-500' : 'ring-slate-200'}`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="flex items-center gap-2 font-sans text-lg font-bold text-slate-900">
          <Icono nombre="cama" className="size-5 shrink-0 text-mar-700" /> {nombre}
        </h3>
        <Disponibilidad cantidad={habitacionesDisponibles} singular="habitación" plural="habitaciones" />
      </div>
      <p className="text-sm text-sol-500">
        <span className="sr-only">{estrellas} de 5 estrellas</span>
        <span aria-hidden="true">{'★'.repeat(estrellas)}<span className="text-slate-300">{'★'.repeat(5 - estrellas)}</span></span>
      </p>
      <p className="text-sm">
        <span className="text-slate-500">Disponible: </span>
        <FechaTexto iso={disponibleDesde} /> al <FechaTexto iso={disponibleHasta} />
      </p>
      <ul aria-label="Servicios" className="flex flex-wrap gap-1.5">
        {servicios.map((servicio) => (
          <li key={servicio}><Insignia>{servicio}</Insignia></li>
        ))}
      </ul>
      <div className="mt-auto flex flex-wrap items-end justify-between gap-3 border-t border-slate-100 pt-3">
        <Precio valor={precioNoche} sufijo="por noche" />
        {onElegir && (
          <Boton variante={elegido ? 'secundario' : 'primario'} disabled={agotado || elegido} onClick={() => onElegir(hotel)}>
            {elegido && <Icono nombre="check" />} {textoBoton(elegido, agotado)}
          </Boton>
        )}
      </div>
    </article>
  )
}
