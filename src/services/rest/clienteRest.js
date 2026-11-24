import { ErrorApi } from '../mensajes.js'

/*
 * Cliente HTTP de la app. Ojo: fetch NO lanza error con un 404 o un 500, solo cuando falla
 * la red; por eso se revisa response.ok a mano y cada falla se traduce a un ErrorApi.
 */

// En el navegador la API cuelga de la base del sitio ("/" en dev, "/viajes-…/" en Pages).
// En las pruebas con Node no hay window: Vitest define VITE_API_BASE.
const BASE_API = import.meta.env.VITE_API_BASE ?? new URL(import.meta.env.BASE_URL, window.location.origin).href

/** URL absoluta de un recurso; los parámetros vacíos no se envían. */
export function urlApi(ruta, params = {}) {
  const url = new URL(ruta, BASE_API)
  for (const [clave, valor] of Object.entries(params)) {
    if (valor) url.searchParams.set(clave, valor)
  }
  return url.toString()
}

function tipoSegunStatus(status, cuerpo) {
  // Nuestra API responde sus 404 con JSON; un 404 sin JSON lo da el hosting (MSW no intercepta)
  if (status === 404) return cuerpo ? 'no-encontrado' : 'sin-servicio'
  if (status >= 500) return 'servidor'
  return 'respuesta'
}

/**
 * GET de un recurso JSON. Lanza ErrorApi si la red falla, el status no es 2xx o el cuerpo
 * no es JSON. Una cancelación (signal) se propaga como AbortError: no es un error para el usuario.
 */
export async function obtenerJSON(ruta, { params, signal } = {}) {
  let respuesta
  try {
    respuesta = await fetch(urlApi(ruta, params), { signal })
  } catch (error) {
    if (error.name === 'AbortError') throw error
    throw new ErrorApi('red', { causa: error })
  }

  if (!respuesta.ok) {
    // El cuerpo del error es opcional: si no trae { mensaje }, se usa el texto del tipo
    const cuerpo = await respuesta.json().catch(() => null)
    throw new ErrorApi(tipoSegunStatus(respuesta.status, cuerpo), { status: respuesta.status, mensaje: cuerpo?.mensaje })
  }

  try {
    return await respuesta.json()
  } catch (error) {
    if (error.name === 'AbortError') throw error
    throw new ErrorApi('respuesta', { status: respuesta.status, causa: error })
  }
}
