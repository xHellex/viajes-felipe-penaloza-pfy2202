import { obtenerDestino } from '../services/rest/destinosApi.js'
import { useRecursoRest } from './useRecursoRest.js'

/** Información completa de un destino (REST). */
export function useDestino(id, { simular } = {}) {
  return useRecursoRest(`destino:${id}:${simular ?? ''}`, (signal) => obtenerDestino(id, { simular }, signal))
}
