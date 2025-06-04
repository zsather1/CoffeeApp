import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/people_data')
      .then(response => response.json())
      .then(data => setData(data.data));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>
          {data ? data : 'Loading...'}
        </p>
      </header>
    </div>
  );
}

export default App;