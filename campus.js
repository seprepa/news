// =====================================================
//  LISTA DE CAMPUS DE PREPATEC (los puntos del mapa)
//  Campus: directorio oficial tec.mx/es/directorio
//  Ubicaciones: OpenStreetMap y direcciones oficiales del Tec
//  "id" es el nombre corto que se usa en contenido.js.
//  "lat" y "lng" son la ubicación exacta del campus.
// =====================================================

const CAMPUS = [
  // ----- Norte de México -----
  { id: "chihuahua",         nombre: "Chihuahua",             ciudad: "Chihuahua, Chih.",        region: "Norte",  lat: 28.67446, lng: -106.07669 },
  { id: "ciudad-juarez",     nombre: "Ciudad Juárez",         ciudad: "Ciudad Juárez, Chih.",    region: "Norte",  lat: 31.71717, lng: -106.39333 },
  { id: "ciudad-obregon",    nombre: "Ciudad Obregón",        ciudad: "Ciudad Obregón, Son.",    region: "Norte",  lat: 27.53169, lng: -109.94382 },
  { id: "cumbres",           nombre: "Cumbres",               ciudad: "Monterrey, N.L.",         region: "Norte",  lat: 25.73378, lng: -100.41588 },
  { id: "garza-laguera",     nombre: "Eugenio Garza Lagüera", ciudad: "Las Brisas, Monterrey, N.L.", region: "Norte", lat: 25.61776, lng: -100.27436 },
  { id: "garza-sada",        nombre: "Eugenio Garza Sada",    ciudad: "Del Carmen, Monterrey, N.L.", region: "Norte", lat: 25.67023, lng: -100.35755 },
  { id: "laguna",            nombre: "Laguna",                ciudad: "Torreón, Coah.",          region: "Norte",  lat: 25.51561, lng: -103.39803 },
  { id: "navojoa",           nombre: "Navojoa",               ciudad: "Navojoa, Son.",           region: "Norte",  lat: 27.10033, lng: -109.45482 },
  { id: "saltillo",          nombre: "Saltillo",              ciudad: "Saltillo, Coah.",         region: "Norte",  lat: 25.44739, lng: -100.97529 },
  { id: "san-luis-potosi",   nombre: "San Luis Potosí",       ciudad: "San Luis Potosí, S.L.P.", region: "Norte",  lat: 22.12731, lng: -101.03720 },
  { id: "santa-catarina",    nombre: "Santa Catarina",        ciudad: "Santa Catarina, N.L.",    region: "Norte",  lat: 25.66130, lng: -100.43073 },
  { id: "sinaloa",           nombre: "Sinaloa",               ciudad: "Culiacán, Sin.",          region: "Norte",  lat: 24.80135, lng: -107.42047 },
  { id: "sonora-norte",      nombre: "Sonora Norte",          ciudad: "Hermosillo, Son.",        region: "Norte",  lat: 29.17035, lng: -110.91045 },
  { id: "valle-alto",        nombre: "Valle Alto",            ciudad: "Monterrey, N.L.",         region: "Norte",  lat: 25.57043, lng: -100.24914 },

  // ----- Centro de México -----
  { id: "chiapas",           nombre: "Chiapas",               ciudad: "Tuxtla Gutiérrez, Chis.", region: "Centro", lat: 16.76540, lng: -93.20272 },
  { id: "ciudad-de-mexico",  nombre: "Ciudad de México",      ciudad: "Tlalpan, CDMX",           region: "Centro", lat: 19.28414, lng: -99.13547 },
  { id: "cuernavaca",        nombre: "Cuernavaca",            ciudad: "Xochitepec, Mor.",        region: "Centro", lat: 18.80606, lng: -99.22158 },
  { id: "esmeralda",         nombre: "Esmeralda",             ciudad: "Atizapán, Edo. Méx.",     region: "Centro", lat: 19.54567, lng: -99.28647 },
  { id: "estado-de-mexico",  nombre: "Estado de México",      ciudad: "Atizapán, Edo. Méx.",     region: "Centro", lat: 19.59535, lng: -99.22763 },
  { id: "guadalajara",       nombre: "Guadalajara",           ciudad: "Zapopan, Jal.",           region: "Centro", lat: 20.73375, lng: -103.45409 },
  { id: "hidalgo",           nombre: "Hidalgo",               ciudad: "Pachuca, Hgo.",           region: "Centro", lat: 20.09638, lng: -98.76505 },
  { id: "irapuato",          nombre: "Irapuato",              ciudad: "Irapuato, Gto.",          region: "Centro", lat: 20.68749, lng: -101.39504 },
  { id: "leon",              nombre: "León",                  ciudad: "León, Gto.",              region: "Centro", lat: 21.16570, lng: -101.71530 },
  { id: "metepec",           nombre: "Metepec",               ciudad: "Metepec, Edo. Méx.",      region: "Centro", lat: 19.27683, lng: -99.58015 },
  { id: "puebla",            nombre: "Puebla",                ciudad: "Puebla, Pue.",            region: "Centro", lat: 19.02056, lng: -98.24465 },
  { id: "queretaro",         nombre: "Querétaro",             ciudad: "Querétaro, Qro.",         region: "Centro", lat: 20.61329, lng: -100.40591 },
  { id: "santa-anita",       nombre: "Santa Anita",           ciudad: "Tlajomulco, Jal.",        region: "Centro", lat: 20.56873, lng: -103.48507 },
  { id: "santa-fe",          nombre: "Santa Fe",              ciudad: "Santa Fe, CDMX",          region: "Centro", lat: 19.35960, lng: -99.25881 },
  { id: "toluca",            nombre: "Toluca",                ciudad: "Zinacantepec, Edo. Méx.", region: "Centro", lat: 19.26945, lng: -99.70422 },
];
