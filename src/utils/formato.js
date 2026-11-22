/*
 * Formatos para mostrar datos (Intl funciona igual en Chromium, Firefox y Safari).
 * Las fechas de vuelos llegan en ISO 8601 con zona horaria y se muestran en hora de Chile.
 * Las fechas sin hora ("2026-12-01") JS las interpreta en UTC: se formatean en UTC para que
 * en Chile no aparezcan un día antes.
 */
const clp = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 })
const dia = new Intl.DateTimeFormat('es-CL', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })
const fechaHora = new Intl.DateTimeFormat('es-CL', {
  weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZone: 'America/Santiago',
})

export const formatearCLP = (valor) => clp.format(valor)
export const formatearDia = (iso) => dia.format(new Date(iso))
export const formatearFechaHora = (iso) => fechaHora.format(new Date(iso))

export function formatearDuracion(minutos) {
  const horas = Math.floor(minutos / 60)
  const resto = minutos % 60
  return resto ? `${horas} h ${resto} min` : `${horas} h`
}
