/** Bloque gris que reserva el espacio del contenido mientras carga. */
export default function Esqueleto({ className = 'h-4 w-full' }) {
  return <span aria-hidden="true" className={`block rounded-md bg-slate-200 motion-safe:animate-pulse ${className}`} />
}
