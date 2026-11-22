import { useState } from 'react'
import { Link } from 'react-router'
import DialogoConfirmacion from '../components/molecules/DialogoConfirmacion.jsx'
import MensajeEstado from '../components/molecules/MensajeEstado.jsx'
import PasosViaje from '../components/molecules/PasosViaje.jsx'
import ResumenViaje from '../components/organisms/ResumenViaje.jsx'
import { hotelCubreViaje, nochesDelVuelo, totalPlan, useAccionesPlan, usePlanViaje } from '../context/planViaje.js'
import { useTituloPagina } from '../hooks/useTituloPagina.js'

export default function PaginaMiViaje() {
  const refTitulo = useTituloPagina('Mi viaje')
  const plan = usePlanViaje()
  const { quitar, vaciar } = useAccionesPlan()
  const [confirmando, setConfirmando] = useState(false)

  const pasos = [
    { texto: 'Destino', hecho: plan.destino !== null },
    { texto: 'Vuelo', hecho: plan.vuelo !== null },
    { texto: 'Hotel', hecho: plan.hotel !== null },
    { texto: 'Resumen', hecho: plan.vuelo !== null && plan.hotel !== null },
  ]

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-3">
        <h1 ref={refTitulo} tabIndex={-1} className="text-3xl font-bold sm:text-4xl">Mi viaje</h1>
        <PasosViaje pasos={pasos} />
      </header>

      {plan.destino ? (
        <ResumenViaje
          plan={plan}
          noches={plan.vuelo ? nochesDelVuelo(plan.vuelo) : 0}
          total={totalPlan(plan)}
          hotelCubre={hotelCubreViaje(plan)}
          onQuitar={quitar}
          onVaciar={() => setConfirmando(true)}
        />
      ) : (
        <MensajeEstado titulo="Aún no planificas un viaje" detalle="Elige un destino y luego un vuelo y un hotel para ver el total aquí.">
          <Link to="/destinos" className="btn btn-primario">Elegir un destino</Link>
        </MensajeEstado>
      )}

      <DialogoConfirmacion
        abierto={confirmando}
        titulo="¿Vaciar tu plan de viaje?"
        mensaje="Se quitarán el vuelo y el hotel elegidos. Esta acción no se puede deshacer."
        textoConfirmar="Vaciar plan"
        onConfirmar={() => {
          vaciar()
          setConfirmando(false)
        }}
        onCancelar={() => setConfirmando(false)}
      />
    </div>
  )
}
