/** Botón con las variantes de .btn (primario, secundario, peligro, acento). */
export default function Boton({ variante = 'primario', className = '', type = 'button', ...props }) {
  return <button type={type} className={`btn btn-${variante} ${className}`} {...props} />
}
