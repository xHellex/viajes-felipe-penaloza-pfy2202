// GitHub Pages responde 404.html ante una ruta que no existe como archivo (p. ej. al recargar
// /destinos/cusco). Copiar index.html como 404.html hace que React Router resuelva esa ruta.
import { copyFileSync } from 'node:fs'

copyFileSync('dist/index.html', 'dist/404.html')
console.log('dist/404.html creado')
