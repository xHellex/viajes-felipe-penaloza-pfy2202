/** Pie con la autoría y el aviso de que los datos son simulados. */
export default function PieSitio() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-6 text-sm text-slate-600 sm:flex-row sm:justify-between">
        <p>Rumbo · Felipe Peñaloza · Desarrollo Frontend II (PFY2202)</p>
        <p>Datos simulados con MSW: destinos por REST, vuelos y hoteles por GraphQL.</p>
      </div>
    </footer>
  )
}
