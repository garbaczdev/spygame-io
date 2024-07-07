import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


export function CreateGameRoomPage() {

  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/create-game-room', { method: 'POST', credentials: 'include' })
      .then(response => response.text())
      .then(gameRoomId => navigate(`/game-room/${gameRoomId}`));
  }, [navigate]);

  // This can be a waiting queue in the future
  return <></>;
}
