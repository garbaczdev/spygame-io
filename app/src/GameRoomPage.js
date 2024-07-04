import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Cookies from 'js-cookie';
import io from 'socket.io-client';


function GameRoomPage() {

  const { gameRoomId } = useParams();
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Open a new socket connection
    const newSocket = io(window.location.origin, {
      autoConnect: true,
      reconnectionAttempts: 5, // Attempt to reconnect 5 times
      reconnectionDelay: 1000,  // Wait 1 second between reconnection attempts
      query: {
        gameRoomId 
      }
    });

    newSocket.on('noGameRoom', () => {
      console.log('Bad game room!');
      navigate('/');
    });

    setSocket(newSocket);

    // Cleanup function to close the socket connection
    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [navigate]);

  useEffect(() => {
    if (!socket) return;
    socket.on('connect', () => {
      console.log('Connected to socket');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from socket');
    });

    socket.on('noGameRoom', () => {
      console.log('Bad game room!');
      navigate('/');
    });

    // Add other socket event listeners here

    return () => {
      // Clean up all event listeners here
      socket.off('connect');
      socket.off('disconnect');
      socket.off('noGameRoom');
      // Remove other socket event listeners here
    };
  }, [socket]);

  return <h2>Game Page</h2>;
}

export default GameRoomPage;
