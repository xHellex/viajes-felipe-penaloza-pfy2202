import { formatearDia, formatearFechaHora } from '../../utils/formato.js'

/** <time> con la fecha legible y el valor ISO para máquinas. conHora: fecha y hora de un vuelo. */
export default function FechaTexto({ iso, conHora = false }) {
  return <time dateTime={iso}>{conHora ? formatearFechaHora(iso) : formatearDia(iso)}</time>
}
