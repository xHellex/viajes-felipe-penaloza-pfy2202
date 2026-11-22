import { useEffect, useEffectEvent, useRef } from 'react'
import { useLocation } from 'react-router'

/**
 * Rutas accesibles: actualiza document.title y, al cambiar de ruta, mueve el foco al <h1>
 * para que los lectores de pantalla anuncien la página nueva.
 *
 * - En la primera carga no se mueve el foco: React Router da la key 'default' a esa entrada.
 * - disparador: qué cambio mueve el foco. Por defecto cada navegación; el detalle de destino
 *   usa el id para que cambiar entre las pestañas Vuelos y Hoteles no salte al título.
 *
 * @returns ref para el <h1> (que debe tener tabIndex={-1}).
 */
export function useTituloPagina(titulo, disparador) {
  const refTitulo = useRef(null)
  const { key } = useLocation()

  useEffect(() => {
    document.title = `${titulo} | Rumbo`
  }, [titulo])

  const enfocar = useEffectEvent(() => {
    if (key !== 'default') refTitulo.current?.focus()
  })

  const cambio = disparador ?? key
  useEffect(() => {
    enfocar()
  }, [cambio])

  return refTitulo
}
