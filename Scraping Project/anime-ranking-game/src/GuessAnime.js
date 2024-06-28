import React, { useState, useEffect } from 'react';
import './App.css'

const GuessAnimeGame = () => {
  const [anime, setAnime] = useState(null);
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attempts, setAttempts] = useState(3);
  const [showHint, setShowHint] = useState(false);
  const [guessHistory, setGuessHistory] = useState([]);

  async function fetchRandomAnime() {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/random-anime');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setAnime(data);
      setAttempts(3);
      setShowHint(false);
      setMessage('');
      setGuess('');
      setGuessHistory([]);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomAnime();
  }, []);

  function handleGuess(e) {
    e.preventDefault(); 
  
    const guessedRank = parseInt(guess);
    if (guessedRank === parseInt(anime.rank)) {
      setMessage('Correct! You guessed the right ranking.');
    } else {
      const remainingAttempts = attempts - 1; 
      let guessResult = '';
  
      if (guessedRank < parseInt(anime.rank)) {
        guessResult = `Wrong! ${guessedRank} is too high. `;
      } else {
        guessResult = `Wrong! ${guessedRank} is too low. `;
      }
  
      if (remainingAttempts > 0) {
        setAttempts(remainingAttempts);
        setMessage(`${guessResult} ${remainingAttempts} attempts left.`);
      } else {
        setMessage(`Wrong! The correct ranking is ${anime.rank}.`);
        setShowHint(true); 
      }
  
      setGuessHistory([
        ...guessHistory, 
        {
          guess: guessedRank,
          result: guessResult,
        },
      ]); 
    }
  }
  

  const handleHintClick = () => {
    setMessage(`Hint: Ratings - ${anime.score}`);
    setShowHint(false);
  };

  const renderGuessHistory = () => (
    <div style={{ marginTop: '20px' }}>
      <h3>Guess History</h3>
      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
        {guessHistory.map((item, index) => (
          <div key={index} style={guessHistoryItemStyle}>
            <div style={guessHistoryItemContentStyle}>
              <p>Guess: {item.guess}</p>
              <p>Result: {item.result}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const guessHistoryItemStyle = {
    backgroundColor: '#f0f0f0',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px',
  };

  const guessHistoryItemContentStyle = {
    display: 'flex',
    justifyContent: 'space-between',
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h1>Guess the Ranking of the Anime</h1>
      {anime && (
        <div>
          <h2>{anime.title}</h2>
          <img src={anime.image_url} alt={anime.title} />
          <form onSubmit={handleGuess}>
            <input
              type="number"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              placeholder="Enter your guess"
            />
            <button type="submit">Submit Guess</button>
          </form>
          {message && <p>{message}</p>}
          {attempts === 1 && !showHint && (
            <button onClick={() => setShowHint(true)}>Get Hint</button>
          )}
          {showHint && <button onClick={handleHintClick}>Show Hint</button>}
          <button onClick={fetchRandomAnime}>Next Anime</button>
          {guessHistory.length > 0 && renderGuessHistory()}
        </div>
      )}
    </div>
  );
};

export default GuessAnimeGame;
