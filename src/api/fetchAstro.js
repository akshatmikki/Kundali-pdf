const API_BASE = "https://api.vedicastroapi.com/v3-json";
const API_KEY = import.meta.env.VITE_VEDIC_ASTRO_KEY;

// 1️⃣ Panchang
export async function fetchPanchangData(date, time, lat, lon, tz = 5.5) {
  const formattedDate = date.split("-").reverse().join("/");
  const url = `${API_BASE}/panchang/panchang?api_key=${API_KEY}&date=${formattedDate}&tz=${tz}&lat=${lat}&lon=${lon}&time=${time}&lang=en`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch Panchang data: ${res.status}`);
  return res.json();
}

// 2️⃣ Kundli
export async function fetchKundliDetails(dob, tob, lat, lon, tz = 5.5) {
  const formattedDob = dob.split("-").reverse().join("/");
  const url = `${API_BASE}/extended-horoscope/extended-kundli-details?api_key=${API_KEY}&dob=${formattedDob}&tob=${tob}&lat=${lat}&lon=${lon}&tz=${tz}&lang=en`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch Kundli details: ${res.status}`);
  return res.json();
}

// 3️⃣ Sunrise
export async function fetchSunrise(date, time, lat, lon, tz = 5.5) {
  const formattedDate = date.split("-").reverse().join("/");
  const url = `${API_BASE}/panchang/sunrise?api_key=${API_KEY}&date=${formattedDate}&tz=${tz}&lat=${lat}&lon=${lon}&time=${time}&lang=en`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch Sunrise data: ${res.status}`);
  return res.json();
}

// 4️⃣ Sunset
export async function fetchSunset(date, time, lat, lon, tz = 5.5) {
  const formattedDate = date.split("-").reverse().join("/");
  const url = `${API_BASE}/panchang/sunset?api_key=${API_KEY}&date=${formattedDate}&tz=${tz}&lat=${lat}&lon=${lon}&time=${time}&lang=en`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch Sunset data: ${res.status}`);
  return res.json();
}

// 5️⃣ Moon Sign
export async function fetchMoonSign(dob, tob, lat, lon, tz = 5.5) {
  const formattedDob = dob.split("-").reverse().join("/");
  const url = `${API_BASE}/extended-horoscope/find-moon-sign?api_key=${API_KEY}&dob=${formattedDob}&tob=${tob}&lat=${lat}&lon=${lon}&tz=${tz}&lang=en`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch Moon Sign: ${res.status}`);
  return res.json();
}

// 6️⃣ Sun Sign
export async function fetchSunSign(dob, tob, lat, lon, tz = 5.5) {
  const formattedDob = dob.split("-").reverse().join("/");
  const url = `${API_BASE}/extended-horoscope/find-sun-sign?api_key=${API_KEY}&dob=${formattedDob}&tob=${tob}&lat=${lat}&lon=${lon}&tz=${tz}&lang=en`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch Sun Sign: ${res.status}`);
  return res.json();
}

// 7️⃣ Chart Image
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

export async function fetchDivisionalChart({
  dob,
  tob,
  lat,
  lon,
  tz = 5.5,
  div = "D1",
  transit_date = "",
  response_type = "planet_object",
}) {
  const formattedDob = dob.split("-").reverse().join("/"); // DD/MM/YYYY
  const url = `${API_BASE}/horoscope/divisional-charts?api_key=${API_KEY}&dob=${formattedDob}&tob=${tob}&lat=${lat}&lon=${lon}&tz=${tz}&div=${div}&transit_date=${transit_date}&response_type=${response_type}&lang=en`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch divisional chart (${div}): ${res.status}`);
  return res.json();
}

// 8️⃣ Mahadasha
export async function fetchMahaDasha(dob, tob, lat, lon, tz = 5.5) {
  const formattedDob = dob.split("-").reverse().join("/"); // DD/MM/YYYY
  const url = `${API_BASE}/dashas/maha-dasha?api_key=${API_KEY}&dob=${formattedDob}&tob=${tob}&lat=${lat}&lon=${lon}&tz=${tz}&lang=en`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch Maha Dasha: ${res.status}`);
  return res.json();
}

// 9️⃣ Antar Dasha
export async function fetchAntarDasha(dob, tob, lat, lon, tz = 5.5) {
  const formattedDob = dob.split("-").reverse().join("/"); // DD/MM/YYYY
  const url = `${API_BASE}/dashas/antar-dasha?api_key=${API_KEY}&dob=${formattedDob}&tob=${tob}&lat=${lat}&lon=${lon}&tz=${tz}&lang=en`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch Antar Dasha: ${res.status}`);
  return res.json();
}

// 10️⃣ Planet Report
export async function fetchPlanetReport({
  dob,
  tob,
  lat,
  lon,
  tz = 5.5,
  planet, // default planet
  lang = "en",
}) {
  const formattedDob = dob.split("-").reverse().join("/"); // DD/MM/YYYY
  const url = `${API_BASE}/horoscope/planet-report?api_key=${API_KEY}&dob=${formattedDob}&tob=${tob}&lat=${lat}&lon=${lon}&tz=${tz}&planet=${planet}&lang=${lang}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch Planet Report for ${planet}: ${res.status}`);
  return res.json();
}

// 11️⃣ Sade Sati Table
export async function fetchSadeSatiTable({ dob, tob, lat, lon, tz = 5.5, lang = 'en' }) {
  
  const url = `https://api.vedicastroapi.com/v3-json/extended-horoscope/sade-sati-table?api_key=${API_KEY}&dob=${dob}&tob=${tob}&lat=${lat}&lon=${lon}&tz=${tz}&lang=${lang}`;
  
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch Sade Sati Table: ${res.status}`);
  
  return res.json();
}