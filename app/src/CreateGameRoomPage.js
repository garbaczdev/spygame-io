import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


function CreateGameRoomPage() {

  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/create-game-room', { method: 'POST', credentials: 'include' })
      .then(response => response.text())
      .then(gameRoomId => navigate(`/game-room/${gameRoomId}`));
  }, [navigate]);

  return <h2>Create Game Page</h2>;
}

export default CreateGameRoomPage;
