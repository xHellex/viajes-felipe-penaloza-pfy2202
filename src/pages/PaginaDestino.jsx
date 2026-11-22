import { useState } from 'react'
import { Link, Outlet, useParams, useSearchParams } from 'react-router'
import Esqueleto from '../components/atoms/Esqueleto.jsx'
import PasosViaje from '../components/molecules/PasosViaje.jsx'
import PestanasNav from '../components/molecules/PestanasNav.jsx'
import InfoDestino, { EsqueletoInfo } from '../components/organisms/InfoDestino.jsx'
import SeccionConsulta from '../components/organisms/SeccionConsulta.jsx'
import PlantillaDestino from '../components/templates/PlantillaDestino.jsx'
import { usePlanViaje } from '../context/planViaje.js'
import { useDestino } from '../hooks/useDestino.js'
import { useTituloPagina } from '../hooks/useTituloPagina.js'

const PESTANAS = [
  { ruta: 'vuelos', texto: 'Vuelos', icono: 'avion' },
  { ruta: 'hoteles', texto: 'Hoteles', icono: 'cama' },
]

/**
 * Detalle de un destino. La información viene de REST (useDestino) y las pestañas Vuelos y Hoteles
 * (rutas hijas) consultan GraphQL con el mismo destinoId: cada sección tiene sus propios estados.
 */
export default function PaginaDestino() {
  const { destinoId } = useParams()
  const [parametros] = useSearchParams()
  const simular = parametros.get('simular') ?? undefined
  // Compartido por las dos pestañas: cambiarlo repite la consulta GraphQL con otra variable
  const [soloDisponibles, setSoloDisponibles] = useState(false)

  const consulta = useDestino(destinoId, { simular })
  const destino = consulta.datos
  const noExiste = consulta.error?.tipo === 'no-encontrado'
  const plan = usePlanViaje()
  const enPlan = plan.destino?.id === destinoId

  let titulo = 'Cargando destino'
  if (destino) titulo = destino.nombre
  else if (noExiste) titulo = 'Destino no encontrado'
  else if (consulta.error) titulo = 'Destino'
  const refTitulo = useTituloPagina(titulo, destinoId)

  const encabezado = (
    <>
      <Link to={{ pathname: '/destinos', search: simular ? `?simular=${simular}` : '' }} className="self-start text-sm font-semibold text-mar-700">
        ← Todos los destinos
      </Link>
      <div>
        {destino && <p className="font-semibold uppercase tracking-wide text-mar-700">{destino.pais}</p>}
        {/* El h1 nunca muestra el id de la URL: mientras carga es un esqueleto con texto para lectores */}
        <h1 ref={refTitulo} tabIndex={-1} className="text-3xl font-bold sm:text-4xl">
          {consulta.cargando ? (
            <>
              <span className="sr-only">Cargando destino</span>
              <Esqueleto className="h-10 w-64 max-w-full" />
            </>
          ) : titulo}
        </h1>
      </div>
      {destino && (
        <PasosViaje
          pasos={[
            { texto: 'Destino', hecho: true },
            { texto: 'Vuelo', hecho: enPlan && plan.vuelo !== null },
            { texto: 'Hotel', hecho: enPlan && plan.hotel !== null },
            { texto: 'Resumen', hecho: false },
          ]}
        />
      )}
      {enPlan && (
        <Link to="/mi-viaje" className="btn btn-acento self-start">Ver resumen de mi viaje</Link>
      )}
    </>
  )

  const informacion = (
    <SeccionConsulta
      titulo="Información del destino"
      consulta={consulta}
      hayDatos={destino !== null}
      vacio={false}
      esqueleto={<EsqueletoInfo />}
      textoCargando="Cargando información del destino…"
      alternativas={<Link to="/destinos" className="btn btn-secundario">Ver otros destinos</Link>}
    >
      <InfoDestino destino={destino} />
    </SeccionConsulta>
  )

  // Si el destino no existe no hay vuelos ni hoteles que mostrar
  if (noExiste) return <PlantillaDestino encabezado={encabezado} informacion={informacion} />

  return (
    <PlantillaDestino
      encabezado={encabezado}
      informacion={informacion}
      pestanas={<PestanasNav etiqueta="Opciones de viaje" pestanas={PESTANAS} busqueda={simular ? `?simular=${simular}` : ''} />}
      controles={
        <label className="inline-flex min-h-11 cursor-pointer items-center gap-2 text-sm font-semibold text-slate-700">
          <input type="checkbox" checked={soloDisponibles} onChange={(e) => setSoloDisponibles(e.target.checked)} className="size-5 accent-mar-700" />
          {' '}Solo con disponibilidad
        </label>
      }
    >
      <Outlet context={{ destinoId, soloDisponibles, setSoloDisponibles, simular }} />
    </PlantillaDestino>
  )
}
