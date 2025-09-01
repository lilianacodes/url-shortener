import React, { useState } from 'react';
import './App.css';

function App() {
  const [longUrl, setLongUrl] = useState('');   // Input URL
  const [shortUrl, setShortUrl] = useState(''); // Shortened URL

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload

    try {
      const response = await fetch('http://localhost:5000/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ longUrl }),
      });

      // Parse response directly as JSON
      const data = await response.json();

      if (data.shortId) {
        setShortUrl(`http://localhost:5000/${data.shortId}`); // Build short URL
      } else {
        console.error('shortId not returned by server', data);
      }
    } catch (error) {
      console.error('Error shortening URL:', error);
    }
  };

  return (
    <div className="App">
      <h1>URL Shortener</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="url"
          placeholder="Enter your long URL"
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          required
        />
        <button type="submit">Shorten</button>
      </form>

      {/* Display short URL if available */}
      {shortUrl && (
        <div style={{ marginTop: '20px' }}>
          <a href={shortUrl} target="_blank" rel="noopener noreferrer">
            {shortUrl}
          </a>
        </div>
      )}
    </div>
  );
}

export default App;


