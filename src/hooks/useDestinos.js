import { listarDestinos } from '../services/rest/destinosApi.js'
import { useRecursoRest } from './useRecursoRest.js'

/** Listado de destinos (REST), filtrado por continente en el servidor. */
export function useDestinos({ continente, simular }) {
  return useRecursoRest(`destinos:${continente ?? ''}:${simular ?? ''}`, (signal) =>
    listarDestinos({ continente, simular }, signal),
  )
}
