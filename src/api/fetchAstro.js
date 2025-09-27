export async function fetchAstroData() {
  const response = await fetch("https://api.vedicastroapi.com/v1/rashi", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${import.meta.env.VITE_VEDIC_ASTRO_KEY}`
    },
    body: JSON.stringify({
      date: "1995-09-26",
      time: "10:30",
      place: "Delhi"
    })
  });

  if (!response.ok) throw new Error("Failed to fetch Astro data");
  return response.json();
}

export async function fetchPanchangData(date, time, lat, lon, tz = 5.5) {
  const apiKey = import.meta.env.VITE_VEDIC_ASTRO_KEY;
  
  // Format date as DD/MM/YYYY
  const formattedDate = date.split('-').reverse().join('/');
  
  const url = `https://api.vedicastroapi.com/v3-json/panchang/panchang?api_key=${apiKey}&date=${formattedDate}&tz=${tz}&lat=${lat}&lon=${lon}&time=${time}&lang=en`;
  
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Panchang data: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}