import { http, HttpResponse } from 'msw'

// Esqueleto V1: dos destinos fijos para comprobar MSW en GitHub Pages
export const handlersRest = [
  http.get('*/api/destinos', () =>
    HttpResponse.json([
      { id: 'cusco', nombre: 'Cusco', pais: 'Perú' },
      { id: 'tokio', nombre: 'Tokio', pais: 'Japón' },
    ]),
  ),
]
