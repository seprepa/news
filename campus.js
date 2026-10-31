// =====================================================
//  LISTA DE CAMPUS DE PREPATEC (los puntos del mapa)
//  Fuente: directorio oficial tec.mx/es/directorio
//  "id" es el nombre corto que se usa en contenido.js.
//  "lat" y "lng" son la ubicación aproximada en el mapa.
// =====================================================

const CAMPUS = [
  // ----- Norte de México -----
  { id: "chihuahua",         nombre: "Chihuahua",             ciudad: "Chihuahua, Chih.",       region: "Norte",  lat: 28.676, lng: -106.080 },
  { id: "ciudad-juarez",     nombre: "Ciudad Juárez",         ciudad: "Ciudad Juárez, Chih.",   region: "Norte",  lat: 31.712, lng: -106.400 },
  { id: "ciudad-obregon",    nombre: "Ciudad Obregón",        ciudad: "Ciudad Obregón, Son.",   region: "Norte",  lat: 27.492, lng: -109.951 },
  { id: "cumbres",           nombre: "Cumbres",               ciudad: "Monterrey, N.L.",        region: "Norte",  lat: 25.731, lng: -100.409 },
  { id: "garza-laguera",     nombre: "Eugenio Garza Lagüera", ciudad: "Monterrey, N.L.",        region: "Norte",  lat: 25.645, lng: -100.335 },
  { id: "garza-sada",        nombre: "Eugenio Garza Sada",    ciudad: "Monterrey, N.L.",        region: "Norte",  lat: 25.627, lng: -100.278 },
  { id: "laguna",            nombre: "Laguna",                ciudad: "Torreón, Coah.",         region: "Norte",  lat: 25.555, lng: -103.396 },
  { id: "navojoa",           nombre: "Navojoa",               ciudad: "Navojoa, Son.",          region: "Norte",  lat: 27.081, lng: -109.444 },
  { id: "saltillo",          nombre: "Saltillo",              ciudad: "Saltillo, Coah.",        region: "Norte",  lat: 25.454, lng: -100.974 },
  { id: "san-luis-potosi",   nombre: "San Luis Potosí",       ciudad: "San Luis Potosí, S.L.P.", region: "Norte", lat: 22.137, lng: -101.025 },
  { id: "santa-catarina",    nombre: "Santa Catarina",        ciudad: "Santa Catarina, N.L.",   region: "Norte",  lat: 25.676, lng: -100.459 },
  { id: "sinaloa",           nombre: "Sinaloa",               ciudad: "Culiacán, Sin.",         region: "Norte",  lat: 24.792, lng: -107.399 },
  { id: "sonora-norte",      nombre: "Sonora Norte",          ciudad: "Hermosillo, Son.",       region: "Norte",  lat: 29.098, lng: -110.973 },
  { id: "valle-alto",        nombre: "Valle Alto",            ciudad: "Monterrey, N.L.",        region: "Norte",  lat: 25.573, lng: -100.246 },

  // ----- Centro de México -----
  { id: "chiapas",           nombre: "Chiapas",               ciudad: "Tuxtla Gutiérrez, Chis.", region: "Centro", lat: 16.754, lng: -93.148 },
  { id: "ciudad-de-mexico",  nombre: "Ciudad de México",      ciudad: "Tlalpan, CDMX",          region: "Centro", lat: 19.284, lng: -99.137 },
  { id: "cuernavaca",        nombre: "Cuernavaca",            ciudad: "Cuernavaca, Mor.",       region: "Centro", lat: 18.807, lng: -99.222 },
  { id: "esmeralda",         nombre: "Esmeralda",             ciudad: "Atizapán, Edo. Méx.",    region: "Centro", lat: 19.568, lng: -99.263 },
  { id: "estado-de-mexico",  nombre: "Estado de México",      ciudad: "Atizapán, Edo. Méx.",    region: "Centro", lat: 19.594, lng: -99.227 },
  { id: "guadalajara",       nombre: "Guadalajara",           ciudad: "Zapopan, Jal.",          region: "Centro", lat: 20.735, lng: -103.454 },
  { id: "hidalgo",           nombre: "Hidalgo",               ciudad: "Pachuca, Hgo.",          region: "Centro", lat: 20.110, lng: -98.756 },
  { id: "irapuato",          nombre: "Irapuato",              ciudad: "Irapuato, Gto.",         region: "Centro", lat: 20.680, lng: -101.345 },
  { id: "leon",              nombre: "León",                  ciudad: "León, Gto.",             region: "Centro", lat: 21.161, lng: -101.664 },
  { id: "metepec",           nombre: "Metepec",               ciudad: "Metepec, Edo. Méx.",     region: "Centro", lat: 19.256, lng: -99.590 },
  { id: "puebla",            nombre: "Puebla",                ciudad: "Puebla, Pue.",           region: "Centro", lat: 19.047, lng: -98.240 },
  { id: "queretaro",         nombre: "Querétaro",             ciudad: "Querétaro, Qro.",        region: "Centro", lat: 20.613, lng: -100.406 },
  { id: "santa-anita",       nombre: "Santa Anita",           ciudad: "Tlajomulco, Jal.",       region: "Centro", lat: 20.560, lng: -103.437 },
  { id: "santa-fe",          nombre: "Santa Fe",              ciudad: "Santa Fe, CDMX",         region: "Centro", lat: 19.359, lng: -99.259 },
  { id: "toluca",            nombre: "Toluca",                ciudad: "Toluca, Edo. Méx.",      region: "Centro", lat: 19.282, lng: -99.645 },
];
