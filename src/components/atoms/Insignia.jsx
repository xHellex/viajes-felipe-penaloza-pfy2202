const tonos = {
  neutro: 'bg-slate-100 text-slate-700',
  mar: 'bg-mar-50 text-mar-900',
  exito: 'bg-emerald-50 text-emerald-800',
  alerta: 'bg-amber-50 text-amber-900',
  agotado: 'bg-red-50 text-red-800',
}

/** Etiqueta corta (actividad, servicio, disponibilidad). */
export default function Insignia({ tono = 'neutro', children }) {
  return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${tonos[tono]}`}>{children}</span>
}
