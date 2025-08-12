import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!longUrl) return;

    try {
const res = await axios.post('/api/url/shorten', { longUrl });

      setShortUrl(res.data.shortUrl);
    } catch (err) {
      console.error(err);
      alert('Error shortening URL');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>URL Shortener</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter long URL"
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          style={{ width: '300px', padding: '10px' }}
        />
        <button type="submit" style={{ padding: '10px 20px', marginLeft: '10px' }}>
          Shorten
        </button>
      </form>

      {shortUrl && (
        <p style={{ marginTop: '20px' }}>
          Short URL: <a href={shortUrl} target="_blank" rel="noreferrer">{shortUrl}</a>
        </p>
      )}
    </div>
  );
}

export default App;
