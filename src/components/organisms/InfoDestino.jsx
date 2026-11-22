import Esqueleto from '../atoms/Esqueleto.jsx'

/** Información del destino (REST): descripción, actividades y datos prácticos. */
export default function InfoDestino({ destino }) {
  const { descripcion, actividades, mejorEpoca, idioma, moneda } = destino

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <div>
        <p className="text-lg text-slate-700">{descripcion}</p>
        <h2 className="mt-6 mb-3 text-xl font-bold">Actividades populares</h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {actividades.map(({ nombre, descripcion: detalle }) => (
            <li key={nombre} className="rounded-xl bg-white p-3 ring-1 ring-slate-200">
              <p className="font-semibold text-slate-900">{nombre}</p>
              <p className="text-sm text-slate-600">{detalle}</p>
            </li>
          ))}
        </ul>
      </div>
      <dl className="grid content-start gap-3 rounded-2xl bg-white p-4 text-sm ring-1 ring-slate-200">
        <div><dt className="text-slate-500">Mejor época</dt><dd className="font-semibold">{mejorEpoca}</dd></div>
        <div><dt className="text-slate-500">Idioma</dt><dd className="font-semibold">{idioma}</dd></div>
        <div><dt className="text-slate-500">Moneda</dt><dd className="font-semibold">{moneda}</dd></div>
      </dl>
    </div>
  )
}

export function EsqueletoInfo() {
  return (
    <div className="grid gap-3">
      <Esqueleto className="h-5 w-full" />
      <Esqueleto className="h-5 w-4/5" />
      <Esqueleto className="h-24 w-full rounded-xl" />
    </div>
  )
}
