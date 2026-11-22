// Íconos SVG propios (sin emojis: las banderas emoji se ven como letras en Windows)
const trazos = {
  avion: 'M2 16l20-8-6 13-4-5-5 3 1-5z',
  cama: 'M3 18v-7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v7M3 14h18M7 9V6h4v3M3 18v2M21 18v2',
  alerta: 'M12 3 2 20h20L12 3zM12 10v4M12 17v.5',
  check: 'M4 12l5 5L20 6',
  maleta: 'M4 8h16v11H4zM9 8V5h6v3M4 13h16',
}

/** Ícono decorativo: el texto que lo acompaña es el que leen los lectores de pantalla. */
export default function Icono({ nombre, className = 'size-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={trazos[nombre]} />
    </svg>
  )
}
