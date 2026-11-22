import Icono from '../atoms/Icono.jsx'

/**
 * Avance de la planificación: Destino → Vuelo → Hotel → Resumen.
 * pasos: [{ texto, hecho }]. El primer paso sin hacer es el actual (aria-current="step").
 */
export default function PasosViaje({ pasos }) {
  const actual = pasos.findIndex((paso) => !paso.hecho)

  return (
    <ol aria-label="Pasos de tu viaje" className="flex flex-wrap gap-2 text-sm">
      {pasos.map(({ texto, hecho }, i) => (
        <li
          key={texto}
          aria-current={i === actual ? 'step' : undefined}
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-semibold ${
            hecho ? 'bg-mar-700 text-white' : i === actual ? 'bg-sol-400 text-slate-900' : 'bg-slate-100 text-slate-600'
          }`}
        >
          {hecho ? <Icono nombre="check" className="size-4" /> : <span aria-hidden="true">{i + 1}.</span>}
          {texto}
          {hecho && <span className="sr-only"> (listo)</span>}
        </li>
      ))}
    </ol>
  )
}
