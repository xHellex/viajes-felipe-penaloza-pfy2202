/**
 * Tabla única de errores de la app (REST y GraphQL): qué pasó, qué puede hacer el usuario
 * y si tiene sentido reintentar. La regla de reintento vive aquí, no en cada componente.
 */
export const MENSAJES = {
  'no-encontrado': {
    titulo: 'No encontramos lo que buscas',
    detalle: 'El destino solicitado no existe o ya no está en nuestro catálogo.',
    sugerencia: 'Revisa el enlace o vuelve al listado de destinos.',
    permiteReintento: false,
  },
  servidor: {
    titulo: 'El servicio tuvo un problema',
    detalle: 'El servidor respondió con un error interno.',
    sugerencia: 'Suele ser momentáneo: reintenta en unos segundos.',
    permiteReintento: true,
  },
  red: {
    titulo: 'No hay conexión con el servidor',
    detalle: 'La petición no llegó al servicio de la agencia.',
    sugerencia: 'Revisa tu conexión a internet y vuelve a intentarlo.',
    permiteReintento: true,
  },
  respuesta: {
    titulo: 'La respuesta del servidor no es válida',
    detalle: 'Se recibió información con un formato inesperado.',
    sugerencia: 'Vuelve más tarde; reintentar ahora daría el mismo resultado.',
    permiteReintento: false,
  },
}

/** Error de una petición. tipo: 'no-encontrado' | 'servidor' | 'red' | 'respuesta'. */
export class ErrorApi extends Error {
  constructor(tipo, { status, mensaje, causa } = {}) {
    super(mensaje ?? MENSAJES[tipo].detalle, { cause: causa })
    this.name = 'ErrorApi'
    this.tipo = tipo
    this.status = status
  }
}

/** Un recurso inexistente o una respuesta mal formada no se arreglan reintentando. */
export function permiteReintento(error) {
  return MENSAJES[error.tipo]?.permiteReintento ?? true
}
