import { formatearCLP } from '../../utils/formato.js'

/** Precio en CLP con un sufijo opcional ("por noche", "ida y vuelta"). */
export default function Precio({ valor, sufijo, className = 'text-xl' }) {
  return (
    <p className="leading-tight">
      <span className={`font-bold text-mar-900 ${className}`}>{formatearCLP(valor)}</span>
      {sufijo && <span className="block text-xs text-slate-500">{sufijo}</span>}
    </p>
  )
}
