import { expect, test } from '@playwright/test'

/*
 * Diferencias típicas entre navegadores: ancho de pantalla, fechas y zonas horarias,
 * formato de moneda y el <dialog> nativo con teclado.
 */

for (const ruta of ['', 'destinos', 'destinos/cusco/vuelos', 'destinos/cusco/hoteles', 'mi-viaje']) {
  test(`sin desplazamiento horizontal en /${ruta} (375 px)`, async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 })
    await page.goto(ruta)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await page.waitForLoadState('networkidle')
    const desborde = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
    expect(desborde).toBeLessThanOrEqual(0)
  })
}

test('fechas, horas y precios se muestran igual en todos los motores', async ({ page }) => {
  await page.goto('destinos/cusco/vuelos')
  const latam = page.locator('article', { hasText: 'LATAM' })
  // ISO con zona horaria → hora de Chile; Safari no acepta "2026-12-12 06:15" sin la T
  await expect(latam).toContainText(/12 dic\.?,? 06:15/)
  await expect(latam).toContainText(/\$289\.000/)

  await page.getByRole('link', { name: 'Hoteles' }).click()
  // Fecha sin hora: debe ser el 1 de diciembre, no el 30 de noviembre (desfase UTC)
  await expect(page.locator('article', { hasText: 'Casa Andina' })).toContainText(/1 dic\.? 2026/)
})

test('el diálogo de confirmación funciona con teclado (Esc cancela)', async ({ page }) => {
  await page.goto('destinos/cusco/vuelos')
  await page.locator('article', { hasText: 'LATAM' }).getByRole('button', { name: 'Elegir este vuelo' }).click()
  await page.goto('mi-viaje')
  await page.getByRole('button', { name: 'Vaciar plan' }).click()

  const dialogo = page.getByRole('dialog')
  await expect(dialogo).toBeVisible()
  await expect(dialogo.getByRole('button', { name: 'Cancelar' })).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(dialogo).toBeHidden()
  await expect(page.getByText('Aún no eliges hotel.')).toBeVisible()
})
