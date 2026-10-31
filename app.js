// Este archivo arma la página con lo que hay en campus.js y contenido.js.
// Normalmente no necesitas modificarlo.

const hoy = new Date();
hoy.setHours(0, 0, 0, 0);

const estado = { campus: "", tipo: "todo" };
const campusPorId = Object.fromEntries(CAMPUS.map((c) => [c.id, c]));

// ----- Ayudantes -----
function leerFecha(texto) {
  const [anio, mes, dia] = texto.split("-").map(Number);
  return new Date(anio, mes - 1, dia);
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

function nombreCampus(id) {
  return campusPorId[id] ? `PrepaTec ${campusPorId[id].nombre}` : "";
}

function delCampus(lista) {
  return estado.campus ? lista.filter((x) => x.campus === estado.campus) : lista;
}

const porFechaNueva = (a, b) => leerFecha(b.fecha) - leerFecha(a.fecha);
const porFechaVieja = (a, b) => leerFecha(a.fecha) - leerFecha(b.fecha);

function vacio(texto) {
  return `<p class="vacio">${texto} <a href="#publicar">¿Tu sociedad quiere ser la primera?</a></p>`;
}

// ----- Elegir campus -----
function elegirCampus(id, irAEventos) {
  estado.campus = campusPorId[id] ? id : "";
  document.getElementById("filtro-sociedad").value = "";
  try {
    history.replaceState(null, "", estado.campus ? `#campus=${estado.campus}` : location.pathname);
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
  const total = PUBLICACIONES.filter((p) => p.campus === id).length;
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
  CAMPUS.forEach((c) => {
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
    const grupo = L.marker([lat, lng], { icon: iconoGrupo(g.campus.length, activo), zIndexOffset: 200 });
    grupo.bindTooltip(
      `<strong>${g.campus.length} campus</strong><br>${g.campus.map((c) => limpiar(c.nombre)).join("<br>")}<br><em>Toca para acercar</em>`,
      { direction: "top", offset: [0, -18], className: "tooltip-mapa" });
    grupo.on("click", () => {
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
    f.properties.conCampus = CAMPUS.some((c) =>
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
  calles.on("tileload", () => { cargados++; });
  calles.on("tileerror", () => {
    fallidos++;
    if (fallidos === 6 && cargados === 0) document.getElementById("mapa-aviso").hidden = false;
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
  CAMPUS.forEach((c) => {
    const marcador = L.marker([c.lat, c.lng], { icon: icono(c.id), title: nombreCampus(c.id) });
    marcador.bindTooltip(`<strong>${nombreCampus(c.id)}</strong><br>${c.ciudad}`, {
      direction: "top", offset: [0, -12], className: "tooltip-mapa",
    });
    marcador.on("click", () => elegirCampus(c.id, true));
    marcadores[c.id] = marcador;
  });

  mapa.on("zoomend", () => { dibujarPines(); actualizarCapas(); });
  document.getElementById("ver-mexico").addEventListener("click", () => {
    mapa.closeTooltip();
    verMexico();
  });
  dibujarPines();
  actualizarCapas();
} else {
  document.getElementById("mapa").innerHTML =
    '<p class="vacio">No se pudo cargar el mapa. Usa la lista de campus.</p>';
}

// ----- Lista de campus junto al mapa y selector del encabezado -----
const selectorCampus = document.getElementById("selector-campus");
CAMPUS.forEach((c) => {
  const opcion = document.createElement("option");
  opcion.value = c.id;
  opcion.textContent = nombreCampus(c.id);
  selectorCampus.appendChild(opcion);
});
selectorCampus.addEventListener("change", () => elegirCampus(selectorCampus.value, true));
document.getElementById("quitar-campus").addEventListener("click", () => elegirCampus("", false));

function mostrarListaCampus() {
  const regiones = ["Norte", "Centro"];
  document.getElementById("lista-campus").innerHTML = regiones.map((region) => {
    const botones = CAMPUS.filter((c) => c.region === region).map((c) => {
      const total = PUBLICACIONES.filter((p) => p.campus === c.id).length;
      return `
        <button type="button" class="campus-boton${c.id === estado.campus ? " activo" : ""}" data-campus="${c.id}">
          <span>${limpiar(c.nombre)}</span>
          <small>${total || ""}</small>
        </button>`;
    }).join("");
    return `<h3>${region} de México</h3><div class="campus-botones">${botones}</div>`;
  }).join("");

  document.querySelectorAll(".campus-boton").forEach((boton) => {
    boton.addEventListener("click", () => elegirCampus(boton.dataset.campus, true));
  });
}

// ----- Registro con filtros -----
const listaRegistro = document.getElementById("lista-registro");
const selectSociedad = document.getElementById("filtro-sociedad");
const inputTexto = document.getElementById("filtro-texto");
const botonesTipo = document.querySelectorAll(".chip");

function llenarSociedades() {
  const elegida = selectSociedad.value;
  selectSociedad.innerHTML = '<option value="">Todas las sociedades</option>';
  delCampus(SOCIEDADES).forEach((s) => {
    const opcion = document.createElement("option");
    opcion.value = s.nombre;
    opcion.textContent = s.nombre;
    selectSociedad.appendChild(opcion);
  });
  selectSociedad.value = elegida;
}

function mostrarRegistro() {
  const buscar = inputTexto.value.trim().toLowerCase();
  const sociedad = selectSociedad.value;

  const resultados = [...delCampus(PUBLICACIONES)].sort(porFechaNueva).filter((p) => {
    if (estado.tipo !== "todo" && p.tipo !== estado.tipo) return false;
    if (sociedad && p.sociedad !== sociedad) return false;
    if (buscar) {
      const todo = `${p.titulo} ${p.sociedad} ${p.descripcion} ${nombreCampus(p.campus)}`.toLowerCase();
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
        <p class="meta">${limpiar(p.sociedad)} · ${limpiar(nombreCampus(p.campus))}</p>
        <p>${limpiar(p.descripcion)}</p>
      </div>
    </li>`).join("");
}

botonesTipo.forEach((boton) => {
  boton.addEventListener("click", () => {
    botonesTipo.forEach((b) => b.classList.remove("activo"));
    boton.classList.add("activo");
    estado.tipo = boton.dataset.tipo;
    mostrarRegistro();
  });
});
selectSociedad.addEventListener("change", mostrarRegistro);
inputTexto.addEventListener("input", mostrarRegistro);

// ----- Dibujar toda la página -----
function render() {
  const publicaciones = delCampus(PUBLICACIONES);
  const sociedades = delCampus(SOCIEDADES);
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
  document.getElementById("cifra-campus").textContent = campus ? 1 : CAMPUS.length;
  document.getElementById("cifra-sociedades").textContent = sociedades.length;
  document.getElementById("cifra-logros").textContent = logros.length;
  document.getElementById("cifra-eventos").textContent = eventosProximos.length;

  // Destacado de la portada
  const destacado = logros[0] || eventosProximos[0];
  document.getElementById("destacado").innerHTML = destacado ? `
    <span class="destacado-ceja">${destacado.tipo === "logro" ? "Último logro" : "Próximo evento"}</span>
    <h2>${limpiar(destacado.titulo)}</h2>
    <p>${limpiar(destacado.descripcion)}</p>
    <p class="meta">${limpiar(destacado.sociedad)} · ${limpiar(nombreCampus(destacado.campus))}</p>
    <time>${fechaLarga(destacado.fecha)}</time>` : `
    <span class="destacado-ceja">${campus ? nombreCampus(estado.campus) : "Sin publicaciones"}</span>
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
            <p class="meta">${limpiar(e.sociedad)} · ${limpiar(nombreCampus(e.campus))}</p>
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
          ${l.imagen
            ? `<img src="${limpiar(l.imagen)}" alt="" loading="lazy">`
            : `<span>${limpiar(campusPorId[l.campus] ? campusPorId[l.campus].nombre : "")}</span>`}
        </div>
        <div class="logro-cuerpo">
          <p class="meta">${limpiar(l.sociedad)}</p>
          <h3>${limpiar(l.titulo)}</h3>
          <p>${limpiar(l.descripcion)}</p>
          <time>${fechaLarga(l.fecha)} · ${limpiar(nombreCampus(l.campus))}</time>
        </div>
      </article>`).join("");

  // Sociedades
  document.getElementById("lista-sociedades").innerHTML = sociedades.length === 0
    ? vacio("Este campus todavía no tiene sociedades registradas.")
    : sociedades.map((s) => {
      const total = PUBLICACIONES.filter((p) => p.sociedad === s.nombre).length;
      return `
        <article class="sociedad">
          <span class="sociedad-inicial">${limpiar(s.nombre.replace(/^Sociedad (de |del )?/i, "").charAt(0))}</span>
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
  Object.keys(marcadores).forEach((id) => marcadores[id].setIcon(icono(id)));
  if (mapa) dibujarPines();
}

// Si el enlace trae un campus (ej. index.html#campus=cumbres), lo abrimos directo
const campusInicial = location.hash.startsWith("#campus=") ? location.hash.slice(8) : "";
estado.campus = campusPorId[campusInicial] ? campusInicial : "";
render();
moverMapa();
