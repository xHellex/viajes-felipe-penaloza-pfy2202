import { handlersGraphql } from './graphql.js'
import { handlersRest } from './rest.js'

export const handlers = [...handlersRest, ...handlersGraphql]
