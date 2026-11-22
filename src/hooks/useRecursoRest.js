import { useEffect, useEffectEvent, useState } from 'react'

/**
 * Estado de un recurso REST de una vista: { datos, error, cargando, actualizando, recargar }.
 *
 * - clave identifica el recurso (p. ej. "destino:cusco"). Si cambia, se pide de nuevo y no se
 *   muestran datos de otro recurso mientras tanto.
 * - cargando: primera carga (no hay nada que mostrar). actualizando: se recarga con datos visibles.
 * - Si una recarga falla, se conservan los datos anteriores junto al error.
 * - Al salir de la vista (o cambiar de clave) la petición pendiente se cancela con AbortController.
 */
export function useRecursoRest(clave, cargar) {
  const [version, setVersion] = useState(0)
  const [resultado, setResultado] = useState({ clave: null, version: -1, datos: null, error: null })

  // Siempre la versión más reciente de cargar, sin que el efecto dependa de ella
  const pedir = useEffectEvent((signal) => cargar(signal))

  useEffect(() => {
    const control = new AbortController()

    pedir(control.signal).then(
      (datos) => setResultado({ clave, version, datos, error: null }),
      (error) => {
        if (error.name === 'AbortError') return // se cancelaba a propósito: no es un error
        setResultado((previo) => ({ clave, version, datos: previo.clave === clave ? previo.datos : null, error }))
      },
    )

    return () => control.abort()
  }, [clave, version])

  const mismoRecurso = resultado.clave === clave
  const datos = mismoRecurso ? resultado.datos : null
  const pendiente = !mismoRecurso || resultado.version !== version

  return {
    datos,
    error: pendiente ? null : resultado.error,
    cargando: pendiente && datos === null,
    actualizando: pendiente && datos !== null,
    recargar: () => setVersion((v) => v + 1),
  }
}
