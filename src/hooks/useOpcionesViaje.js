import { useQuery } from '@apollo/client/react'
import { traducirErrorGraphql } from '../services/graphql/errores.js'
import { interpretarOpciones } from '../services/graphql/opciones.js'
import { OPCIONES_VIAJE } from '../services/graphql/operaciones.js'

/**
 * Vuelos y hoteles de un destino (GraphQL), con los mismos estados que useRecursoRest:
 * { opciones, error, cargando, actualizando, recargar }.
 *
 * Las pestañas Vuelos y Hoteles llaman a este hook con las mismas variables: la segunda
 * responde desde la caché de Apollo, sin una nueva petición.
 */
export function useOpcionesViaje(destinoId, { soloDisponibles = false, simular } = {}) {
  const simularError = simular === 'graphql'
  const { data, previousData, loading, error, refetch } = useQuery(OPCIONES_VIAJE, {
    variables: { destinoId, soloDisponibles },
    // Modo demostración: el mock responde un error GraphQL al ver este encabezado.
    // network-only para que la caché no tape el error simulado con datos guardados.
    context: simularError ? { headers: { 'x-simular': 'graphql' } } : undefined,
    fetchPolicy: simularError ? 'network-only' : 'cache-first',
  })

  // Al cambiar "Solo disponibles" se siguen mostrando las opciones anteriores del mismo destino
  const anteriores = previousData?.opcionesViaje?.destino?.id === destinoId ? previousData : undefined
  const respuesta = data ?? (loading ? anteriores : undefined)

  let opciones = null
  let errorApi = error ? traducirErrorGraphql(error) : null
  if (!errorApi && respuesta) {
    try {
      opciones = interpretarOpciones(respuesta.opcionesViaje)
    } catch (errorForma) {
      errorApi = errorForma
    }
  }

  return {
    opciones,
    error: loading ? null : errorApi,
    cargando: loading && !opciones,
    actualizando: loading && Boolean(opciones),
    // refetch rechaza su promesa si falla; el error ya llega por `error`
    recargar: () => refetch().catch(() => {}),
  }
}
