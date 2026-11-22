import { useEffect, useState } from 'react'

// Esqueleto V1: se reemplaza por useDestinos() en V4
export default function PaginaDestinos() {
  const [destinos, setDestinos] = useState(null)

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}api/destinos`)
      .then((respuesta) => respuesta.json())
      .then(setDestinos)
  }, [])

  return (
    <>
      <h1 className="mb-4 text-3xl">Destinos</h1>
      {destinos ? (
        <ul>{destinos.map((d) => <li key={d.id}>{d.nombre}, {d.pais}</li>)}</ul>
      ) : (
        <p>Cargando…</p>
      )}
    </>
  )
}
