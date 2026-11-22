import { Link } from 'react-router'
import { useTituloPagina } from '../hooks/useTituloPagina.js'

export default function PaginaNoEncontrada() {
  const refTitulo = useTituloPagina('Página no encontrada')

  return (
    <div className="mx-auto max-w-lg py-12 text-center">
      <p className="text-6xl font-bold text-mar-700">404</p>
      <h1 ref={refTitulo} tabIndex={-1} className="mt-2 text-3xl font-bold">Página no encontrada</h1>
      <p className="mt-3 text-slate-600">La dirección no existe. Puede que el enlace esté mal escrito o que la página se haya movido.</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link to="/" className="btn btn-secundario">Ir al inicio</Link>
        <Link to="/destinos" className="btn btn-primario">Ver destinos</Link>
      </div>
    </div>
  )
}
