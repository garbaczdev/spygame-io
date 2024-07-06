import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import io from 'socket.io-client';


function JoinGamePhaseComponent({socket, gameState}) {

  const [nameInputValue, setNameInputValue] = useState("");

  return (
    <>
    {
      gameState.phase.state.nameRequired
      ?
      <div className="container text-center">
        <h1 className="m-5">New Player</h1>
        <input 
          type="text" 
          className="form-control mb-3"
          placeholder="Name"
          value={nameInputValue} 
          onChange={(event) => setNameInputValue(event.target.value)}
        />
        <button 
          className="btn btn-primary btn-lg"
          onClick={
          () => {
            if (nameInputValue.length === 0) return;
            socket.emit("action", {
              phase: "join",
              type: "provideName",
              data: {
                name: nameInputValue
              }
            });
            setNameInputValue("");
          }
        }>
          Create player
        </button>
      </div>
      :
      <div className="row flex-column">
        <h1 className="m-5">Players</h1>
        {
          gameState.allPlayers.filter(
            player => player.name.length > 0
          ).map(
            (player, index) => 
            <div 
              key={index}
              className="border p-3 mb-1"
              style={{ width: '80vw' }}
            >
              {
                player.name
                + (player.isCurrentPlayer ? " (You) " : "")
                + (player.isHost ? " (Host) " : "")
              }
            </div>
          )
        }
      </div>
    }
    </>
  ); 
}


function GamePhaseComponent({socket, gameState}) {
  const decideGamePhaseComponent = (gamePhase) => {
    if (gamePhase === "join") return <JoinGamePhaseComponent socket={socket} gameState={gameState} />;
  }
  return decideGamePhaseComponent(gameState.phase.name);
}


function GameRoomPage() {

  const { gameRoomId } = useParams();
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [gameState, setGameState] = useState({});

  useEffect(() => {
    // Open a new socket connection
    const socket = io(window.location.origin, {
      autoConnect: true,
      reconnectionAttempts: 5, // Attempt to reconnect 5 times
      reconnectionDelay: 1000,  // Wait 1 second between reconnection attempts
      query: {
        gameRoomId 
      }
    });

    socket.on('gameState', newGameState => {
      console.log(newGameState);
      if (newGameState.finished) {
        navigate('/');
        return;
      } 
      
      setGameState(newGameState)
    });

    setSocket(socket);

    // Cleanup function to close the socket connection
    return () => {
      if (socket) {
        socket.off('connect');
        socket.off('disconnect');
        socket.disconnect();
      }
    };
  }, [navigate, gameRoomId]);

  return (
    <>
    {
      socket && Object.entries(gameState).length > 0
      ?
      <GamePhaseComponent socket={socket} gameState={gameState} />
      :
      <></>
    }
    </>
  );
}

export default GameRoomPage;
