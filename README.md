# SEPREPA NEWS

Página para que las Sociedades Estudiantiles de PrepaTec publiquen sus logros y eventos, y guarden registro de todo lo que pasa en cada campus.

## Cómo verla

Abre `index.html` con doble clic y se va a abrir en tu navegador. El mapa necesita internet.

## Cómo agregar o cambiar contenido

Todo el contenido está en **`contenido.js`**:

- `SOCIEDADES`: la lista de sociedades. Cada una tiene `nombre`, `campus` y `descripcion`.
- `PUBLICACIONES`: los eventos y logros. Cada uno tiene `tipo` (`"evento"` o `"logro"`), `titulo`, `sociedad`, `campus`, `fecha` (`"AÑO-MES-DÍA"`) y `descripcion`. Los eventos también pueden llevar `hora` y `lugar`. Los logros pueden llevar `imagen` (guarda la foto en una carpeta `imagenes` y pon `"imagenes/foto.jpg"`).

En `campus` va el `id` del campus, que está en `campus.js`, por ejemplo `"ciudad-de-mexico"`, `"cumbres"` o `"guadalajara"`.

Copia un bloque `{ ... }`, pégalo y cambia los textos. Guarda el archivo y recarga la página.

## Enlace directo a un campus

`index.html#campus=ciudad-de-mexico` abre la página mostrando solo ese campus.

## Archivos

| Archivo | Para qué sirve |
|---|---|
| `index.html` | La estructura de la página |
| `estilos.css` | Colores, letras y diseño |
| `contenido.js` | **El contenido (aquí se edita)** |
| `campus.js` | La lista de los 29 campus y su ubicación exacta en el mapa |
| `app.js` | Arma la página y el mapa con el contenido |
| `vendor/leaflet/` | La librería del mapa ([Leaflet](https://leafletjs.com) 1.9.4), guardada aquí para no depender de otros sitios |

El mapa base (calles y satélite) viene de Esri y necesita internet.
