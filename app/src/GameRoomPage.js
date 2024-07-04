import React, { useEffect, useState } from 'react';

import Cookies from 'js-cookie';
import io from 'socket.io-client';


function GameRoomPage() {

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Open a new socket connection
    console.log(Cookies.get("deviceId"));
    const newSocket = io(window.location.origin, {
      autoConnect: true,
      reconnectionAttempts: 5, // Attempt to reconnect 5 times
      reconnectionDelay: 1000  // Wait 1 second between reconnection attempts
    });

    setSocket(newSocket);

    // Cleanup function to close the socket connection
    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  return <h2>Game Page</h2>;
}

export default GameRoomPage;
