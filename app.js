// Este archivo arma la página con lo que hay en contenido.js.
// Normalmente no necesitas modificarlo.

const hoy = new Date();
hoy.setHours(0, 0, 0, 0);

function leerFecha(texto) {
  const [anio, mes, dia] = texto.split("-").map(Number);
  return new Date(anio, mes - 1, dia);
}

function fechaLarga(texto) {
  return leerFecha(texto).toLocaleDateString("es-MX", {
    day: "numeric", month: "long", year: "numeric",
  });
}

function limpiar(texto) {
  const div = document.createElement("div");
  div.textContent = texto || "";
  return div.innerHTML;
}

const porFechaNueva = (a, b) => leerFecha(b.fecha) - leerFecha(a.fecha);
const porFechaVieja = (a, b) => leerFecha(a.fecha) - leerFecha(b.fecha);

const eventosProximos = PUBLICACIONES
  .filter((p) => p.tipo === "evento" && leerFecha(p.fecha) >= hoy)
  .sort(porFechaVieja);

const logros = PUBLICACIONES
  .filter((p) => p.tipo === "logro")
  .sort(porFechaNueva);

// ----- Cifras de la portada -----
document.getElementById("cifra-sociedades").textContent = SOCIEDADES.length;
document.getElementById("cifra-logros").textContent = logros.length;
document.getElementById("cifra-eventos").textContent = eventosProximos.length;

// ----- Próximos eventos -----
const listaEventos = document.getElementById("lista-eventos");
if (eventosProximos.length === 0) {
  listaEventos.innerHTML = '<p class="vacio">No hay eventos próximos por ahora.</p>';
} else {
  listaEventos.innerHTML = eventosProximos.slice(0, 6).map((e) => {
    const fecha = leerFecha(e.fecha);
    const mes = fecha.toLocaleDateString("es-MX", { month: "short" }).replace(".", "");
    return `
      <article class="evento">
        <div class="evento-fecha">
          <strong>${fecha.getDate()}</strong>
          <span>${mes}</span>
        </div>
        <div>
          <span class="sociedad-tag">${limpiar(e.sociedad)}</span>
          <h3>${limpiar(e.titulo)}</h3>
          <p class="detalles">${limpiar([e.hora, e.lugar].filter(Boolean).join(" · "))}</p>
          <p>${limpiar(e.descripcion)}</p>
        </div>
      </article>`;
  }).join("");
}

// ----- Logros recientes -----
const listaLogros = document.getElementById("lista-logros");
if (logros.length === 0) {
  listaLogros.innerHTML = '<p class="vacio">Todavía no hay logros publicados.</p>';
} else {
  listaLogros.innerHTML = logros.slice(0, 4).map((l) => `
    <article class="logro">
      <span class="sociedad-tag">${limpiar(l.sociedad)}</span>
      <h3>${limpiar(l.titulo)}</h3>
      <p>${limpiar(l.descripcion)}</p>
      <time>${fechaLarga(l.fecha)}</time>
    </article>`).join("");
}

// ----- Registro con filtros -----
const listaRegistro = document.getElementById("lista-registro");
const selectSociedad = document.getElementById("filtro-sociedad");
const inputTexto = document.getElementById("filtro-texto");
const botonesTipo = document.querySelectorAll(".chip");
let tipoElegido = "todo";

SOCIEDADES.forEach((s) => {
  const opcion = document.createElement("option");
  opcion.value = s.nombre;
  opcion.textContent = s.nombre;
  selectSociedad.appendChild(opcion);
});

function mostrarRegistro() {
  const buscar = inputTexto.value.trim().toLowerCase();
  const sociedad = selectSociedad.value;

  const resultados = [...PUBLICACIONES].sort(porFechaNueva).filter((p) => {
    if (tipoElegido !== "todo" && p.tipo !== tipoElegido) return false;
    if (sociedad && p.sociedad !== sociedad) return false;
    if (buscar) {
      const todo = `${p.titulo} ${p.sociedad} ${p.descripcion}`.toLowerCase();
      if (!todo.includes(buscar)) return false;
    }
    return true;
  });

  if (resultados.length === 0) {
    listaRegistro.innerHTML = '<li><p class="vacio">No encontramos nada con esos filtros.</p></li>';
    return;
  }

  listaRegistro.innerHTML = resultados.map((p) => `
    <li>
      <time>${fechaLarga(p.fecha)}</time>
      <span class="tipo tipo-${p.tipo}">${p.tipo === "logro" ? "Logro" : "Evento"}</span>
      <div>
        <strong>${limpiar(p.titulo)}</strong>
        <span class="sociedad-tag">${limpiar(p.sociedad)}</span>
        <p>${limpiar(p.descripcion)}</p>
      </div>
    </li>`).join("");
}

botonesTipo.forEach((boton) => {
  boton.addEventListener("click", () => {
    botonesTipo.forEach((b) => b.classList.remove("activo"));
    boton.classList.add("activo");
    tipoElegido = boton.dataset.tipo;
    mostrarRegistro();
  });
});
selectSociedad.addEventListener("change", mostrarRegistro);
inputTexto.addEventListener("input", mostrarRegistro);
mostrarRegistro();

// ----- Sociedades -----
document.getElementById("lista-sociedades").innerHTML = SOCIEDADES.map((s) => {
  const total = PUBLICACIONES.filter((p) => p.sociedad === s.nombre).length;
  return `
    <article class="sociedad">
      <h3>${limpiar(s.nombre)}</h3>
      <p>${limpiar(s.descripcion)}</p>
      <small>${total} ${total === 1 ? "publicación" : "publicaciones"}</small>
    </article>`;
}).join("");
