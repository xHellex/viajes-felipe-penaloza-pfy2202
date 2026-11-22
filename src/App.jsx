import { Navigate, Route, Routes, useLocation } from 'react-router'
import PlantillaSitio from './components/templates/PlantillaSitio.jsx'
import { usePlanViaje } from './context/planViaje.js'
import PaginaDestino from './pages/PaginaDestino.jsx'
import PaginaDestinos from './pages/PaginaDestinos.jsx'
import PaginaInicio from './pages/PaginaInicio.jsx'
import PaginaMiViaje from './pages/PaginaMiViaje.jsx'
import PaginaNoEncontrada from './pages/PaginaNoEncontrada.jsx'
import { PaginaHoteles, PaginaVuelos } from './pages/PaginaOpciones.jsx'

/** /destinos/:id abre la pestaña Vuelos, conservando el modo demostración (?simular). */
function IrAVuelos() {
  const { search } = useLocation()
  return <Navigate to={{ pathname: 'vuelos', search }} replace />
}

export default function App() {
  const { vuelo, hotel } = usePlanViaje()

  return (
    <Routes>
      <Route element={<PlantillaSitio elementosPlan={Number(Boolean(vuelo)) + Number(Boolean(hotel))} />}>
        <Route index element={<PaginaInicio />} />
        <Route path="destinos" element={<PaginaDestinos />} />
        <Route path="destinos/:destinoId" element={<PaginaDestino />}>
          <Route index element={<IrAVuelos />} />
          <Route path="vuelos" element={<PaginaVuelos />} />
          <Route path="hoteles" element={<PaginaHoteles />} />
        </Route>
        <Route path="mi-viaje" element={<PaginaMiViaje />} />
        <Route path="*" element={<PaginaNoEncontrada />} />
      </Route>
    </Routes>
  )
}
