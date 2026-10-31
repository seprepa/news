// =====================================================
//  AQUÍ SE EDITA EL CONTENIDO DE LA PÁGINA
//  No necesitas tocar ningún otro archivo para agregar
//  sociedades, logros o eventos. Solo copia un bloque
//  { ... }, pégalo abajo del último y cambia los textos.
//
//  campus: usa el "id" del campus que está en campus.js
//          ejemplo → "ciudad-de-mexico", "cumbres", "guadalajara"
//  fecha:  va así "AÑO-MES-DÍA"  →  "2026-11-14"
//  imagen: (opcional) guarda la foto en la carpeta "imagenes"
//          y pon su nombre → "imagenes/expo.jpg"
//
//  Los eventos que ya pasaron se quedan en el Registro
//  automáticamente.
// =====================================================

const SOCIEDADES = [
  {
    nombre: "Sociedad de Robótica (ejemplo)",
    campus: "ciudad-de-mexico",
    descripcion: "Diseñamos y construimos robots para competencias.",
  },
  {
    nombre: "Sociedad de Debate (ejemplo)",
    campus: "cumbres",
    descripcion: "Practicamos oratoria y argumentación.",
  },
  {
    nombre: "Sociedad de Arte (ejemplo)",
    campus: "guadalajara",
    descripcion: "Pintura, fotografía y todo lo creativo.",
  },
  {
    nombre: "Sociedad de Emprendimiento (ejemplo)",
    campus: "queretaro",
    descripcion: "Ideas de negocio y proyectos con impacto.",
  },
  {
    nombre: "Sociedad Ambiental (ejemplo)",
    campus: "ciudad-de-mexico",
    descripcion: "Reforestación, reciclaje y campañas en el campus.",
  },
];

const PUBLICACIONES = [
  // ----- EVENTOS -----
  {
    tipo: "evento",
    titulo: "Torneo interno de debate",
    sociedad: "Sociedad de Debate (ejemplo)",
    campus: "cumbres",
    fecha: "2026-11-12",
    hora: "4:00 pm",
    lugar: "Auditorio",
    descripcion: "Equipos de 3 personas. Inscripciones abiertas hasta el 10 de noviembre.",
  },
  {
    tipo: "evento",
    titulo: "Expo de robots",
    sociedad: "Sociedad de Robótica (ejemplo)",
    campus: "ciudad-de-mexico",
    fecha: "2026-11-20",
    hora: "11:00 am",
    lugar: "Explanada principal",
    descripcion: "Ven a ver los robots que construimos este semestre.",
  },
  {
    tipo: "evento",
    titulo: "Jornada de reforestación",
    sociedad: "Sociedad Ambiental (ejemplo)",
    campus: "ciudad-de-mexico",
    fecha: "2026-11-08",
    hora: "8:00 am",
    lugar: "Salida desde la entrada principal",
    descripcion: "Vamos a plantar 200 árboles. Trae ropa cómoda y agua.",
  },
  {
    tipo: "evento",
    titulo: "Bazar de emprendedores",
    sociedad: "Sociedad de Emprendimiento (ejemplo)",
    campus: "queretaro",
    fecha: "2026-12-03",
    hora: "12:00 pm",
    lugar: "Cafetería",
    descripcion: "Proyectos de estudiantes a la venta. Trae efectivo.",
  },
  {
    tipo: "evento",
    titulo: "Taller de fotografía con celular",
    sociedad: "Sociedad de Arte (ejemplo)",
    campus: "guadalajara",
    fecha: "2026-10-02",
    hora: "3:00 pm",
    lugar: "Salón 204",
    descripcion: "Aprendimos composición y edición básica.",
  },

  // ----- LOGROS -----
  {
    tipo: "logro",
    titulo: "Segundo lugar en competencia regional de robótica",
    sociedad: "Sociedad de Robótica (ejemplo)",
    campus: "ciudad-de-mexico",
    fecha: "2026-10-18",
    descripcion: "El equipo quedó en segundo lugar entre 24 escuelas.",
  },
  {
    tipo: "logro",
    titulo: "Mural terminado en la biblioteca",
    sociedad: "Sociedad de Arte (ejemplo)",
    campus: "guadalajara",
    fecha: "2026-09-27",
    descripcion: "Después de 6 semanas de trabajo, el mural ya está listo.",
  },
  {
    tipo: "logro",
    titulo: "Mejor oradora del torneo estatal",
    sociedad: "Sociedad de Debate (ejemplo)",
    campus: "cumbres",
    fecha: "2026-09-10",
    descripcion: "Una de nuestras integrantes fue reconocida como mejor oradora.",
  },
  {
    tipo: "logro",
    titulo: "Más de 500 kg de material reciclado",
    sociedad: "Sociedad Ambiental (ejemplo)",
    campus: "ciudad-de-mexico",
    fecha: "2026-08-29",
    descripcion: "Gracias a la campaña de reciclaje del primer parcial.",
  },
];
