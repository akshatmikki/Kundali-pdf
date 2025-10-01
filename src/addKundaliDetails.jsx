import React, { useState } from 'react';
import { fetchKundliDetails, fetchMoonSign, fetchAscendant } from './fetchAstro';

// Cosmic overview page narrative component
function ThreePillarsOverview() {
  return (
    <div style={{ padding: 20, backgroundColor: '#582f0e', color: '#fff', borderRadius: '8px', margin: '20px 0' }}>
      <h2 style={{ textAlign: 'center', color: '#b5882b' }}>Three Pillars of the Self: Chandra, Lagna & Nakshatra</h2>
      <p>
        Your Lagna (Ascendant), Moon Sign (Chandra), and Nakshatra are the VIPs of your birth chart!
        They shape your personality, emotions, and how you interact with the world.
      </p>
      <p>
        While your Lagna decides how you present yourself, your Moon Sign reflects your inner emotional world.
        Your Nakshatra adds depth and influences life patterns. Together, they create a unique cosmic blueprint just for you.
      </p>
      <p style={{ fontStyle: 'italic', textAlign: 'center' }}>Let's explore what these celestial influences say about you!</p>
      <div style={{ textAlign: 'center', marginTop: 20 }}>
        <img src="/Astrology.png" alt="Cosmic Three Pillars" style={{ width: 200 }} />
      </div>
    </div>
  );
}

function KundaliPage({ kundli }) {
  const resp = kundli?.response || {};
  return (
    <div style={{ padding: 20 }}>
      <h2>Kundali Details</h2>
      <p>
        You belong to the <strong>{resp.gana || 'N/A'}</strong> gana, which influences your basic temperament and nature.
        Your yoni sign <strong>{resp.yoni || 'N/A'}</strong> represents your instinctive emotional responses.
      </p>
      <p>
        With a vasya type of <strong>{resp.vasya || 'N/A'}</strong>, you naturally attract and are attracted to certain energies.
        Your nadi, <strong>{resp.nadi || 'N/A'}</strong>, relates to your health and vitality rhythms.
      </p>
      <p>
        The varna <strong>{resp.varna || 'N/A'}</strong> speaks to your social and spiritual role.
        Your ascendant sign is <strong>{resp.ascendant_sign || 'N/A'}</strong>, which shapes your outward personality.
      </p>
      <p>
        You have the moon placed in the rasi of <strong>{resp.rasi || 'N/A'}</strong>, influencing your emotional world.
        Your nakshatra, <strong>{resp.nakshatra || 'N/A'}</strong>, points to the soul lessons you are here to learn.
      </p>
    </div>
  );
}

function MoonSignPage({ moonSign }) {
  return (
    <div style={{ padding: 20, backgroundColor: '#532a0d', color: 'white', borderRadius: '8px', margin: '20px 0' }}>
      <h2 style={{ color: '#b48825', textAlign: 'center' }}>Moon Sign</h2>
      <h3 style={{ textAlign: 'center', margin: '10px 0' }}>{moonSign?.response?.moon_sign}</h3>
      <p style={{ lineHeight: 1.5 }}>
        {moonSign?.response?.prediction}
      </p>
    </div>
  );
}

function AscendantPage({ ascendant }) {
  return (
    <div style={{ padding: 20, backgroundColor: '#532a0d', color: 'white', borderRadius: '8px', margin: '20px 0' }}>
      <h2 style={{ color: '#b48825', textAlign: 'center' }}>Ascendant</h2>
      <h3 style={{ textAlign: 'center', margin: '10px 0' }}>{ascendant?.response?.ascendant}</h3>
      <p style={{ lineHeight: 1.5 }}>
        {ascendant?.response?.prediction}
      </p>
    </div>
  );
}

export default function AddKundaliDetails() {
  const [dob, setDob] = useState('');
  const [tob, setTob] = useState('');
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');
  const [tz, setTz] = useState(5.5);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const validateInputs = () => {
    if (!dob) return 'Please enter Date of Birth';
    if (!tob) return 'Please enter Time of Birth';
    if (!lat || isNaN(lat)) return 'Please enter valid Latitude';
    if (!lon || isNaN(lon)) return 'Please enter valid Longitude';
    if (tz === '' || isNaN(tz)) return 'Please enter valid Timezone';
    return null;
  };

  async function handleFetchData() {
    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      setData(null);
      return;
    }

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const kundli = await fetchKundliDetails(dob, tob, lat, lon, tz);
      const moonSign = await fetchMoonSign(dob, tob, lat, lon, tz);
      const ascendant = await fetchAscendant(dob, tob, lat, lon, tz);
      setData({ kundli, moonSign, ascendant });
    } catch (err) {
      setError('Failed to fetch data: ' + err.message);
      setData(null);
    }

    setLoading(false);
  }

  return (
    <div>
      <h1>Kundali Details Generator</h1>
      <div>
        <label>DOB:</label>
        <input type="date" value={dob} onChange={e => setDob(e.target.value)} />
      </div>
      <div>
        <label>Time of Birth (HH:mm):</label>
        <input type="time" value={tob} onChange={e => setTob(e.target.value)} />
      </div>
      <div>
        <label>Latitude:</label>
        <input type="number" value={lat} onChange={e => setLat(e.target.value)} step="0.01" />
      </div>
      <div>
        <label>Longitude:</label>
        <input type="number" value={lon} onChange={e => setLon(e.target.value)} step="0.01" />
      </div>
      <div>
        <label>Timezone:</label>
        <input type="number" value={tz} onChange={e => setTz(parseFloat(e.target.value))} step="0.25" />
      </div>
      <button onClick={handleFetchData} disabled={loading}>
        {loading ? 'Fetching...' : 'Generate Kundali'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {data && (
        <>
          <ThreePillarsOverview />
          <KundaliPage kundli={data.kundli} />
          <MoonSignPage moonSign={data.moonSign} />
          <AscendantPage ascendant={data.ascendant} />
        </>
      )}
    </div>
  );
}
