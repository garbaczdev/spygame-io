import React from 'react';

import { useNavigate } from 'react-router-dom';


function HomePage() {

  const navigate = useNavigate();

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="container text-center">
        <h1 className="m-5">spygame.io</h1>
        <button 
          onClick={() => navigate('/create-game-room')} 
          className="btn btn-primary btn-lg"
        >
          Create Game
        </button>
      </div>
    </div>
  );
}

export default HomePage;
