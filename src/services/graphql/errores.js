import { CombinedGraphQLErrors, ServerError, ServerParseError } from '@apollo/client/errors'
import { ErrorApi } from '../mensajes.js'

/**
 * Traduce un error de Apollo Client 4 a los mismos tipos que usa REST, para que la interfaz
 * muestre un único formato de mensaje (y la misma regla de reintento) en las dos APIs.
 */
export function traducirErrorGraphql(error) {
  // El servidor respondió, pero con { errors: [...] }: el proveedor de datos falló
  if (CombinedGraphQLErrors.is(error)) {
    return new ErrorApi('servidor', { mensaje: error.errors[0]?.message, causa: error })
  }
  // Status HTTP distinto de 2xx
  if (ServerError.is(error)) {
    // 404/405: el endpoint no existe (en Pages sin el Service Worker de MSW, POST da 405)
    const { statusCode } = error
    const tipo = statusCode === 404 || statusCode === 405 ? 'sin-servicio' : statusCode >= 500 ? 'servidor' : 'respuesta'
    return new ErrorApi(tipo, { status: statusCode, causa: error })
  }
  // El cuerpo no era JSON (p. ej. un index.html)
  if (ServerParseError.is(error)) return new ErrorApi('respuesta', { status: error.statusCode, causa: error })
  // fetch rechazado: la petición no llegó
  return new ErrorApi('red', { causa: error })
}
