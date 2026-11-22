import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import process from 'node:process'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // En GitHub Pages el sitio vive bajo /viajes-felipe-penaloza-pfy2202/ (lo define el workflow)
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [react(), tailwindcss()],
  test: {
    // El fetch de Node no acepta rutas relativas: en las pruebas la API vive en http://localhost/
    env: { VITE_API_BASE: 'http://localhost/' },
    include: ['src/**/*.test.js'],
  },
})
