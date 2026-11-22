import { setupServer } from 'msw/node'
import { handlers } from './handlers/index.js'

/** Servidor MSW para las pruebas en Node (Vitest). */
export const servidor = setupServer(...handlers)
