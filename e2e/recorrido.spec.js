import { expect, test } from '@playwright/test'

/*
 * Recorrido de la agencia contra el build publicado (MSW activo en el navegador).
 * Las rutas son relativas a baseURL, que incluye la base de GitHub Pages.
 */

const titulo = (page, nombre) => page.getByRole('heading', { level: 1, name: nombre })

test('1. lista los 8 destinos con país y actividades (REST)', async ({ page }) => {
  await page.goto('destinos')
  await expect(page.locator('article')).toHaveCount(8)
  const cusco = page.locator('article', { hasText: 'Cusco' })
  await expect(cusco).toContainText('Perú')
  await expect(cusco.getByRole('list', { name: /Actividades populares/ })).toContainText('Machu Picchu')
})

test('2. filtra por continente (URL) y por texto, con estado vacío', async ({ page }) => {
  await page.goto('destinos')
  await page.getByLabel('Continente').selectOption('Asia')
  await expect(page).toHaveURL(/continente=Asia/)
  await expect(page.locator('article')).toHaveCount(1)
  await expect(page.locator('article')).toContainText('Tokio')

  await page.getByLabel('Continente').selectOption('')
  await page.getByLabel('Buscar destino o país').fill('peru')
  await expect(page.locator('article')).toHaveCount(1)
  await expect(page.locator('article')).toContainText('Cusco')

  await page.getByLabel('Buscar destino o país').fill('')
  await page.getByLabel('Continente').selectOption('África')
  await expect(page.getByText('Aún no tenemos destinos en África')).toBeVisible()
})

test('3 y 4. el destino trae su información por REST y sus vuelos y hoteles por GraphQL', async ({ page }) => {
  await page.goto('destinos')
  await page.getByRole('link', { name: 'Cusco' }).click()

  await expect(page).toHaveURL(/destinos\/cusco\/vuelos$/)
  await expect(titulo(page, 'Cusco')).toBeVisible()
  await expect(page.getByText('Valle Sagrado').first()).toBeVisible()

  const vuelos = page.getByRole('region', { name: 'Vuelos disponibles' }).locator('article')
  await expect(vuelos).toHaveCount(3)
  await expect(vuelos.first()).toContainText('SCL → Cusco')
  await expect(vuelos.first()).toContainText('$')
  await expect(page.getByText('Agotado').first()).toBeVisible()

  await page.getByRole('link', { name: 'Hoteles' }).click()
  const hoteles = page.getByRole('region', { name: 'Hoteles disponibles' }).locator('article')
  await expect(hoteles).toHaveCount(3)
  await expect(hoteles.first()).toContainText('Disponible:')
  await expect(hoteles.first()).toContainText('por noche')
})

test('5. cambiar de pestaña no repite la consulta GraphQL (caché de Apollo)', async ({ page }) => {
  const consultas = []
  page.on('request', (request) => {
    if (request.url().endsWith('/graphql')) consultas.push(request.postDataJSON())
  })

  await page.goto('destinos/cusco/vuelos')
  await expect(page.getByRole('region', { name: 'Vuelos disponibles' }).locator('article')).toHaveCount(3)
  await page.getByRole('link', { name: 'Hoteles' }).click()
  await expect(page.getByRole('region', { name: 'Hoteles disponibles' }).locator('article')).toHaveCount(3)

  expect(consultas).toHaveLength(1)
  expect(consultas[0]).toMatchObject({ operationName: 'OpcionesViaje', variables: { destinoId: 'cusco' } })
})

test('6. "Solo con disponibilidad" oculta los agotados y muestra el vacío', async ({ page }) => {
  await page.goto('destinos/cusco/vuelos')
  await expect(page.getByText('Agotado').first()).toBeVisible()
  await page.getByLabel('Solo con disponibilidad').check()
  await expect(page.getByRole('region', { name: 'Vuelos disponibles' }).locator('article')).toHaveCount(2)
  await expect(page.getByText('Agotado')).toHaveCount(0)

  await page.goto('destinos/isla-de-pascua/vuelos')
  await page.getByLabel('Solo con disponibilidad').check()
  await expect(page.getByText('No quedan vuelos con asientos para Isla de Pascua')).toBeVisible()
  await page.getByRole('button', { name: 'Ver también los agotados' }).click()
  await expect(page.getByLabel('Solo con disponibilidad')).not.toBeChecked()
})

test('7. elegir vuelo y hotel muestra el total; otro destino pide confirmación', async ({ page }) => {
  await page.goto('destinos/cusco/vuelos')
  // LATAM: $289.000, sale el 12 y vuelve el 19 de diciembre → 7 noches
  await page.locator('article', { hasText: 'LATAM' }).getByRole('button', { name: 'Elegir este vuelo' }).click()
  await page.getByRole('link', { name: 'Hoteles' }).click()
  // Casa Andina San Blas: $68.000 por noche
  await page.locator('article', { hasText: 'Casa Andina' }).getByRole('button', { name: 'Elegir este hotel' }).click()
  await expect(page.getByRole('link', { name: /Mi viaje/ })).toContainText('2')

  await page.getByRole('link', { name: 'Ver resumen de mi viaje' }).click()
  await expect(page.getByText('7 noches')).toBeVisible()
  await expect(page.getByTestId('total')).toHaveText(/\$765\.000/)

  // El plan sobrevive a una recarga (localStorage)
  await page.reload()
  await expect(page.getByTestId('total')).toHaveText(/\$765\.000/)

  // Elegir en otro destino pide confirmación y deja el plan coherente
  await page.goto('destinos/madrid/vuelos')
  await page.locator('article', { hasText: 'Iberia' }).getByRole('button', { name: 'Elegir este vuelo' }).click()
  const dialogo = page.getByRole('dialog')
  await expect(dialogo).toContainText('Tu plan tiene opciones de Cusco')
  await dialogo.getByRole('button', { name: 'Cambiar a Madrid' }).click()
  await page.getByRole('link', { name: /Mi viaje/ }).click()
  await expect(page.getByRole('heading', { name: 'Madrid, España' })).toBeVisible()
  await expect(page.getByText('Aún no eliges hotel.')).toBeVisible()
})

test('8. recarga directa en una ruta profunda y atrás/adelante', async ({ page }) => {
  // El índice del destino redirige a la pestaña Vuelos
  await page.goto('destinos/cusco')
  await expect(page).toHaveURL(/destinos\/cusco\/vuelos$/)

  await page.goto('destinos/cusco/hoteles')
  await expect(titulo(page, 'Cusco')).toBeVisible()
  await expect(page.getByRole('region', { name: 'Hoteles disponibles' }).locator('article')).toHaveCount(3)

  await page.reload()
  await expect(titulo(page, 'Cusco')).toBeVisible()

  await page.getByRole('link', { name: 'Vuelos' }).click()
  await expect(page).toHaveURL(/vuelos$/)
  await page.goBack()
  await expect(page).toHaveURL(/hoteles$/)
  await page.goForward()
  await expect(page).toHaveURL(/vuelos$/)
})

test('9. un destino inexistente ofrece enlaces, no Reintentar', async ({ page }) => {
  await page.goto('destinos/no-existe')
  await expect(titulo(page, 'Destino no encontrado')).toBeVisible()
  await expect(page.getByRole('alert')).toContainText('no existe')
  await expect(page.getByRole('button', { name: 'Reintentar' })).toHaveCount(0)
  await expect(page.getByRole('link', { name: 'Ver otros destinos' })).toBeVisible()
})

test('10. errores simulados: Reintentar en REST y error GraphQL aislado', async ({ page }) => {
  let pedidos = 0
  page.on('request', (request) => {
    if (request.url().includes('/api/destinos')) pedidos += 1
  })

  await page.goto('destinos?simular=servidor')
  await expect(page.getByRole('alert')).toContainText('El servicio tuvo un problema')
  const antes = pedidos
  await page.getByRole('button', { name: 'Reintentar' }).click()
  await expect.poll(() => pedidos).toBeGreaterThan(antes)
  await expect(page.getByRole('alert')).toBeVisible()

  await page.goto('destinos/cusco/vuelos?simular=graphql')
  await expect(page.getByText('Valle Sagrado').first()).toBeVisible()
  await expect(page.getByRole('region', { name: 'Vuelos disponibles' }).getByRole('alert')).toContainText('El proveedor de vuelos y hoteles no responde.')
})

test('11. una ruta inexistente muestra la página 404 de la aplicación', async ({ page }) => {
  await page.goto('ruta-inexistente')
  await expect(titulo(page, 'Página no encontrada')).toBeVisible()
  await expect(page.getByRole('link', { name: 'Ver destinos' })).toBeVisible()
})
