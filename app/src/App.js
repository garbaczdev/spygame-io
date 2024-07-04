import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

import Cookies from 'js-cookie';

import HomePage from './HomePage.js';
import GameRoomPage from './GameRoomPage.js';


function App() {

  const [deviceId, setDeviceId] = useState(Cookies.get("deviceId"));

  useEffect(() => {
    if (!deviceId) {
      fetch('/api/device-id')
        .then(response => response.text())
        .then(data => setDeviceId(data));
    }
  }, [deviceId]);

  return (
    <>
      {
        deviceId === ""
        ? <div></div>
        :
        <Router>
          <nav>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/game-room">Game</Link></li>
            </ul>
          </nav>
          <Routes>
            <Route exact path="/" element={<HomePage />} />
            <Route path="/game-room" element={<GameRoomPage />} />
          </Routes>
        </Router>
      }
    </>
  );
}

export default App;
