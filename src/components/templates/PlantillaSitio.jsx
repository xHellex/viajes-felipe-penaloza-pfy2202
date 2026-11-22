import { Outlet, useSearchParams } from 'react-router'
import CabeceraSitio from '../organisms/CabeceraSitio.jsx'
import PieSitio from '../organisms/PieSitio.jsx'

/**
 * Estructura común de todas las rutas: salto al contenido, cabecera, <Outlet /> y pie.
 * elementosPlan llega desde App (el estado del plan no se lee en la presentación).
 */
export default function PlantillaSitio({ elementosPlan }) {
  const [parametros] = useSearchParams()
  const simular = parametros.get('simular')

  return (
    <div className="flex min-h-dvh flex-col">
      <a href="#contenido" className="sr-only z-50 rounded-lg bg-white px-4 py-2 focus:not-sr-only focus:fixed focus:top-2 focus:left-2">
        Saltar al contenido
      </a>
      <CabeceraSitio elementosPlan={elementosPlan} />
      {simular && (
        <p className="bg-sol-400 px-4 py-2 text-center text-sm font-semibold text-slate-900">
          Modo demostración: se está simulando el error «{simular}».
        </p>
      )}
      <main id="contenido" className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <Outlet />
      </main>
      <PieSitio />
    </div>
  )
}
