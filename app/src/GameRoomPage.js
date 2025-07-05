import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { Navbar, Button } from 'react-bootstrap';
import io from 'socket.io-client';
import QRCode from 'qrcode.react';

import { GamePhaseComponent } from './game/GamePhaseComponent.js';


export function GameRoomPage() {

  const { gameRoomId } = useParams();
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [gameState, setGameState] = useState({});
  const [menuOpened, setMenuOpened] = useState(false);

  useEffect(() => {
    // Open a new socket connection
    const socket = io(window.location.origin, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 1000000000, // Attempt to reconnect 5 times
      reconnectionDelay: 500,  // Wait 1 second between reconnection attempts
      reconnectionDelayMax: 2000,
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

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        if (!socket.connected) {
          console.log('App is visible. Attempting to reconnect...');
          socket.connect(); // Try to reconnect when the app becomes visible
        }
      } else {
        // Optional: Disconnect the socket when the app goes to the background
        console.log('App is not visible. Disconnecting...');
        socket.disconnect();
      }
    };

    // Listen for the visibility change event
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup function to close the socket connection
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
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
      socket && socket.connected && Object.entries(gameState).length > 0
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
          <div className="container text-center d-flex flex-column justify-content-center align-items-center vh-100">
            <div style={{paddingBottom: '50px'}}>
              <QRCode value={window.location.href} size={256} />
            </div>
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
      <h1>Reconnecting...</h1>
    }
    </>
  );
}
