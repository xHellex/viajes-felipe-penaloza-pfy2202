import { useEffect, useState } from 'react'
import { CLAVE_PLAN, PLAN_VACIO, PlanAccionesContext, PlanEstadoContext, cargarPlan, elegir, quitar, serializarPlan } from './planViaje.js'

function leerGuardado() {
  try {
    return cargarPlan(localStorage.getItem(CLAVE_PLAN))
  } catch {
    return PLAN_VACIO // modo privado o almacenamiento bloqueado
  }
}

/** Guarda el plan en useState y lo persiste en localStorage con useEffect. */
export default function PlanViajeProvider({ children }) {
  const [plan, setPlan] = useState(leerGuardado)

  // Acciones creadas una sola vez (actualizaciones funcionales): su referencia no cambia nunca
  const [acciones] = useState(() => ({
    elegir: (seleccion) => setPlan((actual) => elegir(actual, seleccion)),
    quitar: (tipo) => setPlan((actual) => quitar(actual, tipo)),
    vaciar: () => setPlan(PLAN_VACIO),
  }))

  useEffect(() => {
    try {
      localStorage.setItem(CLAVE_PLAN, serializarPlan(plan))
    } catch {
      // Sin almacenamiento el plan sigue funcionando durante la visita
    }
  }, [plan])

  return (
    <PlanAccionesContext value={acciones}>
      <PlanEstadoContext value={plan}>{children}</PlanEstadoContext>
    </PlanAccionesContext>
  )
}
