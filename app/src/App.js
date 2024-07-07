import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

import Cookies from 'js-cookie';

import HomePage from './HomePage.js';
import GameRoomPage from './GameRoomPage.js';
import CreateGameRoomPage from './CreateGameRoomPage.js';
import NotFoundPage from './NotFoundPage.js';


function App() {
  const [deviceId, setDeviceId] = useState(Cookies.get("deviceId"));

  useEffect(() => {
    if (!deviceId) {
      fetch('/api/device-id')
        .then(response => response.text())
        .then(receivedDeviceId => {
          setDeviceId(receivedDeviceId);
        });
    }
  }, [deviceId]);

  return (
    <>
      {
        deviceId
        ?
        <div className="d-flex justify-content-center align-items-center vh-100 ">
          <Router>
            <Routes>
              <Route exact path="/" element={<HomePage />} />
              <Route path="/create-game-room" element={<CreateGameRoomPage />} />
              <Route path="/game-room/:gameRoomId" element={<GameRoomPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Router>
        </div>
        :
        <></>
      }
    </>
  );
}

export default App;
