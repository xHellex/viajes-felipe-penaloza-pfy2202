import { useState } from 'react'
import { Link, useOutletContext } from 'react-router'
import Boton from '../components/atoms/Boton.jsx'
import DialogoConfirmacion from '../components/molecules/DialogoConfirmacion.jsx'
import { EsqueletoOpciones, ListaHoteles, ListaVuelos } from '../components/organisms/ListaOpciones.jsx'
import SeccionConsulta from '../components/organisms/SeccionConsulta.jsx'
import { cambiaDestino, useAccionesPlan, usePlanViaje } from '../context/planViaje.js'
import { useOpcionesViaje } from '../hooks/useOpcionesViaje.js'

/**
 * Contenido de las pestañas Vuelos y Hoteles (rutas hijas del destino). Las dos usan la misma
 * consulta GraphQL con las mismas variables: al cambiar de pestaña responde la caché de Apollo.
 */
function PaginaOpciones({ tipo }) {
  const { destinoId, soloDisponibles, setSoloDisponibles, simular } = useOutletContext()
  const { opciones, ...consulta } = useOpcionesViaje(destinoId, { soloDisponibles, simular })
  const plan = usePlanViaje()
  const { elegir } = useAccionesPlan()
  // Selección que espera confirmación porque reemplaza opciones de otro destino
  const [pendiente, setPendiente] = useState(null)

  const esVuelos = tipo === 'vuelos'
  const tipoPlan = esVuelos ? 'vuelo' : 'hotel'
  const lista = (esVuelos ? opciones?.vuelos : opciones?.hoteles) ?? []
  const nombreDestino = opciones?.destino.nombre ?? ''
  const idElegido = plan.destino?.id === destinoId ? plan[tipoPlan]?.id : undefined

  function alElegir(opcion) {
    const seleccion = { destino: opciones.destino, tipo: tipoPlan, opcion }
    if (cambiaDestino(plan, destinoId)) setPendiente(seleccion)
    else elegir(seleccion)
  }

  const mensajeVacio = soloDisponibles
    ? { titulo: `No quedan ${esVuelos ? 'vuelos con asientos' : 'hoteles con habitaciones'} para ${nombreDestino}`, detalle: 'Es temporada alta: todo está reservado.' }
    : { titulo: `Aún no hay ${tipo} para ${nombreDestino}`, detalle: 'Vuelve a revisar en unos días.' }

  return (
    <>
      <SeccionConsulta
        titulo={esVuelos ? 'Vuelos disponibles' : 'Hoteles disponibles'}
        consulta={consulta}
        hayDatos={opciones !== null}
        vacio={lista.length === 0}
        mensajeVacio={mensajeVacio}
        accionVacio={soloDisponibles
          ? <Boton variante="secundario" onClick={() => setSoloDisponibles(false)}>Ver también los agotados</Boton>
          : <Link to="/destinos" className="btn btn-secundario">Ver otros destinos</Link>}
        alternativas={<Link to="/destinos" className="btn btn-secundario">Ver otros destinos</Link>}
        esqueleto={<EsqueletoOpciones />}
        textoCargando={`Cargando ${tipo}…`}
      >
        {esVuelos
          ? <ListaVuelos vuelos={lista} nombreDestino={nombreDestino} idElegido={idElegido} onElegir={alElegir} />
          : <ListaHoteles hoteles={lista} idElegido={idElegido} onElegir={alElegir} />}
      </SeccionConsulta>

      <DialogoConfirmacion
        abierto={pendiente !== null}
        titulo={`¿Cambiar tu viaje a ${nombreDestino}?`}
        mensaje={`Tu plan tiene opciones de ${plan.destino?.nombre}. Si continúas, se quitarán para que el vuelo y el hotel sean del mismo destino.`}
        textoConfirmar={`Cambiar a ${nombreDestino}`}
        onConfirmar={() => {
          elegir(pendiente)
          setPendiente(null)
        }}
        onCancelar={() => setPendiente(null)}
      />
    </>
  )
}

export function PaginaVuelos() {
  return <PaginaOpciones tipo="vuelos" />
}

export function PaginaHoteles() {
  return <PaginaOpciones tipo="hoteles" />
}
