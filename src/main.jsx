import { ApolloProvider } from '@apollo/client/react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import App from './App.jsx'
import PlanViajeProvider from './context/PlanViajeProvider.jsx'
import { clienteApollo } from './services/graphql/cliente.js'
import './styles/index.css'

const raiz = document.getElementById('root')
const base = import.meta.env.BASE_URL

/** Mensaje visible cuando la app no puede arrancar (en vez de una pantalla en blanco). */
function mostrarFalla(titulo, detalle) {
  raiz.innerHTML = `<main class="mx-auto max-w-xl p-6"><h1 class="mb-3 text-2xl">${titulo}</h1><p>${detalle}</p></main>`
}

async function iniciarAplicacion() {
  // La API (REST y GraphQL) es un mock de MSW que vive en un Service Worker, también en GitHub Pages
  if (!('serviceWorker' in navigator)) {
    mostrarFalla(
      'Este navegador no permite el servicio simulado',
      'La API de la agencia funciona con un Service Worker, que este navegador o modo privado tiene desactivado. Prueba con otra ventana o navegador.',
    )
    return
  }

  const { worker } = await import('./mocks/browser.js')
  await worker.start({
    onUnhandledRequest: 'bypass',
    quiet: import.meta.env.PROD,
    // En Pages el sitio vive bajo una subruta: el worker y su alcance deben estar en ella
    serviceWorker: { url: `${base}mockServiceWorker.js`, options: { scope: base } },
  })

  createRoot(raiz).render(
    <StrictMode>
      <ApolloProvider client={clienteApollo}>
        {/* BrowserRouter necesita el basename sin la barra final */}
        <BrowserRouter basename={base.replace(/\/$/, '') || '/'}>
          <PlanViajeProvider>
            <App />
          </PlanViajeProvider>
        </BrowserRouter>
      </ApolloProvider>
    </StrictMode>,
  )
}

iniciarAplicacion().catch((error) => {
  console.error('No se pudo iniciar la aplicación:', error)
  mostrarFalla('No se pudo iniciar la aplicación', 'Recarga la página. Si el problema sigue, revisa la consola del navegador.')
})
