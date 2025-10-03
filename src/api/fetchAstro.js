const API_BASE = "https://api.vedicastroapi.com/v3-json";
const API_KEY = import.meta.env.VITE_VEDIC_ASTRO_KEY;

/**
 * Utility function to format date from YYYY-MM-DD to DD/MM/YYYY
 */
const formatDate = (date) => date.split("-").reverse().join("/");

/**
 * Generic fetch helper
 */
const fetchApi = async (url, errorMsg) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${errorMsg}: ${res.status}`);
  return res.json();
};

/* --------------------- Panchang --------------------- */
export const fetchPanchangData = (date, time, lat, lon, tz = 5.5) =>
  fetchApi(
    `${API_BASE}/panchang/panchang?api_key=${API_KEY}&date=${formatDate(date)}&tz=${tz}&lat=${lat}&lon=${lon}&time=${time}&lang=en`,
    "Failed to fetch Panchang data"
  );

export const fetchSunrise = (date, time, lat, lon, tz = 5.5) =>
  fetchApi(
    `${API_BASE}/panchang/sunrise?api_key=${API_KEY}&date=${formatDate(date)}&tz=${tz}&lat=${lat}&lon=${lon}&time=${time}&lang=en`,
    "Failed to fetch Sunrise data"
  );

export const fetchSunset = (date, time, lat, lon, tz = 5.5) =>
  fetchApi(
    `${API_BASE}/panchang/sunset?api_key=${API_KEY}&date=${formatDate(date)}&tz=${tz}&lat=${lat}&lon=${lon}&time=${time}&lang=en`,
    "Failed to fetch Sunset data"
  );

/* --------------------- Kundli & Horoscope --------------------- */
export const fetchKundliDetails = (dob, tob, lat, lon, tz = 5.5) =>
  fetchApi(
    `${API_BASE}/extended-horoscope/extended-kundli-details?api_key=${API_KEY}&dob=${formatDate(dob)}&tob=${tob}&lat=${lat}&lon=${lon}&tz=${tz}&lang=en`,
    "Failed to fetch Kundli details"
  );

export const fetchMoonSign = (dob, tob, lat, lon, tz = 5.5) =>
  fetchApi(
    `${API_BASE}/extended-horoscope/find-moon-sign?api_key=${API_KEY}&dob=${formatDate(dob)}&tob=${tob}&lat=${lat}&lon=${lon}&tz=${tz}&lang=en`,
    "Failed to fetch Moon Sign"
  );

export const fetchSunSign = (dob, tob, lat, lon, tz = 5.5) =>
  fetchApi(
    `${API_BASE}/extended-horoscope/find-sun-sign?api_key=${API_KEY}&dob=${formatDate(dob)}&tob=${tob}&lat=${lat}&lon=${lon}&tz=${tz}&lang=en`,
    "Failed to fetch Sun Sign"
  );

export const fetchAscendant = (dob, tob, lat, lon, tz = 5.5) =>
  fetchApi(
    `${API_BASE}/extended-horoscope/find-ascendant?api_key=${API_KEY}&dob=${formatDate(dob)}&tob=${tob}&lat=${lat}&lon=${lon}&tz=${tz}&lang=en`,
    "Failed to fetch Ascendant"
  );

/* --------------------- Chart Image & Divisional Charts --------------------- */
export async function fetchChartImage({
  dob,
  tob,
  lat,
  lon,
  tz = 5.5,
  div = "D1",
  style = "north",
  transit_date = "",
  size = 300,
  color = "%23ff850b3d",
  font_size = 15,
  font_style = "Nunito",
  colorful_planets = true,
  show_degree = true,
}) {
  const formattedDob = dob.split("-").reverse().join("/"); // DD/MM/YYYY
  const url = `${API_BASE}/horoscope/chart-image?api_key=${API_KEY}&dob=${formattedDob}&tob=${tob}&lat=${lat}&lon=${lon}&tz=${tz}&div=${div}&style=${style}&transit_date=${transit_date}&size=${size}&color=${color}&font_size=${font_size}&font_style=${font_style}&colorful_planets=${colorful_planets}&show_degree=${show_degree}&format=base64&lang=en&stroke=2`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch chart image: ${res.status}`);
  const svgText = await res.text(); 
    return svgText; // base64 string
}

export const fetchDivisionalChart = ({
  dob,
  tob,
  lat,
  lon,
  tz = 5.5,
  div = "D1",
  transit_date = "",
  response_type = "planet_object",
}) =>
  fetchApi(
    `${API_BASE}/horoscope/divisional-charts?api_key=${API_KEY}&dob=${formatDate(dob)}&tob=${tob}&lat=${lat}&lon=${lon}&tz=${tz}&div=${div}&transit_date=${transit_date}&response_type=${response_type}&lang=en`,
    `Failed to fetch divisional chart (${div})`
  );

/* --------------------- Dashas --------------------- */
export const fetchMahaDasha = (dob, tob, lat, lon, tz = 5.5) =>
  fetchApi(
    `${API_BASE}/dashas/maha-dasha?api_key=${API_KEY}&dob=${formatDate(dob)}&tob=${tob}&lat=${lat}&lon=${lon}&tz=${tz}&lang=en`,
    "Failed to fetch Maha Dasha"
  );

export const fetchAntarDasha = (dob, tob, lat, lon, tz = 5.5) =>
  fetchApi(
    `${API_BASE}/dashas/antar-dasha?api_key=${API_KEY}&dob=${formatDate(dob)}&tob=${tob}&lat=${lat}&lon=${lon}&tz=${tz}&lang=en`,
    "Failed to fetch Antar Dasha"
  );

export const fetchMahaDashaPredictions = (dob, tob, lat, lon, tz = 5.5, lang = "en") =>
  fetchApi(
    `${API_BASE}/dashas/maha-dasha-predictions?api_key=${API_KEY}&dob=${formatDate(dob)}&tob=${tob}&lat=${lat}&lon=${lon}&tz=${tz}&lang=${lang}`,
    "Failed to fetch Mahadasha Predictions"
  );

/* --------------------- Ashtakvarga --------------------- */
export const fetchAshtakvarga = (dob, tob, lat, lon, planet, tz = 5.5, lang = "en") =>
  fetchApi(
    `${API_BASE}/horoscope/ashtakvarga?api_key=${API_KEY}&dob=${formatDate(dob)}&tob=${tob}&lat=${lat}&lon=${lon}&tz=${tz}&planet=${planet}&lang=${lang}`,
    `Failed to fetch Ashtakvarga for ${planet}`
  );

/* --------------------- Sade Sati --------------------- */
export const fetchSadeSatiTable = ({ dob, tob, lat, lon, tz = 5.5, lang = "en" }) =>
  fetchApi(
    `${API_BASE}/extended-horoscope/sade-sati-table?api_key=${API_KEY}&dob=${formatDate(dob)}&tob=${tob}&lat=${lat}&lon=${lon}&tz=${tz}&lang=${lang}`,
    "Failed to fetch Sade Sati Table"
  );

/* --------------------- Doshas --------------------- */
export const fetchMangalDosh = (dob, tob, lat, lon, tz = 5.5) =>
  fetchApi(
    `${API_BASE}/dosha/mangal-dosh?api_key=${API_KEY}&dob=${formatDate(dob)}&tob=${tob}&lat=${lat}&lon=${lon}&tz=${tz}&lang=en`,
    "Failed to fetch Mangal Dosh"
  );

export const fetchManglikDosh = (dob, tob, lat, lon, tz = 5.5) =>
  fetchApi(
    `${API_BASE}/dosha/manglik-dosh?api_key=${API_KEY}&dob=${formatDate(dob)}&tob=${tob}&lat=${lat}&lon=${lon}&tz=${tz}&lang=en`,
    "Failed to fetch Manglik Dosh"
  );

export const fetchKaalsarpDosh = (dob, tob, lat, lon, tz = 5.5) =>
  fetchApi(
    `${API_BASE}/dosha/kaalsarp-dosh?api_key=${API_KEY}&dob=${formatDate(dob)}&tob=${tob}&lat=${lat}&lon=${lon}&tz=${tz}&lang=en`,
    "Failed to fetch Kaalsarp Dosh"
  );

export const fetchPitraDosh = (dob, tob, lat, lon, tz = 5.5) =>
  fetchApi(
    `${API_BASE}/dosha/pitra-dosh?api_key=${API_KEY}&dob=${formatDate(dob)}&tob=${tob}&lat=${lat}&lon=${lon}&tz=${tz}&lang=en`,
    "Failed to fetch Pitra Dosh"
  );

export const fetchPapasamaya = (dob, tob, lat, lon, tz = 5.5) =>
  fetchApi(
    `${API_BASE}/dosha/papasamaya?api_key=${API_KEY}&dob=${formatDate(dob)}&tob=${tob}&lat=${lat}&lon=${lon}&tz=${tz}&lang=en`,
    "Failed to fetch Papasamaya"
  );

/* --------------------- Yoga List & Shad Bala --------------------- */
export const fetchYogaList = (dob, tob, lat, lon, tz = 5.5) =>
  fetchApi(
    `${API_BASE}/extended-horoscope/yoga-list?api_key=${API_KEY}&dob=${formatDate(dob)}&tob=${tob}&lat=${lat}&lon=${lon}&tz=${tz}&lang=en`,
    "Failed to fetch Yoga List"
  );

export const fetchShadBala = (dob, tob, lat, lon, tz = 5.5) =>
  fetchApi(
    `${API_BASE}/extended-horoscope/shad-bala?api_key=${API_KEY}&dob=${formatDate(dob)}&tob=${tob}&lat=${lat}&lon=${lon}&tz=${tz}&lang=en`,
    "Failed to fetch Shad Bala"
  );

  export const fetchPlanetReport = ({
  dob,
  tob,
  lat,
  lon,
  tz = 5.5,
  planet,
  lang = "en",
}) =>
  fetchApi(
    `${API_BASE}/horoscope/planet-report?api_key=${API_KEY}&dob=${formatDate(dob)}&tob=${tob}&lat=${lat}&lon=${lon}&tz=${tz}&planet=${planet}&lang=${lang}`,
    `Failed to fetch Planet Report for ${planet}`
  );

  
/**
 * Fetch Jaimini Karakas
 */
export const fetchJaiminiKarakas = (dob, tob, lat, lon, tz = 5.5, lang = "en") =>
  fetchApi(
    `${API_BASE}/extended-horoscope/jaimini-karakas?api_key=${API_KEY}&dob=${formatDate(dob)}&tob=${tob}&lat=${lat}&lon=${lon}&tz=${tz}&lang=${lang}`,
    "Failed to fetch Jaimini Karakas"
  );

/**
 * Fetch Planet Details
 */
export const fetchPlanetDetails = (dob, tob, lat, lon, planet, tz = 5.5, lang = "en") =>
  fetchApi(
    `${API_BASE}/horoscope/planet-details?api_key=${API_KEY}&dob=${formatDate(dob)}&tob=${tob}&lat=${lat}&lon=${lon}&tz=${tz}&planet=${planet}&lang=${lang}`,
    `Failed to fetch Planet Details for ${planet}`
  );

/**
 * Fetch Planets in Houses
 */
export const fetchPlanetsInHouses = (dob, tob, lat, lon, tz = 5.5, lang = "en") =>
  fetchApi(
    `${API_BASE}/horoscope/planets-in-houses?api_key=${API_KEY}&dob=${formatDate(dob)}&tob=${tob}&lat=${lat}&lon=${lon}&tz=${tz}&lang=${lang}`,
    "Failed to fetch Planets in Houses"
  );

/**
 * Fetch Ascendant Report
 */
export const fetchAscendantReport = (dob, tob, lat, lon, tz = 5.5, lang = "en") =>
  fetchApi(
    `${API_BASE}/extended-horoscope/ascendant-report?api_key=${API_KEY}&dob=${formatDate(dob)}&tob=${tob}&lat=${lat}&lon=${lon}&tz=${tz}&lang=${lang}`,
    "Failed to fetch Ascendant Report"
  );

export const fetchPersonalCharacteristics = (dob, tob, lat, lon, tz = 5.5, lang = "en") =>
  fetchApi(
    `${API_BASE}/horoscope/personal-characteristics?api_key=${API_KEY}&dob=${formatDate(dob)}&tob=${tob}&lat=${lat}&lon=${lon}&tz=${tz}&lang=${lang}`,
    "Failed to fetch Personal Characteristics"
  );
