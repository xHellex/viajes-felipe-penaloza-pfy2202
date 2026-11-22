import MensajeEstado from '../molecules/MensajeEstado.jsx'

/**
 * Los cuatro estados de una sección que depende de una petición, con el mismo criterio en toda la app:
 * - cargando (primera vez): esqueleto + aviso para lectores de pantalla;
 * - actualizando (hay datos en pantalla): aviso "Actualizando…" sobre los datos anteriores;
 * - error: mensaje con sugerencia (y datos anteriores debajo, si los hay);
 * - vacío: mensaje con una acción sugerida.
 *
 * consulta: { cargando, actualizando, error, recargar } de useRecursoRest o useOpcionesViaje.
 * hayDatos / vacio: los calcula la página, que conoce la forma de sus datos.
 */
export default function SeccionConsulta({
  titulo, consulta, hayDatos, vacio, mensajeVacio, accionVacio, alternativas, esqueleto, textoCargando, children,
}) {
  const { cargando, actualizando, error, recargar } = consulta

  return (
    <section aria-label={titulo} aria-busy={cargando || actualizando} className="flex flex-col gap-4">
      {cargando && (
        <>
          <output className="sr-only">{textoCargando}</output>
          {esqueleto}
        </>
      )}
      {actualizando && (
        <output className="self-start rounded-full bg-mar-50 px-3 py-1 text-sm font-semibold text-mar-900">Actualizando…</output>
      )}
      {error && (
        <MensajeEstado error={error} onReintentar={recargar}>
          {alternativas}
        </MensajeEstado>
      )}
      {hayDatos && vacio && !error && (
        <MensajeEstado titulo={mensajeVacio.titulo} detalle={mensajeVacio.detalle}>
          {accionVacio}
        </MensajeEstado>
      )}
      {hayDatos && !vacio && children}
    </section>
  )
}
