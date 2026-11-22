import { Link } from 'react-router'
import Icono from '../components/atoms/Icono.jsx'
import { useTituloPagina } from '../hooks/useTituloPagina.js'

const pasos = [
  { titulo: 'Elige un destino', detalle: 'Explora destinos por continente, con su país y actividades populares.' },
  { titulo: 'Compara vuelos', detalle: 'Fechas, duración, escalas, precio y asientos disponibles desde Santiago.' },
  { titulo: 'Elige tu hotel', detalle: 'Estrellas, precio por noche, fechas y habitaciones disponibles.' },
  { titulo: 'Revisa tu viaje', detalle: 'En «Mi viaje» ves el total del vuelo más las noches de hotel.' },
]

export default function PaginaInicio() {
  const refTitulo = useTituloPagina('Inicio')

  return (
    <div className="flex flex-col gap-12">
      <section className="overflow-hidden rounded-3xl bg-linear-to-br from-mar-700 to-mar-900 px-6 py-12 text-white sm:px-10">
        <p className="mb-2 font-semibold text-sol-400">Agencia de viajes</p>
        <h1 ref={refTitulo} tabIndex={-1} className="max-w-2xl text-4xl font-bold sm:text-5xl">
          Planifica tu próximo viaje paso a paso
        </h1>
        <p className="mt-4 max-w-xl text-lg text-mar-100">
          Ocho destinos en cuatro continentes, con vuelos desde Santiago y hoteles con disponibilidad real del catálogo.
        </p>
        <Link to="/destinos" className="btn btn-acento mt-8">
          <Icono nombre="maleta" /> Explorar destinos
        </Link>
      </section>

      <section aria-labelledby="como-funciona">
        <h2 id="como-funciona" className="mb-5 text-2xl font-bold">Cómo funciona</h2>
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pasos.map(({ titulo, detalle }, i) => (
            <li key={titulo} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <span className="mb-3 grid size-9 place-items-center rounded-full bg-sol-500 font-bold text-slate-900" aria-hidden="true">{i + 1}</span>
              <h3 className="font-sans text-lg font-bold">{titulo}</h3>
              <p className="mt-1 text-sm text-slate-600">{detalle}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}
