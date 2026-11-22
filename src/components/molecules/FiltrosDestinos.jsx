import { useId } from 'react'

/**
 * Filtros del listado. Solo presentación: el estado vive en la página
 * (continente en la URL, texto en useState).
 */
export default function FiltrosDestinos({ continentes, continente, onContinente, texto, onTexto }) {
  const idContinente = useId()
  const idTexto = useId()

  return (
    <form role="search" onSubmit={(e) => e.preventDefault()} className="grid gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:grid-cols-2">
      <div>
        <label htmlFor={idContinente} className="mb-1 block text-sm font-semibold text-slate-700">Continente</label>
        <select id={idContinente} value={continente} onChange={(e) => onContinente(e.target.value)} className="control">
          <option value="">Todos</option>
          {continentes.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor={idTexto} className="mb-1 block text-sm font-semibold text-slate-700">Buscar destino o país</label>
        <input id={idTexto} type="search" value={texto} onChange={(e) => onTexto(e.target.value)} placeholder="Ej.: Perú, Tokio" className="control" />
      </div>
    </form>
  )
}
