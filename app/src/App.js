import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Cookies from 'js-cookie';

import { HomePage } from './HomePage.js';
import { GameRoomPage } from './GameRoomPage.js';
import { CreateGameRoomPage } from './CreateGameRoomPage.js';
import { NotFoundPage } from './NotFoundPage.js';


export function App() {
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
        <div>
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
