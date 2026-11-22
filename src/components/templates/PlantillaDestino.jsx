/**
 * Disposición del detalle de un destino: encabezado (título y pasos), información REST,
 * barra con pestañas y controles, y el contenido de la pestaña activa (<Outlet /> en children).
 */
export default function PlantillaDestino({ encabezado, informacion, pestanas, controles, children }) {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-4">{encabezado}</header>
      {informacion}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {pestanas}
          {controles}
        </div>
        {children}
      </div>
    </div>
  )
}
