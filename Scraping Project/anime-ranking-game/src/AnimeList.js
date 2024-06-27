// src/AnimeList.js
import React, { useEffect, useState } from 'react';

const AnimeList = () => {
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/scrape');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setAnimeList(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h1>Top Anime List</h1>
      <ul>
        {animeList.map((anime) => (
          <li key={anime.rank}>
            <strong>{anime.rank}</strong> - {anime.title} - {anime.score}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AnimeList;
