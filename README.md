# SEPREPA NEWS

Página para que las Sociedades Estudiantiles de PrepaTec publiquen sus logros y eventos, y guarden registro de todo lo que pasa.

## Cómo verla

Abre `index.html` con doble clic y se va a abrir en tu navegador.

## Cómo agregar o cambiar contenido

Todo el contenido está en **`contenido.js`**:

- `SOCIEDADES`: la lista de sociedades.
- `PUBLICACIONES`: los eventos y logros. Cada uno tiene `tipo` (`"evento"` o `"logro"`), `titulo`, `sociedad`, `fecha` (`"AÑO-MES-DÍA"`) y `descripcion`. Los eventos también pueden llevar `hora` y `lugar`.

Copia un bloque `{ ... }`, pégalo y cambia los textos. Guarda el archivo y recarga la página.

## Archivos

| Archivo | Para qué sirve |
|---|---|
| `index.html` | La estructura de la página |
| `estilos.css` | Colores, letras y diseño |
| `contenido.js` | **El contenido (aquí se edita)** |
| `app.js` | Arma la página con el contenido |
