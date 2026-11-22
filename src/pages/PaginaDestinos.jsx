import { useState } from 'react'
import { useSearchParams } from 'react-router'
import Boton from '../components/atoms/Boton.jsx'
import FiltrosDestinos from '../components/molecules/FiltrosDestinos.jsx'
import ListaDestinos, { EsqueletoDestinos } from '../components/organisms/ListaDestinos.jsx'
import SeccionConsulta from '../components/organisms/SeccionConsulta.jsx'
import { useDestinos } from '../hooks/useDestinos.js'
import { useTituloPagina } from '../hooks/useTituloPagina.js'

// África no tiene destinos en el catálogo: muestra el estado vacío de la API
const CONTINENTES = ['América', 'Europa', 'Asia', 'Oceanía', 'África']

// Compara sin tildes ni mayúsculas ("peru" encuentra "Perú")
const normalizar = (texto) => texto.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()

export default function PaginaDestinos() {
  const refTitulo = useTituloPagina('Destinos')
  // El continente va en la URL (se puede compartir y funciona con atrás/adelante); se filtra en el servidor
  const [parametros, setParametros] = useSearchParams()
  const continente = parametros.get('continente') ?? ''
  const simular = parametros.get('simular') ?? undefined
  // El texto se filtra en el cliente sobre la lista ya cargada
  const [texto, setTexto] = useState('')

  const consulta = useDestinos({ continente: continente || undefined, simular })
  const destinos = consulta.datos ?? []
  const buscado = normalizar(texto.trim())
  const visibles = destinos.filter((d) => normalizar(`${d.nombre} ${d.pais}`).includes(buscado))

  function cambiarContinente(valor) {
    setParametros((previos) => {
      if (valor) previos.set('continente', valor)
      else previos.delete('continente')
      return previos
    })
  }

  const vacioServidor = destinos.length === 0
  const mensajeVacio = vacioServidor
    ? { titulo: `Aún no tenemos destinos en ${continente || 'el catálogo'}`, detalle: 'Prueba con otro continente.' }
    : { titulo: `Ningún destino coincide con «${texto.trim()}»`, detalle: 'Revisa la búsqueda o borra el texto.' }

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 ref={refTitulo} tabIndex={-1} className="text-3xl font-bold sm:text-4xl">Destinos</h1>
        <p className="mt-2 text-slate-600">Elige un destino para ver sus vuelos y hoteles disponibles.</p>
      </header>

      <FiltrosDestinos continentes={CONTINENTES} continente={continente} onContinente={cambiarContinente} texto={texto} onTexto={setTexto} />

      <SeccionConsulta
        titulo="Listado de destinos"
        consulta={consulta}
        hayDatos={consulta.datos !== null}
        vacio={visibles.length === 0}
        mensajeVacio={mensajeVacio}
        accionVacio={vacioServidor
          ? <Boton variante="secundario" onClick={() => cambiarContinente('')}>Ver todos los destinos</Boton>
          : <Boton variante="secundario" onClick={() => setTexto('')}>Borrar búsqueda</Boton>}
        esqueleto={<EsqueletoDestinos />}
        textoCargando="Cargando destinos…"
      >
        <p className="text-sm text-slate-600" aria-live="polite">
          {visibles.length} {visibles.length === 1 ? 'destino' : 'destinos'}
        </p>
        <ListaDestinos destinos={visibles} busqueda={simular ? `?simular=${simular}` : ''} />
      </SeccionConsulta>
    </div>
  )
}
