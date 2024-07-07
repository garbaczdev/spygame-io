import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { Navbar, Button, Collapse } from 'react-bootstrap';
import io from 'socket.io-client';
import QRCode from 'qrcode.react';


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
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <QRCode value={window.location.href} size={256} />
        </div>
        <button 
          className="btn btn-primary btn-lg mt-5"
          style={{ width: 'auto' }} 
          onClick={
          () => navigator.clipboard.writeText(window.location.href)
        }>
          Copy Link
        </button>
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
  const [menuOpened, setMenuOpened] = useState(false);

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
      <>
        <Navbar
          bg="light"
          expand="lg"
          style={{
            position: 'fixed',
            top: "10px",
            right: "10px",
            zIndex: 1000,
           fontSize: '10rem'
          }}
        >
          <Button
            variant="outline-secondary"
            onClick={() => setMenuOpened(!menuOpened)}
            aria-controls="example-collapse-text"
            aria-expanded={menuOpened}
          >
            &#9776; {/* Hamburger Icon */}
          </Button>
        </Navbar>
        <div 
          style={{
            position: 'fixed',
            top: menuOpened ? "0" : "-120%",
            left: 0,
            width: '100%',
            height: "100vh",
            backgroundColor: 'white',
            zIndex: 100,
            overflow: 'hidden',
            transition: "top 0.3s ease-in-out",
          }}
        >
          <div className="container text-center d-flex justify-content-center align-items-center vh-100">
            <div>
              <button 
                className="btn btn-lg btn-danger"
                onClick={
                () => {
                  socket.emit("action", {
                    phase: "all",
                    type: "leaveRoom",
                    data: {}
                  });
                }
              }> Leave Game </button>
            </div>
          </div>
        </div>
        <GamePhaseComponent socket={socket} gameState={gameState} />
      </>
      :
      <></>
    }
    </>
  );
}

export default GameRoomPage;
