import { Link, Route, Routes } from 'react-router'
import PaginaDestinos from './pages/PaginaDestinos.jsx'

export default function App() {
  return (
    <main className="mx-auto max-w-5xl p-6">
      <nav className="mb-6 flex gap-4">
        <Link to="/">Inicio</Link>
        <Link to="/destinos">Destinos</Link>
      </nav>
      <Routes>
        <Route index element={<h1 className="text-3xl">Rumbo · Agencia de viajes</h1>} />
        <Route path="destinos" element={<PaginaDestinos />} />
        <Route path="*" element={<h1 className="text-3xl">Página no encontrada</h1>} />
      </Routes>
    </main>
  )
}
