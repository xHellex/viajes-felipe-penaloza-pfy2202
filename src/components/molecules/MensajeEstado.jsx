import { MENSAJES, permiteReintento } from '../../services/mensajes.js'
import Boton from '../atoms/Boton.jsx'
import Icono from '../atoms/Icono.jsx'

/**
 * Mensaje de una sección cuando la petición falló o no hay datos que mostrar.
 * - con error: título y sugerencia según el tipo; Reintentar solo si la tabla lo permite.
 * - sin error (vacío): título, detalle y una acción sugerida.
 * children: alternativas (enlaces) junto a Reintentar, o la acción del estado vacío.
 */
export default function MensajeEstado({ error, onReintentar, titulo, detalle, children }) {
  if (error) {
    const textos = MENSAJES[error.tipo] ?? MENSAJES.respuesta
    return (
      <div role="alert" className="rounded-2xl border-l-4 border-red-600 bg-red-50 p-5">
        <p className="flex items-center gap-2 text-lg font-bold text-red-900">
          <Icono nombre="alerta" /> {textos.titulo}
        </p>
        <p className="mt-1 break-words text-red-900">{error.message}</p>
        <p className="mt-1 text-sm text-slate-700">{textos.sugerencia}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          {onReintentar && permiteReintento(error) && <Boton onClick={onReintentar}>Reintentar</Boton>}
          {children}
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center">
      <p className="text-lg font-bold text-slate-800">{titulo}</p>
      {detalle && <p className="mt-1 text-slate-600">{detalle}</p>}
      {children && <div className="mt-4 flex flex-wrap justify-center gap-3">{children}</div>}
    </div>
  )
}
