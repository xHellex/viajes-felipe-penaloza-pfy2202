import { useEffect, useId, useRef } from 'react'

/**
 * Modal de confirmación propio (reemplaza a window.confirm, feedback S3).
 *
 * Usa <dialog> con showModal(), que ya trae: foco atrapado dentro, Esc para cancelar,
 * fondo inerte y rol de diálogo. Se agrega:
 * - foco inicial en "Cancelar" (la opción segura);
 * - clic fuera del cuadro = cancelar;
 * - aria-labelledby / aria-describedby;
 * - botón de confirmación rojo y con texto explícito ("Vaciar plan", no "Aceptar").
 * Al cerrarse, el navegador devuelve el foco al elemento que lo abrió.
 *
 * @param {boolean}  abierto
 * @param {string}   titulo
 * @param {string}   mensaje
 * @param {string}   textoConfirmar
 * @param {Function} onConfirmar
 * @param {Function} onCancelar - Se llama con Cancelar, Esc o clic fuera.
 */
function DialogoConfirmacion({ abierto, titulo, mensaje, textoConfirmar, onConfirmar, onCancelar }) {
  const refDialogo = useRef(null)
  const refCancelar = useRef(null)
  const idTitulo = useId()
  const idMensaje = useId()

  useEffect(() => {
    const dialogo = refDialogo.current
    if (abierto && !dialogo.open) {
      dialogo.showModal()
      refCancelar.current.focus()
    } else if (!abierto && dialogo.open) {
      dialogo.close()
    }
  }, [abierto])

  return (
    <dialog
      ref={refDialogo}
      aria-labelledby={idTitulo}
      aria-describedby={idMensaje}
      // Esc cierra el diálogo nativo: si seguía abierto según React, es una cancelación
      onClose={() => abierto && onCancelar()}
      // El <dialog> no tiene padding: un clic directo sobre él es un clic en el fondo
      onClick={(e) => e.target === refDialogo.current && onCancelar()}
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl p-0 shadow-2xl backdrop:bg-mar-900/60 backdrop:backdrop-blur-sm"
    >
      <div className="p-6">
        <h2 id={idTitulo} className="text-xl font-bold text-mar-900">
          {titulo}
        </h2>
        <p id={idMensaje} className="mt-2 text-slate-700">
          {mensaje}
        </p>
        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button ref={refCancelar} type="button" onClick={onCancelar} className="btn btn-secundario">
            Cancelar
          </button>
          <button type="button" onClick={onConfirmar} className="btn btn-peligro">
            {textoConfirmar}
          </button>
        </div>
      </div>
    </dialog>
  )
}

export default DialogoConfirmacion
