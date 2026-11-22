import { Link, NavLink } from 'react-router'
import Icono from '../atoms/Icono.jsx'

const enlaces = [
  { ruta: '/', texto: 'Inicio', end: true },
  { ruta: '/destinos', texto: 'Destinos' },
  { ruta: '/mi-viaje', texto: 'Mi viaje' },
]

const clase = ({ isActive }) =>
  `inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-sm font-semibold no-underline transition-colors sm:px-4 ${
    isActive ? 'bg-mar-700 text-white shadow-sm' : 'text-slate-700 hover:bg-mar-50 hover:text-mar-900'
  }`

/** Marca y menú principal. elementosPlan: cuántas opciones hay en "Mi viaje" (0 a 2). */
export default function CabeceraSitio({ elementosPlan = 0 }) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-2">
        <Link to="/" className="flex items-center gap-2 no-underline">
          <span className="grid size-10 place-items-center rounded-xl bg-mar-700 text-sol-400">
            <Icono nombre="avion" className="size-6" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-titulo text-lg font-bold text-slate-900">Rumbo</span>
            <span className="text-xs text-slate-500">Agencia de viajes</span>
          </span>
        </Link>
        <nav aria-label="Menú principal">
          <ul className="flex items-center gap-1">
            {enlaces.map(({ ruta, texto, end }) => (
              <li key={ruta}>
                <NavLink to={ruta} end={end} className={clase}>
                  {texto}
                  {ruta === '/mi-viaje' && elementosPlan > 0 && (
                    <span className="rounded-full bg-sol-500 px-2 text-xs text-slate-900">
                      {elementosPlan}<span className="sr-only"> elegidos</span>
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
