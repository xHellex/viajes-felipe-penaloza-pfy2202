import Insignia from './Insignia.jsx'

/** Disponibilidad de asientos o habitaciones: agotado, quedan pocas o disponibles. */
export default function Disponibilidad({ cantidad, singular, plural }) {
  if (cantidad === 0) return <Insignia tono="agotado">Agotado</Insignia>
  const unidad = cantidad === 1 ? singular : plural
  if (cantidad <= 3) return <Insignia tono="alerta">Quedan {cantidad} {unidad}</Insignia>
  return <Insignia tono="exito">{cantidad} {unidad} disponibles</Insignia>
}
