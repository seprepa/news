// Este archivo arma la página con lo que hay en campus.js y contenido.js.
// Normalmente no necesitas modificarlo.

const hoy = new Date();
hoy.setHours(0, 0, 0, 0);

const estado = { campus: "", tipo: "todo" };

// ----- Ayudantes -----
function leerFecha(texto) {
  const [anio, mes, dia] = texto.split("-").map(Number);
  return new Date(anio, mes - 1, dia);
}

function fechaValida(texto) {
  if (typeof texto !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(texto)) return false;
  const [anio, mes, dia] = texto.split("-").map(Number);
  const fecha = new Date(anio, mes - 1, dia);
  return fecha.getFullYear() === anio && fecha.getMonth() === mes - 1 && fecha.getDate() === dia;
}

function fechaLarga(texto) {
  return leerFecha(texto).toLocaleDateString("es-MX", {
    day: "numeric", month: "long", year: "numeric",
  });
}

function faltan(texto) {
  const dias = Math.round((leerFecha(texto) - hoy) / 86400000);
  if (dias === 0) return "Hoy";
  if (dias === 1) return "Mañana";
  return `En ${dias} días`;
}

function limpiar(texto) {
  const div = document.createElement("div");
  div.textContent = texto || "";
  return div.innerHTML;
}

// Para buscar sin importar acentos ni mayúsculas: "Robótica" = "robotica"
function normalizar(texto) {
  return String(texto || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

const textoValido = (t) => typeof t === "string" && t.trim() !== "";

// ----- Revisar que los datos estén bien escritos -----
// Si algo está mal en contenido.js o campus.js, la página no se rompe:
// se salta esa parte y avisa qué hay que corregir.
const problemas = [];

const todosLosCampus = typeof CAMPUS !== "undefined" ? CAMPUS : [];
if (typeof CAMPUS === "undefined") {
  problemas.push("campus.js tiene un error de escritura (revisa comas, comillas y llaves).");
}
const campusPorId = Object.fromEntries(todosLosCampus.map((c) => [c.id, c]));

const datosEscritos = typeof SOCIEDADES !== "undefined" && typeof PUBLICACIONES !== "undefined";
if (!datosEscritos) {
  problemas.push("contenido.js tiene un error de escritura (revisa comas, comillas y llaves). Por eso no aparece el contenido.");
}

const todasLasSociedades = (datosEscritos ? SOCIEDADES : []).filter((s, i) => {
  const nombre = s && textoValido(s.nombre) ? `"${s.nombre}"` : `número ${i + 1}`;
  if (!s || !textoValido(s.nombre)) {
    problemas.push(`Sociedad ${nombre}: le falta el nombre.`);
    return false;
  }
  if (!campusPorId[s.campus]) {
    problemas.push(`Sociedad ${nombre}: el campus "${s.campus}" no existe. Usa un id de campus.js.`);
    return false;
  }
  return true;
});

const todasLasPublicaciones = (datosEscritos ? PUBLICACIONES : [])
  .map((p) => (p ? { ...p, tipo: String(p.tipo || "").trim().toLowerCase() } : p))
  .filter((p, i) => {
    const nombre = p && textoValido(p.titulo) ? `"${p.titulo}"` : `número ${i + 1}`;
    const errores = [];
    if (!p) errores.push("está vacía");
    else {
      if (!textoValido(p.titulo)) errores.push("le falta el título");
      if (p.tipo !== "evento" && p.tipo !== "logro") errores.push(`el tipo debe ser "evento" o "logro"`);
      if (!campusPorId[p.campus]) errores.push(`el campus "${p.campus}" no existe`);
      if (!fechaValida(p.fecha)) errores.push(`la fecha "${p.fecha}" debe verse así: "2026-11-14"`);
    }
    if (errores.length) problemas.push(`Publicación ${nombre}: ${errores.join(", ")}.`);
    return errores.length === 0;
  });

if (problemas.length) {
  problemas.forEach((p) => console.warn("[SEPREPA NEWS]", p));
  // El aviso solo se ve en tu computadora, no en la página publicada
  const local = location.protocol === "file:" || ["localhost", "127.0.0.1", ""].includes(location.hostname);
  if (local) {
    const aviso = document.createElement("div");
    aviso.className = "aviso-errores";
    aviso.innerHTML = `<strong>Hay que corregir algo en el contenido</strong> (este aviso solo lo ves tú):
      <ul>${problemas.map((p) => `<li>${limpiar(p)}</li>`).join("")}</ul>`;
    document.body.prepend(aviso);
  }
}

function nombreCampus(id) {
  return campusPorId[id] ? `PrepaTec ${campusPorId[id].nombre}` : "";
}

function delCampus(lista) {
  return estado.campus ? lista.filter((x) => x.campus === estado.campus) : lista;
}

// Una sociedad se identifica por su nombre y su campus
// (puede haber "Sociedad de Debate" en varios campus)
const claveSociedad = (x) => `${x.campus}|${x.sociedad || x.nombre}`;

const porFechaNueva = (a, b) => leerFecha(b.fecha) - leerFecha(a.fecha);
const porFechaVieja = (a, b) => leerFecha(a.fecha) - leerFecha(b.fecha);

function vacio(texto) {
  return `<p class="vacio">${texto} <a href="#publicar">¿Tu sociedad quiere ser la primera?</a></p>`;
}

function inicial(nombre) {
  const sinPrefijo = nombre.replace(/^Sociedad\s+(de\s+(la\s+|las\s+|los\s+|el\s+)?|del\s+)?/i, "");
  return (sinPrefijo.charAt(0) || nombre.charAt(0)).toUpperCase();
}

// ----- Elegir campus -----
function elegirCampus(id, irAEventos) {
  estado.campus = campusPorId[id] ? id : "";
  selectSociedad.value = "";
  try {
    const base = location.pathname + location.search;
    history.replaceState(null, "", estado.campus ? `${base}#campus=${estado.campus}` : base);
  } catch (e) { /* algunos navegadores no lo permiten con archivos locales */ }
  render();
  moverMapa();
  if (estado.campus && irAEventos) {
    document.getElementById("eventos").scrollIntoView({ behavior: "smooth" });
  }
}

// ----- Mapa -----
// De lejos se ve México dibujado con sus estados. Al acercarte aparecen las calles.
const ZOOM_CALLES = 9;
const marcadores = {};
let mapa = null;
let capaPines = null;
let capaEstados = null;
let calles = null;
let mascara = null;
let limitesMexico = null;

function icono(id) {
  const total = todasLasPublicaciones.filter((p) => p.campus === id).length;
  const clases = ["pin"];
  if (total > 0) clases.push("con-contenido");
  if (id === estado.campus) clases.push("activo");
  return L.divIcon({
    className: "",
    html: `<span class="${clases.join(" ")}"></span>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });
}

function iconoGrupo(cantidad, activo) {
  return L.divIcon({
    className: "",
    html: `<span class="pin-grupo${activo ? " activo" : ""}">${cantidad}</span>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  });
}

// ¿El punto [lng, lat] está dentro del contorno?
function dentro(punto, anillo) {
  let adentro = false;
  for (let i = 0, j = anillo.length - 1; i < anillo.length; j = i++) {
    const [xi, yi] = anillo[i];
    const [xj, yj] = anillo[j];
    if ((yi > punto[1]) !== (yj > punto[1]) &&
        punto[0] < ((xj - xi) * (punto[1] - yi)) / (yj - yi) + xi) {
      adentro = !adentro;
    }
  }
  return adentro;
}

// Junta los campus que quedan encimados en un solo círculo con número
function dibujarPines() {
  capaPines.clearLayers();
  const grupos = [];
  todosLosCampus.forEach((c) => {
    const punto = mapa.latLngToLayerPoint([c.lat, c.lng]);
    const grupo = grupos.find((g) => g.punto.distanceTo(punto) < 26);
    if (grupo) grupo.campus.push(c);
    else grupos.push({ punto, campus: [c] });
  });

  grupos.forEach((g) => {
    if (g.campus.length === 1) {
      capaPines.addLayer(marcadores[g.campus[0].id]);
      return;
    }
    const lat = g.campus.reduce((s, c) => s + c.lat, 0) / g.campus.length;
    const lng = g.campus.reduce((s, c) => s + c.lng, 0) / g.campus.length;
    const activo = g.campus.some((c) => c.id === estado.campus);
    const grupo = L.marker([lat, lng], {
      icon: iconoGrupo(g.campus.length, activo),
      title: `${g.campus.length} campus`,
      zIndexOffset: 200,
    });
    grupo.bindTooltip(
      `<strong>${g.campus.length} campus</strong><br>${g.campus.map((c) => limpiar(c.nombre)).join("<br>")}<br><em>Toca para acercar</em>`,
      { direction: "top", offset: [0, -18], className: "tooltip-mapa" });
    grupo.on("click", () => {
      cerrarLetreros();
      mapa.fitBounds(g.campus.map((c) => [c.lat, c.lng]), { padding: [70, 70], maxZoom: 13 });
    });
    capaPines.addLayer(grupo);
  });
}

// Muestra u oculta las calles según qué tan cerca estés
function actualizarCapas() {
  const cerca = mapa.getZoom() >= ZOOM_CALLES;
  if (cerca && !mapa.hasLayer(calles)) {
    calles.addTo(mapa);
    mascara.addTo(mapa);
  } else if (!cerca && mapa.hasLayer(calles)) {
    mapa.removeLayer(calles);
    mapa.removeLayer(mascara);
  }
  capaEstados.setStyle((f) => estiloEstado(f, cerca));
  document.getElementById("ver-mexico").hidden = mapa.getZoom() <= mapa.getMinZoom() + 0.25;
}

function estiloEstado(f, cerca) {
  return {
    color: cerca ? "#0039a6" : "#9db3dc",
    weight: cerca ? 2 : 1,
    fillColor: f.properties.conCampus ? "#d6e2f6" : "#ffffff",
    fillOpacity: cerca ? 0 : 1,
  };
}

// Cierra los letreros (tooltips) abiertos de todos los puntos
function cerrarLetreros() {
  mapa.eachLayer((capa) => { if (capa.closeTooltip) capa.closeTooltip(); });
}

function verMexico() {
  mapa.fitBounds(limitesMexico, { animate: false });
}

function moverMapa() {
  if (!mapa) return;
  if (estado.campus) {
    const c = campusPorId[estado.campus];
    mapa.setView([c.lat, c.lng], 15, { animate: false });
    dibujarPines();
    marcadores[estado.campus].openTooltip();
  } else {
    cerrarLetreros();
    verMexico();
  }
}

if (window.L && typeof ESTADOS_MEXICO !== "undefined") {
  mapa = L.map("mapa", {
    scrollWheelZoom: false,
    maxZoom: 18,
    zoomSnap: 0.25,
    attributionControl: false,
  });
  L.control.attribution({ prefix: false }).addTo(mapa);

  // Estados que tienen al menos un campus se pintan de azul claro
  ESTADOS_MEXICO.features.forEach((f) => {
    f.properties.conCampus = todosLosCampus.some((c) =>
      f.geometry.coordinates.some((poligono) => dentro([c.lng, c.lat], poligono[0])));
  });
  capaEstados = L.geoJSON(ESTADOS_MEXICO, { style: (f) => estiloEstado(f, false), interactive: false }).addTo(mapa);
  limitesMexico = capaEstados.getBounds();

  // Calles (solo de cerca). Esri funciona aunque la página se abra con doble clic.
  calles = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", {
    attribution: "Mapa &copy; Esri, HERE, Garmin, OpenStreetMap",
    maxZoom: 18,
    className: "capa-calles",
  });
  let cargados = 0;
  let fallidos = 0;
  calles.on("tileload", () => {
    cargados++;
    document.getElementById("mapa-aviso").hidden = true;
  });
  calles.on("tileerror", () => {
    fallidos++;
    if (fallidos >= 6 && cargados === 0) document.getElementById("mapa-aviso").hidden = false;
  });

  // Tapa todo lo que está fuera de México (Estados Unidos, Guatemala, etc.)
  mapa.createPane("mascara").style.zIndex = 390;
  const afuera = [[0, -140], [0, -70], [45, -70], [45, -140]];
  const huecos = ESTADOS_MEXICO.features.flatMap((f) =>
    f.geometry.coordinates.map((poligono) => poligono[0].map(([lng, lat]) => [lat, lng])));
  mascara = L.polygon([afuera, ...huecos], {
    pane: "mascara",
    stroke: false,
    fillColor: "#e9eff8",
    fillOpacity: 1,
    interactive: false,
  });

  verMexico();
  mapa.setMinZoom(mapa.getZoom());
  mapa.setMaxBounds(limitesMexico.pad(0.2));
  mapa.on("resize", () => mapa.setMinZoom(mapa.getBoundsZoom(limitesMexico)));

  capaPines = L.layerGroup().addTo(mapa);
  todosLosCampus.forEach((c) => {
    const marcador = L.marker([c.lat, c.lng], { icon: icono(c.id), title: nombreCampus(c.id) });
    marcador.bindTooltip(`<strong>${limpiar(nombreCampus(c.id))}</strong><br>${limpiar(c.ciudad)}`, {
      direction: "top", offset: [0, -12], className: "tooltip-mapa",
    });
    marcador.on("click", () => elegirCampus(c.id, true));
    marcadores[c.id] = marcador;
  });

  mapa.on("zoomend", () => { dibujarPines(); actualizarCapas(); });
  document.getElementById("ver-mexico").addEventListener("click", () => {
    cerrarLetreros();
    verMexico();
  });
  dibujarPines();
  actualizarCapas();
} else {
  document.getElementById("mapa").innerHTML =
    '<p class="vacio">No se pudo cargar el mapa. Usa la lista de campus.</p>';
  document.querySelector(".leyenda").hidden = true;
}

// ----- Lista de campus junto al mapa y selector del encabezado -----
const selectorCampus = document.getElementById("selector-campus");
todosLosCampus.forEach((c) => {
  const opcion = document.createElement("option");
  opcion.value = c.id;
  opcion.textContent = nombreCampus(c.id);
  selectorCampus.appendChild(opcion);
});
selectorCampus.addEventListener("change", () => elegirCampus(selectorCampus.value, true));
document.getElementById("quitar-campus").addEventListener("click", () => elegirCampus("", false));

const listaCampus = document.getElementById("lista-campus");
listaCampus.addEventListener("click", (evento) => {
  const boton = evento.target.closest(".campus-boton");
  if (boton) elegirCampus(boton.dataset.campus, true);
});

function mostrarListaCampus() {
  const regiones = ["Norte", "Centro"];
  listaCampus.innerHTML = regiones.map((region) => {
    const botones = todosLosCampus.filter((c) => c.region === region).map((c) => {
      const total = todasLasPublicaciones.filter((p) => p.campus === c.id).length;
      const activo = c.id === estado.campus;
      return `
        <button type="button" class="campus-boton${activo ? " activo" : ""}" data-campus="${limpiar(c.id)}" aria-pressed="${activo}">
          <span>${limpiar(c.nombre)}</span>
          <small${total ? ` aria-label="${total} publicaciones"` : ""}>${total || ""}</small>
        </button>`;
    }).join("");
    return botones ? `<h3>${region} de México</h3><div class="campus-botones">${botones}</div>` : "";
  }).join("");
}

// ----- Registro con filtros -----
const listaRegistro = document.getElementById("lista-registro");
const selectSociedad = document.getElementById("filtro-sociedad");
const inputTexto = document.getElementById("filtro-texto");
const botonesTipo = document.querySelectorAll(".chip");

function llenarSociedades() {
  const elegida = selectSociedad.value;
  selectSociedad.innerHTML = '<option value="">Todas las sociedades</option>';
  delCampus(todasLasSociedades).forEach((s) => {
    const opcion = document.createElement("option");
    opcion.value = claveSociedad(s);
    opcion.textContent = estado.campus ? s.nombre : `${s.nombre} · ${campusPorId[s.campus].nombre}`;
    selectSociedad.appendChild(opcion);
  });
  const existe = [...selectSociedad.options].some((o) => o.value === elegida);
  selectSociedad.value = existe ? elegida : "";
}

function mostrarRegistro() {
  const buscar = normalizar(inputTexto.value.trim());
  const sociedad = selectSociedad.value;

  const resultados = [...delCampus(todasLasPublicaciones)].sort(porFechaNueva).filter((p) => {
    if (estado.tipo !== "todo" && p.tipo !== estado.tipo) return false;
    if (sociedad && claveSociedad(p) !== sociedad) return false;
    if (buscar) {
      const todo = normalizar(`${p.titulo} ${p.sociedad} ${p.descripcion} ${p.lugar} ${nombreCampus(p.campus)}`);
      if (!todo.includes(buscar)) return false;
    }
    return true;
  });

  if (resultados.length === 0) {
    listaRegistro.innerHTML = '<li class="sin-resultados"><p class="vacio">No encontramos nada con esos filtros.</p></li>';
    return;
  }

  listaRegistro.innerHTML = resultados.map((p) => `
    <li>
      <time datetime="${p.fecha}">${fechaLarga(p.fecha)}</time>
      <span class="tipo tipo-${p.tipo}">${p.tipo === "logro" ? "Logro" : "Evento"}</span>
      <div>
        <strong>${limpiar(p.titulo)}</strong>
        <p class="meta">${limpiar([p.sociedad, nombreCampus(p.campus)].filter(Boolean).join(" · "))}</p>
        <p>${limpiar(p.descripcion)}</p>
      </div>
    </li>`).join("");
}

botonesTipo.forEach((boton) => {
  boton.addEventListener("click", () => {
    botonesTipo.forEach((b) => {
      b.classList.toggle("activo", b === boton);
      b.setAttribute("aria-pressed", b === boton);
    });
    estado.tipo = boton.dataset.tipo;
    mostrarRegistro();
  });
});
selectSociedad.addEventListener("change", mostrarRegistro);
inputTexto.addEventListener("input", mostrarRegistro);

// ----- Dibujar toda la página -----
function render() {
  const publicaciones = delCampus(todasLasPublicaciones);
  const sociedades = delCampus(todasLasSociedades);
  const eventosProximos = publicaciones
    .filter((p) => p.tipo === "evento" && leerFecha(p.fecha) >= hoy)
    .sort(porFechaVieja);
  const logros = publicaciones.filter((p) => p.tipo === "logro").sort(porFechaNueva);
  const campus = campusPorId[estado.campus];

  // Aviso y selector
  document.getElementById("aviso-campus").hidden = !campus;
  document.getElementById("aviso-nombre").textContent = nombreCampus(estado.campus);
  selectorCampus.value = estado.campus;
  document.querySelectorAll(".donde").forEach((el) => {
    el.textContent = campus ? ` · ${campus.nombre}` : "";
  });

  // Cifras
  document.getElementById("cifra-campus").textContent = campus ? 1 : todosLosCampus.length;
  document.getElementById("cifra-sociedades").textContent = sociedades.length;
  document.getElementById("cifra-logros").textContent = logros.length;
  document.getElementById("cifra-eventos").textContent = eventosProximos.length;

  // Destacado de la portada
  const destacado = logros[0] || eventosProximos[0];
  document.getElementById("destacado").innerHTML = destacado ? `
    <span class="destacado-ceja">${destacado.tipo === "logro" ? "Último logro" : "Próximo evento"}</span>
    <h2>${limpiar(destacado.titulo)}</h2>
    <p>${limpiar(destacado.descripcion)}</p>
    <p class="meta">${limpiar([destacado.sociedad, nombreCampus(destacado.campus)].filter(Boolean).join(" · "))}</p>
    <time datetime="${destacado.fecha}">${fechaLarga(destacado.fecha)}</time>` : `
    <span class="destacado-ceja">${campus ? limpiar(nombreCampus(estado.campus)) : "Sin publicaciones"}</span>
    <h2>Todavía no hay nada publicado aquí.</h2>
    <p><a href="#publicar">Sé la primera sociedad en publicar.</a></p>`;

  // Próximos eventos
  document.getElementById("lista-eventos").innerHTML = eventosProximos.length === 0
    ? vacio("No hay eventos próximos por ahora.")
    : eventosProximos.slice(0, 6).map((e) => {
      const fecha = leerFecha(e.fecha);
      const mes = fecha.toLocaleDateString("es-MX", { month: "short" }).replace(".", "");
      return `
        <article class="evento">
          <div class="evento-fecha">
            <strong>${fecha.getDate()}</strong>
            <span>${mes}</span>
          </div>
          <div class="evento-cuerpo">
            <span class="faltan">${faltan(e.fecha)}</span>
            <h3>${limpiar(e.titulo)}</h3>
            <p class="meta">${limpiar([e.sociedad, nombreCampus(e.campus)].filter(Boolean).join(" · "))}</p>
            <p class="detalles">${limpiar([e.hora, e.lugar].filter(Boolean).join(" · "))}</p>
            <p>${limpiar(e.descripcion)}</p>
          </div>
        </article>`;
    }).join("");

  // Logros
  document.getElementById("lista-logros").innerHTML = logros.length === 0
    ? vacio("Todavía no hay logros publicados.")
    : logros.slice(0, 6).map((l) => `
      <article class="logro">
        <div class="logro-imagen">
          <span>${limpiar(campusPorId[l.campus].nombre)}</span>
          ${l.imagen ? `<img src="${limpiar(l.imagen)}" alt="" loading="lazy" onerror="this.remove()">` : ""}
        </div>
        <div class="logro-cuerpo">
          <p class="meta">${limpiar(l.sociedad)}</p>
          <h3>${limpiar(l.titulo)}</h3>
          <p>${limpiar(l.descripcion)}</p>
          <time datetime="${l.fecha}">${fechaLarga(l.fecha)} · ${limpiar(nombreCampus(l.campus))}</time>
        </div>
      </article>`).join("");

  // Sociedades
  document.getElementById("lista-sociedades").innerHTML = sociedades.length === 0
    ? vacio("Este campus todavía no tiene sociedades registradas.")
    : sociedades.map((s) => {
      const total = todasLasPublicaciones.filter((p) => claveSociedad(p) === claveSociedad(s)).length;
      return `
        <article class="sociedad">
          <span class="sociedad-inicial">${limpiar(inicial(s.nombre))}</span>
          <div>
            <h3>${limpiar(s.nombre)}</h3>
            <p class="meta">${limpiar(nombreCampus(s.campus))}</p>
            <p>${limpiar(s.descripcion)}</p>
            <small>${total} ${total === 1 ? "publicación" : "publicaciones"}</small>
          </div>
        </article>`;
    }).join("");

  // Registro, lista de campus y mapa
  llenarSociedades();
  mostrarRegistro();
  mostrarListaCampus();
  if (mapa) {
    Object.keys(marcadores).forEach((id) => marcadores[id].setIcon(icono(id)));
    dibujarPines();
  }
}

// Si el enlace trae un campus (ej. index.html#campus=cumbres), lo abrimos directo
function campusDelEnlace() {
  if (!location.hash.startsWith("#campus=")) return "";
  const id = decodeURIComponent(location.hash.slice(8));
  return campusPorId[id] ? id : "";
}

window.addEventListener("hashchange", () => {
  const id = campusDelEnlace();
  if (id && id !== estado.campus) elegirCampus(id, true);
});

estado.campus = campusDelEnlace();
render();
moverMapa();
