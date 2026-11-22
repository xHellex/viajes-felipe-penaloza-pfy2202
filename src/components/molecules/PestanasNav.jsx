import { NavLink } from 'react-router'
import Icono from '../atoms/Icono.jsx'

const clase = ({ isActive }) =>
  `flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl px-4 font-semibold no-underline transition-colors sm:flex-none ${
    isActive ? 'bg-mar-700 text-white shadow-sm' : 'text-slate-700 hover:bg-mar-50'
  }`

/**
 * Pestañas como rutas hijas (NavLink marca la activa con aria-current="page").
 * pestanas: [{ ruta, texto, icono }]; busqueda se conserva al cambiar de pestaña.
 */
export default function PestanasNav({ etiqueta, pestanas, busqueda = '' }) {
  return (
    <nav aria-label={etiqueta}>
      <ul className="flex gap-2 rounded-2xl bg-white p-1.5 shadow-sm ring-1 ring-slate-200 sm:inline-flex">
        {pestanas.map(({ ruta, texto, icono }) => (
          <li key={ruta} className="flex flex-1 sm:flex-none">
            <NavLink to={{ pathname: ruta, search: busqueda }} className={clase}>
              <Icono nombre={icono} /> {texto}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
